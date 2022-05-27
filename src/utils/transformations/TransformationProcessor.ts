import { Datapoint } from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import {
  AbstractDataset,
  AbstractDatasetTree,
  AggregateDataset,
  AggregationDataset,
  AnalyticsDataset,
  CountDataset,
  DatafileDataset,
  DateFormatDataset,
  GetDecoratorsDataset,
  IndexDataset,
  OTQLDataset,
  RatioDataset,
  ReduceDataset,
} from '../../models/dashboards/dataset/dataset_tree';
import { AbstractSource } from '../../models/dashboards/dataset/datasource_tree';
import AudienceSegmentService, {
  IAudienceSegmentService,
} from '../../services/AudienceSegmentService';
import ChannelService, { IChannelService } from '../../services/ChannelService';
import { ChartType } from '../../services/ChartDatasetService';
import CompartmentService, { ICompartmentService } from '../../services/CompartmentService';
import { formatDate } from '../DateHelper';
import { DecoratorsTransformation } from './DecoratorsTransformation';
import DatasetDateFormatter from './FormatDatesTransformation';
import { indexDataset } from './IndexTranformation';
import { percentages } from './PercentagesTransformation';
import { reduceDataset } from './ReduceTransformation';

export const DEFAULT_Y_KEY = {
  key: 'value',
  message: 'count',
};

export class TransformationProcessor {
  private channelService: IChannelService = new ChannelService();
  private compartmentService: ICompartmentService = new CompartmentService();
  private audienceSegmentService: IAudienceSegmentService = new AudienceSegmentService();

  /**
   * Aggregates the tree of transformations
   * into a single abstract dataset usable in highcharts charts
   *
   * @param datamartId for getting decorators
   * @param organisationId for getting decorators
   * @param chartType
   * @param xKey
   * @param dataset
   * @returns
   */
  async applyTransformations(
    datamartId: string,
    organisationId: string,
    chartType: ChartType,
    xKey: string,
    dataset: AbstractDatasetTree,
  ): Promise<AbstractDataset | undefined> {
    const sourceType = dataset.type.toLowerCase();

    // Leaf transformations, there is nothing to do
    if (sourceType === 'otql') {
      const otqlDataset = dataset as OTQLDataset;
      return otqlDataset.dataset;
    } else if (sourceType === 'activities_analytics' || sourceType === 'collection_volumes') {
      const analyticsDataset = dataset as AnalyticsDataset;
      return analyticsDataset.dataset;
    } else if (sourceType === 'data_file') {
      const datafileDataset = dataset as DatafileDataset;
      return datafileDataset.dataset;
    }
    // Aggregate transformations
    else if (sourceType === 'join') {
      const aggregationDataset = dataset as AggregationDataset;
      const childDatasets = await Promise.all(
        aggregationDataset.children.map(s => {
          return this.applyTransformations(datamartId, organisationId, chartType, xKey, s);
        }),
      );
      return this.aggregateDatasets(xKey, childDatasets as AggregateDataset[]);
    } else if (sourceType === 'to-list') {
      const aggregationDataset = dataset as AggregationDataset;
      const childDatasets = aggregationDataset.children;
      return Promise.all(
        childDatasets.map(s =>
          this.applyTransformations(datamartId, organisationId, chartType, xKey, s),
        ),
      ).then(datasets => {
        return this.aggregateCountsIntoList(
          xKey,
          datasets as CountDataset[],
          childDatasets,
          dataset.series_title,
        );
      });
    } else if (sourceType === 'to-percentages') {
      const aggregationDataset = dataset as AggregationDataset;
      const childDatasets = aggregationDataset.children;
      if (childDatasets.length === 1) {
        return this.applyTransformations(
          datamartId,
          organisationId,
          chartType,
          xKey,
          childDatasets[0],
        ).then(d => {
          return percentages(xKey, d as AggregateDataset);
        });
      } else return this.rejectWrongNumberOfArguments('to-percentages', 1, childDatasets.length);
    } else if (sourceType === 'index') {
      const _indexDataset = dataset as IndexDataset;
      return this.computeIndex(datamartId, organisationId, _indexDataset, chartType, xKey);
    } else if (sourceType === 'ratio') {
      const ratioDataset = dataset as RatioDataset;
      const datasetValue = this.applyTransformations(
        datamartId,
        organisationId,
        chartType,
        xKey,
        ratioDataset.children[0],
      );
      const datasetTotal = this.applyTransformations(
        datamartId,
        organisationId,
        chartType,
        xKey,
        ratioDataset.children[1],
      );
      return Promise.all([datasetValue, datasetTotal]).then(datasets => {
        return this.computeRatio(datasets[0] as CountDataset, datasets[1] as CountDataset);
      });
    } else if (sourceType === 'format-dates') {
      const dateFormatDataset = dataset as DateFormatDataset;
      const format = dateFormatDataset.date_options;
      const datasetToBeFormatted = this.applyTransformations(
        datamartId,
        organisationId,
        chartType,
        xKey,
        dateFormatDataset.children[0],
      );
      return datasetToBeFormatted.then(result => {
        if (result) return this.datasetDateFormatter.applyFormatDates(result, xKey, format);
        else return Promise.resolve(undefined);
      });
    } else if (sourceType === 'reduce') {
      const datasetToReduce = dataset as ReduceDataset;
      const childDataset = this.applyTransformations(
        datamartId,
        organisationId,
        chartType,
        xKey,
        datasetToReduce.children[0],
      );
      return childDataset.then(result => {
        if (result) return reduceDataset(xKey, result, datasetToReduce.reduce_options.type);
        else return Promise.resolve(undefined);
      });
    } else if (sourceType === 'get-decorators') {
      const getDecoratorsSource = dataset as GetDecoratorsDataset;
      const getDecoratorsOptions = getDecoratorsSource.decorators_options;

      if (getDecoratorsSource.children.length === 1) {
        const datasetToBeDecorated = await this.applyTransformations(
          datamartId,
          organisationId,
          chartType,
          xKey,
          getDecoratorsSource.children[0],
        );

        if (datasetToBeDecorated)
          return this.decoratorsTransformation.applyGetDecorators(
            datasetToBeDecorated,
            xKey,
            getDecoratorsOptions,
            datamartId,
            organisationId,
          );
        else return Promise.resolve(undefined);
      } else
        return this.rejectWrongNumberOfArguments(
          'get-decorators',
          1,
          getDecoratorsSource.children.length,
        );
    } else {
      return Promise.reject(`Unknown source type ${sourceType} `);
    }
  }

  private computeIndex(
    datamartId: string,
    organisationId: string,
    indexSource: IndexDataset,
    chartType: ChartType,
    xKey: string,
  ) {
    const childSources = indexSource.children;
    if (childSources && childSources.length === 2) {
      return Promise.all(
        childSources.map(s =>
          this.applyTransformations(datamartId, organisationId, chartType, xKey, s),
        ),
      ).then(datasets => {
        return indexDataset(
          datasets[0] as AggregateDataset,
          datasets[1] as AggregateDataset,
          xKey,
          indexSource.options,
        );
      });
    } else {
      return this.rejectWrongNumberOfArguments('to-percentages', 2, childSources.length);
    }
  }

  private rejectWrongNumberOfArguments(
    transformationName: string,
    expected: number,
    provided: number,
  ) {
    return Promise.reject(
      `Wrong number of arguments for ${transformationName} transformation, ${expected} expected ${provided} provided`,
    );
  }

  private datasetDateFormatter: DatasetDateFormatter = new DatasetDateFormatter((date, format) =>
    formatDate(date, format),
  );

  private decoratorsTransformation: DecoratorsTransformation = new DecoratorsTransformation(
    this.channelService,
    this.compartmentService,
    this.audienceSegmentService,
  );

  private aggregateCountsIntoList(
    xKey: string,
    datasets: Array<CountDataset | undefined>,
    sources: AbstractSource[],
    listSeriesTitle?: string,
  ): AggregateDataset | undefined {
    const dataset = datasets.map((d: CountDataset, index: number) => {
      return {
        [xKey]: sources[index].series_title,
        [listSeriesTitle || DEFAULT_Y_KEY.key]: d.value,
      };
    });

    return {
      dataset: dataset,
      metadata: {
        seriesTitles: [listSeriesTitle || DEFAULT_Y_KEY.key],
      },
      type: 'aggregate',
    };
  }

  private aggregateDatasets(
    xKey: string,
    datasets: Array<AggregateDataset | undefined>,
  ): AggregateDataset | undefined {
    type DatasetAcc = { [key: string]: Datapoint };
    const datasetAcc: DatasetAcc = {};

    const seriesTitles = datasets.map(d => d?.metadata.seriesTitles[0]);
    datasets.forEach(dataset => {
      if (!!dataset) {
        dataset.dataset.forEach(datapoint => {
          const categoryKey = datapoint[xKey] as string;
          const current = datasetAcc[categoryKey];
          datasetAcc[categoryKey] = {
            ...current,
            ...datapoint,
          };
        });
      }
    });

    const newDataset: Datapoint[] = [];
    Object.entries(datasetAcc).forEach(field => {
      const fieldValue = field[1];
      newDataset.push(fieldValue as Datapoint);
    });

    return {
      metadata: {
        seriesTitles: seriesTitles,
      },
      type: 'aggregate',
      dataset: newDataset,
    } as AggregateDataset;
  }

  private computeRatio(
    datasetValue: CountDataset | undefined,
    datasetTotal: CountDataset | undefined,
  ): CountDataset | undefined {
    if (
      !datasetValue ||
      datasetValue.type !== 'count' ||
      !datasetTotal ||
      datasetTotal.type !== 'count' ||
      datasetTotal.value === 0
    )
      return undefined;
    else {
      return {
        value: datasetValue.value / datasetTotal.value,
        type: 'count',
      };
    }
  }
}

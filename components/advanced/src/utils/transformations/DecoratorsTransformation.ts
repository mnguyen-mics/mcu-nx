import {
  Datapoint,
  Dataset,
} from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import { IChannelService } from '../../services/ChannelService';
import { IAudienceSegmentService } from '../../services/AudienceSegmentService';
import { ICompartmentService } from '../../services/CompartmentService';
import { AbstractDataset, AggregateDataset } from '../../models/dashboards/dataset/dataset_tree';
import { DecoratorsOptions, ModelType } from '../../models/dashboards/dataset/common';

type ModelTypeKey = string;

export class DecoratorsTransformation {
  private channelService: IChannelService;
  private compartmentService: ICompartmentService;
  private audienceSegmentService: IAudienceSegmentService;

  private static namesMaps: Map<ModelTypeKey, Promise<Map<string, string>>> = new Map();

  constructor(
    channelService: IChannelService,
    compartmentService: ICompartmentService,
    audienceSegmentService?: IAudienceSegmentService,
  ) {
    this.channelService = channelService;
    this.compartmentService = compartmentService;

    if (audienceSegmentService) this.audienceSegmentService = audienceSegmentService;
  }

  fetchChannelsMap(datamartId: string, organisationId: string): Promise<Map<string, string>> {
    return this.channelService.getChannels(organisationId, datamartId).then(channels => {
      const map = new Map<string, string>();
      channels.data.forEach(channel => {
        map.set(channel.id, channel.name);
      });
      return map;
    });
  }

  fetchSegmentsMap(organisationId: string): Promise<Map<string, string>> {
    if (this.audienceSegmentService)
      return this.audienceSegmentService.getSegments(organisationId).then(segments => {
        const map = new Map<string, string>();
        segments.data.forEach(segment => {
          map.set(segment.id, segment.name);
        });
        return map;
      });
    else return Promise.resolve(new Map());
  }

  fetchCompartmentsMap(datamartId: string): Promise<Map<string, string>> {
    return this.compartmentService.getCompartments(datamartId).then(compartments => {
      const map = new Map<string, string>();
      compartments.data.forEach(compartment => {
        map.set(compartment.id, compartment.name);
      });
      return map;
    });
  }

  createKey(modelType: ModelType, keyId: string): ModelTypeKey {
    return `${modelType}${keyId}`;
  }

  decorateFromMap(key: ModelTypeKey, id: string): Promise<string> {
    const namesMap: Promise<Map<string, string>> | undefined =
      DecoratorsTransformation.namesMaps.get(key);

    if (namesMap)
      return namesMap.then(channelsMap => {
        const name = channelsMap.get(id);
        if (name) return name;
        else return id;
      });
    else return Promise.resolve(id);
  }

  decorateKeyChannel(id: string, datamartId: string, organisationId: string): Promise<string> {
    const key: ModelTypeKey = this.createKey('CHANNELS', datamartId);

    if (!DecoratorsTransformation.namesMaps.has(key))
      DecoratorsTransformation.namesMaps.set(
        key,
        this.fetchChannelsMap(datamartId, organisationId),
      );

    return this.decorateFromMap(key, id);
  }

  decorateKeySegment(id: string, organisationId: string): Promise<string> {
    const key: ModelTypeKey = this.createKey('SEGMENTS', organisationId);

    if (!DecoratorsTransformation.namesMaps.has(key))
      DecoratorsTransformation.namesMaps.set(key, this.fetchSegmentsMap(organisationId));

    return this.decorateFromMap(key, id);
  }

  decorateKeyCompartment(id: string, datamartId: string): Promise<string> {
    const key: ModelTypeKey = this.createKey('COMPARTMENTS', datamartId);

    if (!DecoratorsTransformation.namesMaps.has(key))
      DecoratorsTransformation.namesMaps.set(key, this.fetchCompartmentsMap(datamartId));

    return this.decorateFromMap(key, id);
  }

  decorateKey(
    id: string,
    datamartId: string,
    organisationId: string,
    modelType?: ModelType,
  ): Promise<string> {
    if (modelType) {
      switch (modelType) {
        case 'CHANNELS':
          return this.decorateKeyChannel(id, datamartId, organisationId);
        case 'SEGMENTS':
          return this.decorateKeySegment(id, organisationId);
        case 'COMPARTMENTS':
          return this.decorateKeyCompartment(id, datamartId);
        default:
          return Promise.resolve(`${id}`);
      }
    } else return Promise.resolve(id);
  }

  applyGetDecoratorsOnAggregateDataset(
    dataset: Dataset,
    xKey: string,
    decoratorsOptions: DecoratorsOptions,
    datamartId: string,
    organisationId: string,
  ): Promise<Dataset> {
    const decoratedValuesPromises = dataset.map(datapoint => {
      const decoratedBucketsPromise: Promise<Dataset | undefined> =
        !!datapoint.buckets && !!decoratorsOptions.buckets
          ? this.applyGetDecoratorsOnAggregateDataset(
              datapoint.buckets,
              xKey,
              decoratorsOptions.buckets,
              datamartId,
              organisationId,
            )
          : Promise.resolve(undefined);

      return decoratedBucketsPromise.then((decoratedBuckets: Dataset | undefined) => {
        return this.decorateKey(
          datapoint[xKey] as string,
          datamartId,
          organisationId,
          decoratorsOptions.model_type,
        ).then(decoratedValue => {
          const newDatapoint: Datapoint = {
            ...datapoint,
            [xKey]: decoratedValue,
          };
          if (!!decoratedBuckets) newDatapoint.buckets = decoratedBuckets;
          return newDatapoint;
        });
      });
    });
    return Promise.all(decoratedValuesPromises).then(decoratedValuesDataset => {
      return decoratedValuesDataset;
    });
  }

  applyGetDecorators(
    dataset: AbstractDataset,
    xKey: string,
    decoratorsOptions: DecoratorsOptions,
    datamartId: string,
    organisationId: string,
  ): Promise<AbstractDataset> {
    if (dataset.type === 'aggregate') {
      const aggregateDataset = dataset as AggregateDataset;
      return this.applyGetDecoratorsOnAggregateDataset(
        aggregateDataset.dataset,
        xKey,
        decoratorsOptions,
        datamartId,
        organisationId,
      ).then(formattedDataset => {
        return {
          metadata: aggregateDataset.metadata,
          type: aggregateDataset.type,
          dataset: formattedDataset,
        };
      });
    } else {
      return Promise.reject(
        `Dataset type ${dataset.type} is not compatible with format-dates transformation`,
      );
    }
  }
}

import * as React from 'react';
import { Alert } from 'antd';
import { lazyInject } from '../../inversify/inversify.config';
import { TYPES } from '../../constants/types';
import { Dataset } from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import {
  ChartConfig,
  ChartDatasetService,
  IChartDatasetService,
} from '../../services/ChartDatasetService';
import { AbstractScope } from '../../models/datamart/graphdb/Scope';
import { InjectedDrawerProps } from '../..';
import ChartMetadataInfo from './ChartMetadataInfo';
import { IQueryService, QueryService } from '../../services/QueryService';
import { QueryScopeAdapter } from '../../utils/QueryScopeAdapter';
import { extractQueriesHelper, QueryFragment } from '../../utils/source/DataSourceHelper';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { injectDrawer } from '../drawer';

import ManagedChart from './ManagedChart';
import {
  AbstractDataset,
  AggregateDataset,
  CountDataset,
} from '../../models/dashboards/dataset/dataset_tree';
import {
  QueryExecutionSource,
  QueryExecutionSubSource,
} from '../../models/platformMetrics/QueryExecutionSource';

type Layout = 'vertical' | 'horizontal';

export interface ChartProps {
  datamartId: string;
  organisationId: string;
  chartConfig: ChartConfig;
  showButtonUp?: boolean;
  showButtonDown?: boolean;
  hideOpenDrawer?: boolean;
  layout?: Layout;
  chartContainerStyle?: React.CSSProperties;
  scope?: AbstractScope;
  queryFragment?: QueryFragment;
  onClickEdit?: () => void;
  onClickMove?: (direction: 'up' | 'down') => void;
  onClickDelete?: () => void;
  queryExecutionSource: QueryExecutionSource;
  queryExecutionSubSource: QueryExecutionSubSource;
  setChartsFormattedData?: (title: string, data?: AbstractDataset) => void;
}

interface ChartState {
  formattedData?: AbstractDataset;
  loading: boolean;
  stillLoading: boolean;
  errorContext?: string;
}

type Props = InjectedDrawerProps & InjectedIntlProps & ChartProps;
let loadingTimeout: number;
class Chart extends React.Component<Props, ChartState> {
  @lazyInject(TYPES.IChartDatasetService)
  private _chartDatasetService: IChartDatasetService;

  private chartDatasetService(): IChartDatasetService {
    if (!this._chartDatasetService) this._chartDatasetService = new ChartDatasetService();

    return this._chartDatasetService;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      stillLoading: false,
      errorContext: undefined,
    };
  }

  componentDidMount() {
    const {
      datamartId,
      organisationId,
      chartConfig,
      scope,
      queryFragment,
      queryExecutionSource,
      queryExecutionSubSource,
    } = this.props;
    this.chartDatasetService()
      .fetchDataset(
        datamartId,
        organisationId,
        {
          ...chartConfig,
          useCache: chartConfig.useCache !== undefined ? chartConfig.useCache : true,
        },
        queryExecutionSource,
        queryExecutionSubSource,
        scope,
        queryFragment,
      )
      .then(formattedData => {
        clearTimeout(loadingTimeout);
        this.setState({
          formattedData: formattedData,
          loading: false,
          stillLoading: false,
        });
        this.props.setChartsFormattedData?.(chartConfig.title, formattedData);
      })
      .catch(e => {
        clearTimeout(loadingTimeout);
        this.setState({
          errorContext: JSON.stringify(e),
          loading: false,
          stillLoading: false,
        });
      });

    this.checkIfStillLoading();
  }

  checkIfStillLoading() {
    loadingTimeout = window.setTimeout(() => {
      if (this.state.loading !== this.state.stillLoading) {
        this.setState(state => {
          return {
            stillLoading: state.loading,
          };
        });
      }
    }, 6000);
  }

  private queryService: IQueryService = new QueryService();
  private scopeAdapter: QueryScopeAdapter = new QueryScopeAdapter(this.queryService);

  async extractOtqlQueriesFromDataset() {
    const { chartConfig, datamartId, scope, queryFragment } = this.props;

    return extractQueriesHelper(
      chartConfig.dataset,
      datamartId,
      this.queryService,
      this.scopeAdapter,
      scope,
      queryFragment,
    );
  }

  async closeDrawer() {
    this.props.closeNextDrawer();
  }

  async openDrawer(title: string, formattedData?: AbstractDataset) {
    let _dataset: Dataset = [];
    if (formattedData && formattedData.type === 'aggregate') {
      const aggregateDataset = formattedData as AggregateDataset;
      if (aggregateDataset.dataset && aggregateDataset.dataset.length)
        _dataset = aggregateDataset.dataset;
    } else if (formattedData && formattedData.type === 'count') {
      const countDataset = formattedData as CountDataset;
      _dataset = [
        {
          key: 'count',
          value: countDataset.value,
        },
      ];
    }
    const queries = await this.extractOtqlQueriesFromDataset();
    if (queries) {
      this.props.openNextDrawer(ChartMetadataInfo, {
        size: 'small',
        className: 'mcs-chartMetaDataInfo_drawer',
        additionalProps: {
          onCloseDrawer: this.closeDrawer.bind(this),
          title: title,
          datainfo: {
            dataset: _dataset,
          },
          queryInfos: queries.map(x => {
            return {
              queryText: x.queryText,
              queryType: x.queryType,
            };
          }),
        },
      });
    }
  }

  render() {
    const { formattedData, loading, stillLoading, errorContext } = this.state;
    const {
      chartConfig,
      chartContainerStyle,
      onClickEdit,
      onClickMove,
      onClickDelete,
      showButtonDown,
      showButtonUp,
      hideOpenDrawer,
      layout,
    } = this.props;
    if (!!errorContext) {
      return (
        <Alert
          message='Error'
          description={`Cannot fetch data for chart: ${errorContext}`}
          type='error'
          showIcon={true}
        />
      );
    }

    const openDrawer = hideOpenDrawer
      ? undefined
      : () => this.openDrawer(chartConfig.title, formattedData);
    return (
      <ManagedChart
        chartConfig={chartConfig}
        chartContainerStyle={chartContainerStyle}
        onClickEdit={onClickEdit}
        onClickMove={onClickMove}
        onClickDelete={onClickDelete}
        showButtonDown={showButtonDown}
        showButtonUp={showButtonUp}
        layout={layout}
        formattedData={formattedData}
        loading={loading}
        stillLoading={stillLoading}
        errorContext={errorContext}
        openDrawer={openDrawer}
      />
    );
  }
}

export default compose<Props, ChartProps>(injectIntl, injectDrawer)(Chart);

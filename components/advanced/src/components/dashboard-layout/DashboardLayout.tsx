import { Button, Divider, Spin } from 'antd';
import React from 'react';
import cuid from 'cuid';
import { AbstractScope, SegmentScope } from '../../models/datamart/graphdb/Scope';
import DashboardFilter from './dashboard-filter';
import { DimensionFilter } from '../../models/report/ReportRequestBody';
import {
  DashboardAvailableFilters,
  DashboardContentSchema,
  DashboardContentSection,
  DashboardFilterQueryFragments,
} from '../../models/customDashboards/customDashboards';
import { InjectedFeaturesProps, injectFeatures } from '../Features';
import { injectDrawer } from '../drawer';
import { InjectedDrawerProps, SegmentSelector } from '../..';
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl';
import { QueryFragment } from '../../utils/source/DataSourceHelper';
import {
  QueryExecutionSource,
  QueryExecutionSubSource,
} from '../../models/platformMetrics/QueryExecutionSource';
import { ExportService } from '../../services/ExportService';
import {
  getDashboardChartsTitles,
  injectFirstSectionTitle,
  limitTextLength,
  transformSchemaForComparaison,
} from './DashboardFunctions';
import { AudienceSegmentShape } from '../../models/audienceSegment/AudienceSegmentResource';
import { compose } from 'recompose';
import DashboardBody from './DashboardBody';
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons';
import {
  AggregateDataset,
  CountDataset,
  JsonDataset,
} from '../../models/dashboards/dataset/dataset_tree';
import moment from 'moment';
import { Card } from '@mediarithmics-private/mcs-components-library';

export interface DashboardLayoutProps {
  datamart_id: string;
  organisationId: string;
  schema: DashboardContentSchema;
  title?: string;
  scope?: AbstractScope;
  editable: boolean;
  updateState?: (d: DashboardContentSchema) => void;
  onShowDashboard?: () => void;
  queryExecutionSource: QueryExecutionSource;
  queryExecutionSubSource: QueryExecutionSubSource;
  layoutIndex?: number;
}

interface FilterValues {
  [key: string]: string[];
}

export interface DashboardLayoutState {
  dashboardFilterValues: FilterValues;
  formattedQueryFragment: QueryFragment;
  segmentForComparaison?: AudienceSegmentShape;
  comparaison: boolean;
  exportInProgress: boolean;
  exportStep?: 'step1_init' | 'step2_in_progress' | 'step3_wait_longer' | 'step4_finished';
  exportedFileName?: string;
}

type Props = DashboardLayoutProps &
  WrappedComponentProps &
  InjectedDrawerProps &
  InjectedFeaturesProps;

const messages = defineMessages({
  compareToSegment: {
    id: 'dashboard.layout.compareToSegment',
    defaultMessage: 'Compare to segment...',
  },
  compareToAllUsers: {
    id: 'dashboard.layout.compareToAllUsers',
    defaultMessage: 'Compare to all users',
  },
  apply: {
    id: 'dashboard.layout.apply',
    defaultMessage: 'Apply',
  },
  export: {
    id: 'dashboard.layout.export',
    defaultMessage: 'Export',
  },
  stopComparing: {
    id: 'dashboard.layout.stopComparing',
    defaultMessage: 'Stop comparing',
  },
  allUsers: {
    id: 'dashboard.layout.allUsers',
    defaultMessage: 'All users',
  },
  originalDashboard: {
    id: 'dashboard.layout.originalDashboard',
    defaultMessage: 'Original dashboard',
  },
  exportCheckingDataLoaded: {
    id: 'dashboard.layout.exportCheckingDataLoaded',
    defaultMessage: 'Checking if data is loaded',
  },
  exportExecutingQueries: {
    id: 'dashboard.layout.exportExecutingQueries',
    defaultMessage: 'Executing queries for missing data',
  },
  exportQueriesTakeTime: {
    id: 'dashboard.layout.exportQueriesTakeTime',
    defaultMessage: 'Queries take some time',
  },
  exportQueriesTakeTimeDescription: {
    id: 'dashboard.layout.exportQueriesTakeTimeDescription',
    defaultMessage:
      'We queued all the queries. You can navigate to other pages and come back in 10 minutes to export again. Your download will start once ready if you wait.',
  },
  exportTryLater: {
    id: 'dashboard.layout.exportTryLater',
    defaultMessage: "I'll retry an export later",
  },
  exportDownloaded: {
    id: 'dashboard.layout.exportDownloaded',
    defaultMessage: 'Dashboard downloaded as',
  },
  exportBackToDashboard: {
    id: 'dashboard.layout.exportBackToDashboard',
    defaultMessage: 'Back to the dashboard',
  },
});

export type ChartsFormattedData = Map<
  string,
  AggregateDataset | CountDataset | JsonDataset | undefined
>;

class DashboardLayout extends React.Component<Props, DashboardLayoutState> {
  private chartsFormattedData: ChartsFormattedData = new Map();

  constructor(props: Props) {
    super(props);
    this.state = {
      dashboardFilterValues: {},
      formattedQueryFragment: {},
      comparaison: false,
      exportInProgress: false,
    };
  }

  shouldComponentUpdate(nextProps: Props, nextState: DashboardLayoutState) {
    const { dashboardFilterValues } = this.state;
    return dashboardFilterValues === nextState.dashboardFilterValues;
  }

  componentDidMount() {
    const { onShowDashboard } = this.props;

    if (onShowDashboard) {
      onShowDashboard();
    }
  }

  handleCreateSection = (index: number) => {
    const { schema, updateState } = this.props;

    if (updateState) {
      const contentCopy: DashboardContentSchema = JSON.parse(JSON.stringify(schema));

      const newSection: DashboardContentSection = {
        id: cuid(),
        title: '',
        cards: [],
      };

      contentCopy.sections.splice(index + 1, 0, newSection);
      updateState(contentCopy);
    }
  };

  handleDashboardFilterChange = (filterTechnicalName: string, filterValues: string[]) => {
    const { dashboardFilterValues } = this.state;

    // deep copy array
    let newDashboardFilterValues = JSON.parse(JSON.stringify(dashboardFilterValues));

    if (newDashboardFilterValues[filterTechnicalName]) {
      newDashboardFilterValues[filterTechnicalName] = filterValues.length > 0 ? filterValues : {};
    } else {
      newDashboardFilterValues = {
        ...newDashboardFilterValues,
        [filterTechnicalName]: filterValues,
      };
    }

    this.setState({
      dashboardFilterValues: newDashboardFilterValues,
    });
  };

  applyFilterOnFormattedQueryFragment = (
    filterValues: FilterValues,
    formattedQueryFragment: QueryFragment,
    availableFilters?: DashboardAvailableFilters[],
  ): QueryFragment => {
    // deep copy array
    let newFormattedQueryFragment = JSON.parse(JSON.stringify(formattedQueryFragment));

    for (const filterName in filterValues) {
      if (filterValues.hasOwnProperty(filterName)) {
        const availableFilter =
          availableFilters &&
          availableFilters.find(
            f => f.technical_name.toLowerCase() === filterName.toLocaleLowerCase(),
          );
        const currentFormattedQueryFragment = availableFilter?.query_fragments.map(
          (q: DashboardFilterQueryFragments) => {
            let formattedFrament;
            switch (q.type.toLowerCase()) {
              case 'otql':
                formattedFrament = (q.fragment as string).replace(
                  '$values',
                  JSON.stringify(filterValues[filterName]),
                );
                break;
              case 'activities_analytics':
                formattedFrament = (q.fragment as DimensionFilter[]).map((f: DimensionFilter) => {
                  return { ...f, expressions: filterValues[filterName] };
                });
                break;
            }

            return {
              ...q,
              fragment: formattedFrament,
            };
          },
        );

        if (newFormattedQueryFragment[filterName]) {
          newFormattedQueryFragment[filterName] =
            filterValues[filterName].length > 0 ? currentFormattedQueryFragment : {};
        } else {
          newFormattedQueryFragment = {
            ...newFormattedQueryFragment,
            [filterName]: currentFormattedQueryFragment,
          };
        }
      }
    }

    return newFormattedQueryFragment;
  };

  applyFilter = () => {
    const { dashboardFilterValues, formattedQueryFragment } = this.state;
    const { schema } = this.props;

    const formattedQueryFragmentWithFilters = this.applyFilterOnFormattedQueryFragment(
      dashboardFilterValues,
      formattedQueryFragment,
      schema.available_filters,
    );

    this.chartsFormattedData = new Map();

    this.setState({
      formattedQueryFragment: formattedQueryFragmentWithFilters,
    });
  };

  handleStopComparingButtonClick = () => {
    this.setState({
      comparaison: false,
      segmentForComparaison: undefined,
    });
  };

  handleCompareToAllUsersButtonClick = () => {
    this.setState({
      comparaison: true,
      segmentForComparaison: undefined,
    });
  };

  handleSelectSegmentForComparaison = (segment: AudienceSegmentShape) => {
    this.setState({
      comparaison: true,
      segmentForComparaison: segment,
    });
  };

  createScope = (segmentId: string): SegmentScope => {
    return { type: 'SEGMENT', segmentId: segmentId };
  };

  private generateExportFileName = () => {
    const { title } = this.props;
    const dashboardTitle = title ? title.replace(' ', '-') : '';
    const currentTime = moment(new Date()).format('yyyy-MM-DD-HH-mm-ss');

    return `export_dashboard_${dashboardTitle}_${currentTime}`;
  };

  private handleExportChartsFormattedDataReceived = (
    chartTitle: string,
    data?: AggregateDataset | CountDataset | JsonDataset,
  ) => {
    const { exportInProgress, exportStep } = this.state;

    this.chartsFormattedData = this.chartsFormattedData.set(chartTitle, data);

    if (exportInProgress && exportStep !== 'step4_finished' && this.allChartsLoaded())
      this.downloadExport();
  };

  private allChartsLoaded = (): boolean => {
    const { schema } = this.props;
    const loadingCharts = getDashboardChartsTitles(schema);

    let allChartsLoaded = this.chartsFormattedData.size > 0;
    loadingCharts.forEach(chartTitle => {
      if (!this.chartsFormattedData.has(chartTitle)) allChartsLoaded = false;
    });

    return allChartsLoaded;
  };

  private downloadExport = () => {
    const fileName = this.generateExportFileName();
    new ExportService().exportMultipleDataset(this.chartsFormattedData, fileName);
    this.setState({
      exportStep: 'step4_finished',
      exportedFileName: `${fileName}.xlsx`,
    });
  };

  private handleExportButtonClick = () => () => {
    const initialStepDuration = 2;
    const secondStepDuration = initialStepDuration + 7;

    if (this.allChartsLoaded()) this.downloadExport();
    else {
      this.setState({
        exportInProgress: true,
        exportStep: 'step1_init',
      });
      setTimeout(() => {
        const { exportInProgress, exportStep } = this.state;
        if (exportInProgress && exportStep !== 'step4_finished')
          this.setState({
            exportStep: 'step2_in_progress',
          });
      }, initialStepDuration * 1000);

      setTimeout(() => {
        const { exportInProgress, exportStep } = this.state;
        if (exportInProgress && exportStep !== 'step4_finished')
          this.setState({
            exportStep: 'step3_wait_longer',
          });
      }, secondStepDuration * 1000);
    }
  };

  handleReturnFromExportBtn = () => {
    this.setState({
      exportInProgress: false,
      exportStep: undefined,
      exportedFileName: undefined,
    });
  };

  renderExportProgressCard = () => {
    const { intl } = this.props;
    const { exportStep, exportedFileName } = this.state;

    let cardContent;
    switch (exportStep) {
      case 'step1_init':
        cardContent = (
          <>
            <Spin className='mcs-dashboardLayout_statusIcon' size='large' />
            {intl.formatMessage(messages.exportCheckingDataLoaded)}
          </>
        );
        break;
      case 'step2_in_progress':
        cardContent = (
          <>
            <Spin className='mcs-dashboardLayout_statusIcon' size={'large'} />
            {intl.formatMessage(messages.exportExecutingQueries)}
          </>
        );
        break;
      case 'step3_wait_longer':
        cardContent = (
          <>
            <ClockCircleOutlined className='mcs-dashboardLayout_iconWait' />
            <span className='mcs-dashboardLayout_card_boldText'>
              {intl.formatMessage(messages.exportQueriesTakeTime)}
            </span>
            <span className='mcs-dashboardLayout_card_msgText'>
              {intl.formatMessage(messages.exportQueriesTakeTimeDescription)}
            </span>
            <Button
              type='default'
              onClick={this.handleReturnFromExportBtn}
              className='mcs-primary mcs-dashboardLayout_returnFromExportBtn'
            >
              <ArrowLeftOutlined />
              {intl.formatMessage(messages.exportTryLater)}
            </Button>
          </>
        );
        break;
      case 'step4_finished':
        cardContent = (
          <>
            <CloudDownloadOutlined className='mcs-dashboardLayout_iconDownload' />
            {intl.formatMessage(messages.exportDownloaded)} {exportedFileName}
            <Button
              type='primary'
              onClick={this.handleReturnFromExportBtn}
              className='mcs-primary mcs-dashboardLayout_returnFromExportBtn'
            >
              <ArrowLeftOutlined />
              {intl.formatMessage(messages.exportBackToDashboard)}
            </Button>
          </>
        );
        break;
    }

    return (
      <Card
        className='mcs-cardFlex mcs-dashboardLayout_card mcs-dashboardLayout_cardCentered'
        style={{}}
      >
        <div className='mcs-statusCardContent'>{cardContent}</div>
      </Card>
    );
  };

  render() {
    const {
      schema,
      datamart_id,
      organisationId,
      queryExecutionSource,
      queryExecutionSubSource,
      intl,
      editable,
      updateState,
      scope,
      hasFeature,
      layoutIndex,
    } = this.props;

    const { formattedQueryFragment, comparaison, segmentForComparaison, exportInProgress } =
      this.state;

    const comparaisonEnabled = hasFeature('dashboards-comparisons') && comparaison;

    const schemaToDisplay = comparaisonEnabled ? transformSchemaForComparaison(schema) : schema;

    let schemaToCompare: DashboardContentSchema | undefined;
    if (comparaisonEnabled) {
      if (segmentForComparaison)
        schemaToCompare = injectFirstSectionTitle(
          schemaToDisplay,
          limitTextLength(segmentForComparaison.name, 90),
        );
      else
        schemaToCompare = injectFirstSectionTitle(
          schemaToDisplay,
          limitTextLength(intl.formatMessage(messages.allUsers), 90),
        );
    } else schemaToCompare = undefined;

    if (
      comparaisonEnabled &&
      schemaToDisplay.sections.length > 0 &&
      schemaToDisplay.sections[0].title.trim().length === 0
    )
      schemaToDisplay.sections[0].title = intl.formatMessage(messages.originalDashboard);

    let compareScope: SegmentScope | undefined;
    if (comparaisonEnabled && segmentForComparaison && segmentForComparaison.id)
      compareScope = this.createScope(segmentForComparaison.id);
    else compareScope = undefined;

    const keyGen = (index: number) => `${!!layoutIndex ? layoutIndex * 10 + index : index}`;

    const sections = (
      <DashboardBody
        key={keyGen(1)}
        schema={schemaToDisplay}
        editable={editable}
        datamartId={datamart_id}
        organisationId={organisationId}
        queryExecutionSource={queryExecutionSource}
        queryExecutionSubSource={queryExecutionSubSource}
        formattedQueryFragment={formattedQueryFragment}
        updateState={updateState}
        scope={scope}
        setChartsFormattedData={this.handleExportChartsFormattedDataReceived}
        lazyLoading={!exportInProgress}
      />
    );

    const sectionsCompare =
      schemaToCompare && comparaisonEnabled ? (
        <DashboardBody
          key={keyGen(2)}
          schema={schemaToCompare}
          editable={editable}
          datamartId={datamart_id}
          organisationId={organisationId}
          queryExecutionSource={queryExecutionSource}
          queryExecutionSubSource={queryExecutionSubSource}
          formattedQueryFragment={formattedQueryFragment}
          updateState={updateState}
          scope={compareScope}
          setChartsFormattedData={this.handleExportChartsFormattedDataReceived}
          lazyLoading={!exportInProgress}
        />
      ) : undefined;

    return (
      <div className={'mcs-dashboardLayout'}>
        <div className={'mcs-dashboardLayout_filters'}>
          {!editable &&
            hasFeature('dashboards-comparisons') &&
            !comparaison &&
            ['SEGMENT_DASHBOARD', 'HOME_DASHBOARD'].includes(queryExecutionSubSource) && (
              <SegmentSelector
                organisationId={organisationId}
                datamartId={datamart_id}
                onSelectSegment={this.handleSelectSegmentForComparaison}
                segmentType={[
                  'USER_QUERY',
                  'USER_LIST',
                  'USER_ACTIVATION',
                  'USER_LOOKALIKE_BY_COHORTS',
                  'USER_LOOKALIKE',
                  'USER_PARTITION',
                ]}
                text={intl.formatMessage(messages.compareToSegment)}
              />
            )}

          {!editable &&
            hasFeature('dashboards-comparisons') &&
            !comparaison &&
            queryExecutionSubSource === 'SEGMENT_DASHBOARD' && (
              <Button
                type='default'
                onClick={this.handleCompareToAllUsersButtonClick}
                className='mcs-primary mcs-dashboardLayout_compareToAllBtn'
              >
                {intl.formatMessage(messages.compareToAllUsers)}
              </Button>
            )}

          {!editable && comparaisonEnabled && (
            <Button
              type='default'
              onClick={this.handleStopComparingButtonClick}
              icon={<CloseOutlined />}
              className='mcs-primary mcs-dashboardLayout_stopCompareBtn'
            >
              {intl.formatMessage(messages.stopComparing)}
            </Button>
          )}

          {!comparaisonEnabled && (
            <Button
              type='default'
              onClick={this.handleExportButtonClick()}
              className='mcs-primary mcs-dashboardLayout_filters_applyBtn'
            >
              {intl.formatMessage(messages.export)}
            </Button>
          )}

          {schema.available_filters && (
            <>
              <Divider type='vertical' className='mcs-dashboardLayout_filters_divider' />
              {schema.available_filters.map((filter, index) => (
                <DashboardFilter
                  key={index.toString()}
                  filter={filter}
                  datamartId={datamart_id}
                  organisationId={organisationId}
                  onFilterChange={this.handleDashboardFilterChange}
                  queryExecutionSource={queryExecutionSource}
                  queryExecutionSubSource={queryExecutionSubSource}
                />
              ))}
              <Button
                onClick={this.applyFilter}
                type='primary'
                className='mcs-primary mcs-dashboardLayout_filters_applyBtn'
              >
                {intl.formatMessage(messages.apply)}
              </Button>
            </>
          )}
        </div>
        {!sectionsCompare && (
          <>
            {exportInProgress && this.renderExportProgressCard()}
            <div className={exportInProgress ? 'mcs-hiddenLoading' : undefined}>{sections}</div>
          </>
        )}
        {sectionsCompare && (
          <div className='mcs-dashboardLayout_compareContainer'>
            <div className='mcs-dashboardLayout_columnLeft'>{sections}</div>
            <div className='mcs-dashboardLayout_columnRight'>{sectionsCompare}</div>
          </div>
        )}
      </div>
    );
  }
}

export default compose<Props, DashboardLayoutProps>(
  injectFeatures,
  injectIntl,
  injectDrawer,
)(DashboardLayout);

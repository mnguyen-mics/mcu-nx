import { Button, Divider, Tooltip } from 'antd';
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
import {
  AggregateDataset,
  CountDataset,
  JsonDataset,
} from '../../models/dashboards/dataset/dataset_tree';
import { ExportService } from '../../services/ExportService';
import {
  injectFirstSectionTitle,
  limitTextLength,
  transformSchemaForComparaison,
} from './DashboardFunctions';
import { AudienceSegmentShape } from '../../models/audienceSegment/AudienceSegmentResource';
import { compose } from 'recompose';
import DashboardBody from './DashboardBody';
import { CloseOutlined } from '@ant-design/icons';

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

type ChartsFormattedData = Map<string, AggregateDataset | CountDataset | JsonDataset | undefined>;

export interface DashboardLayoutState {
  dashboardFilterValues: FilterValues;
  formattedQueryFragment: QueryFragment;
  segmentForComparaison?: AudienceSegmentShape;
  comparaison: boolean;
}

type Props = DashboardLayoutProps &
  WrappedComponentProps &
  InjectedDrawerProps &
  InjectedFeaturesProps;

const messages = defineMessages({
  exportWarning: {
    id: 'dashboard.layout.exportWarning',
    defaultMessage: 'Only charts you loaded will be exported',
  },
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
});

class DashboardLayout extends React.Component<Props, DashboardLayoutState> {
  private chartsFormattedData: ChartsFormattedData = new Map();

  constructor(props: Props) {
    super(props);
    this.state = {
      dashboardFilterValues: {},
      formattedQueryFragment: {},
      comparaison: false,
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

    this.setState({
      formattedQueryFragment: formattedQueryFragmentWithFilters,
    });
  };

  handleExportButtonClick =
    (title = 'Dashboard') =>
    () => {
      new ExportService().exportMultipleDataset(this.chartsFormattedData, title);
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

  render() {
    const {
      schema,
      datamart_id,
      organisationId,
      queryExecutionSource,
      queryExecutionSubSource,
      title,
      intl,
      editable,
      updateState,
      scope,
      hasFeature,
      layoutIndex,
    } = this.props;

    const { formattedQueryFragment, comparaison, segmentForComparaison } = this.state;

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
            <Tooltip title={intl.formatMessage(messages.exportWarning)}>
              <Button
                type='default'
                onClick={this.handleExportButtonClick(title)}
                className='mcs-primary mcs-dashboardLayout_filters_applyBtn'
              >
                {intl.formatMessage(messages.export)}
              </Button>
            </Tooltip>
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
        {!sectionsCompare ? sections : undefined}
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

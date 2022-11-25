import { Button, Divider, Tooltip } from 'antd';
import React from 'react';
import cuid from 'cuid';
import { AbstractScope } from '../../models/datamart/graphdb/Scope';
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
  ComparisonValues,
  defaultSegmentFilter,
  injectFirstSectionTitle,
  limitTextLength,
  mergeQueryFragmentsWithoutSegments,
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
}

interface FilterValues {
  [key: string]: string[];
}

type ChartsFormattedData = Map<string, AggregateDataset | CountDataset | JsonDataset | undefined>;

export interface DashboardLayoutState {
  dashboardFilterValues: FilterValues;
  formattedQueryFragment: QueryFragment;
  comparisonValues?: ComparisonValues;
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
});

class DashboardLayout extends React.Component<Props, DashboardLayoutState> {
  private chartsFormattedData: ChartsFormattedData = new Map();

  constructor(props: Props) {
    super(props);
    this.state = {
      dashboardFilterValues: {},
      formattedQueryFragment: {},
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
    const { dashboardFilterValues, formattedQueryFragment, comparisonValues } = this.state;
    const { schema } = this.props;

    const formattedQueryFragmentWithFilters = this.applyFilterOnFormattedQueryFragment(
      dashboardFilterValues,
      formattedQueryFragment,
      schema.available_filters,
    );

    this.setState({
      formattedQueryFragment: formattedQueryFragmentWithFilters,
      comparisonValues: comparisonValues
        ? {
            ...comparisonValues,
            fragment: mergeQueryFragmentsWithoutSegments(
              comparisonValues.fragment,
              formattedQueryFragmentWithFilters,
            ),
          }
        : undefined,
    });
  };

  handleExportButtonClick =
    (title = 'Dashboard') =>
    () => {
      new ExportService().exportMultipleDataset(this.chartsFormattedData, title);
    };

  handleStopComparingButtonClick = () => {
    this.setState({
      comparisonValues: undefined,
    });
  };

  handleSelectSegmentForComparaison = (segment: AudienceSegmentShape) => {
    const dashboardFilterValues = {
      segments: [segment.id],
    };

    const { formattedQueryFragment } = this.state;
    const { schema } = this.props;

    let filters: DashboardAvailableFilters[];
    if (schema.available_filters) {
      filters = schema.available_filters;
      if (
        schema.available_filters.filter(
          filter => filter.technical_name.toLowerCase() === 'segments',
        ).length === 0
      )
        filters = filters.concat([defaultSegmentFilter]);
    } else filters = [defaultSegmentFilter];

    this.setState({
      comparisonValues: {
        segmentTitle: limitTextLength(segment.name, 90),
        fragment: this.applyFilterOnFormattedQueryFragment(
          dashboardFilterValues,
          formattedQueryFragment,
          filters,
        ),
      },
    });
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
    } = this.props;

    const { formattedQueryFragment, comparisonValues } = this.state;

    console.log(
      `igor, scope = ${JSON.stringify(scope)}, formattedQueryFragment = ${JSON.stringify(
        formattedQueryFragment,
      )}`,
    );

    console.log(`igor, compare segment fragment = ${JSON.stringify(comparisonValues?.fragment)}`);

    const schemaToDisplay = comparisonValues ? transformSchemaForComparaison(schema) : schema;

    const schemaToCompare = comparisonValues
      ? injectFirstSectionTitle(schemaToDisplay, comparisonValues.segmentTitle)
      : undefined;

    if (
      comparisonValues &&
      schemaToDisplay.sections.length > 0 &&
      schemaToDisplay.sections[0].title.trim().length === 0
    )
      schemaToDisplay.sections[0].title = 'Original dashboard';

    const sections = (
      <DashboardBody
        key={'1'}
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
      schemaToCompare && comparisonValues ? (
        <DashboardBody
          key={'2'}
          schema={schemaToCompare}
          editable={editable}
          datamartId={datamart_id}
          organisationId={organisationId}
          queryExecutionSource={queryExecutionSource}
          queryExecutionSubSource={queryExecutionSubSource}
          formattedQueryFragment={comparisonValues.fragment}
          updateState={updateState}
          scope={scope}
        />
      ) : undefined;

    return (
      <div className={'mcs-dashboardLayout'}>
        <div className={'mcs-dashboardLayout_filters'}>
          {!editable && !comparisonValues && (
            <SegmentSelector
              organisationId={organisationId}
              datamartId={datamart_id}
              onSelectSegment={this.handleSelectSegmentForComparaison}
              segmentType={[
                'USER_LIST',
                'USER_QUERY',
                'USER_LOOKALIKE_BY_COHORTS',
                'USER_LOOKALIKE',
                'USER_ACTIVATION',
                'USER_PARTITION',
              ]}
              text={intl.formatMessage(messages.compareToSegment)}
            />
          )}

          {!editable && comparisonValues && (
            <Button
              type='default'
              onClick={this.handleStopComparingButtonClick}
              icon={<CloseOutlined />}
              className='mcs-primary mcs-dashboardLayout_stopCompareBtn'
            >
              {intl.formatMessage(messages.stopComparing)}
            </Button>
          )}

          {!comparisonValues && (
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

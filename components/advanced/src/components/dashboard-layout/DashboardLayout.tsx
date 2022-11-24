import { Button, Divider, Tooltip } from 'antd';
import React from 'react';
import cuid from 'cuid';
import { AbstractScope } from '../../models/datamart/graphdb/Scope';
import DashboardFilter from './dashboard-filter';
import { DimensionFilter } from '../../models/report/ReportRequestBody';
import {
  DashboardContentSchema,
  DashboardContentSection,
  DashboardFilterQueryFragments,
} from '../../models/customDashboards/customDashboards';
import { InjectedFeaturesProps, injectFeatures } from '../Features';
import { injectDrawer } from '../drawer';
import { InjectedDrawerProps, SegmentSelector } from '../..';
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl';
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

interface ComparisonValues {
  fragment: QueryFragment;
  segmentTitle: string;
}

type ChartsFormattedData = Map<string, AggregateDataset | CountDataset | JsonDataset | undefined>;
export interface DashboardLayoutState {
  dashboardFilterValues: FilterValues;
  formattedQueryFragment: QueryFragment;
  comparisonValues?: ComparisonValues;
}

type Props = DashboardLayoutProps & WrappedComponentProps & InjectedIntlProps & InjectedDrawerProps & InjectedFeaturesProps;

const messages = defineMessages({
  exportWarning: {
    id: 'dashboard.layout.exportWarning',
    defaultMessage: 'Only charts you loaded will be exported',
  },
  compareToSegment: {
    id: 'dashboard.layout.compareToSegment',
    defaultMessage: 'Compare to segment...',
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
    schema: DashboardContentSchema,
  ): QueryFragment => {
    // deep copy array
    let newFormattedQueryFragment = JSON.parse(JSON.stringify(formattedQueryFragment));

    for (const filterName in filterValues) {
      if (filterValues.hasOwnProperty(filterName)) {
        const availableFilter =
          schema.available_filters &&
          schema.available_filters.find(
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

    this.setState({
      formattedQueryFragment: this.applyFilterOnFormattedQueryFragment(
        dashboardFilterValues,
        formattedQueryFragment,
        schema,
      ),
    });
  };

  handleExportButtonClick =
    (title = 'Dashboard') =>
    () => {
      new ExportService().exportMultipleDataset(this.chartsFormattedData, title);
    };

  handleSelectSegmentForComparaison = (segment: AudienceSegmentShape) => {
    console.log(`igor, handleSelectSegment, segment = ${JSON.stringify(segment)}`);
    const dashboardFilterValues = {
      segments: [segment.id],
    };

    const { formattedQueryFragment } = this.state;
    const { schema } = this.props;

    this.setState({
      comparisonValues: {
        segmentTitle: limitTextLength(segment.name, 90),
        fragment: this.applyFilterOnFormattedQueryFragment(
          dashboardFilterValues,
          formattedQueryFragment,
          schema,
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
    } = this.props;

    const { formattedQueryFragment, comparisonValues } = this.state;

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
        schema={schemaToDisplay}
        editable={editable}
        datamartId={datamart_id}
        organisationId={organisationId}
        queryExecutionSource={queryExecutionSource}
        queryExecutionSubSource={queryExecutionSubSource}
        formattedQueryFragment={formattedQueryFragment}
      />
    );

    const sectionsCompare =
      schemaToCompare && comparisonValues ? (
        <DashboardBody
          schema={schemaToCompare}
          editable={editable}
          datamartId={datamart_id}
          organisationId={organisationId}
          queryExecutionSource={queryExecutionSource}
          queryExecutionSubSource={queryExecutionSubSource}
          formattedQueryFragment={comparisonValues.fragment}
        />
      ) : undefined;

    return (
      <div className={'mcs-dashboardLayout'}>
        <div className={'mcs-dashboardLayout_filters'}>
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

          <Tooltip title={intl.formatMessage(messages.exportWarning)}>
            <Button
              type='default'
              onClick={this.handleExportButtonClick(title)}
              className='mcs-primary mcs-dashboardLayout_filters_applyBtn'
            >
              Export
            </Button>
          </Tooltip>

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
                Apply
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

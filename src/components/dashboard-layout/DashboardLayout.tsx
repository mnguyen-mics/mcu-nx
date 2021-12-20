import { Card } from '@mediarithmics-private/mcs-components-library';
import React, { CSSProperties } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Chart from '../chart-engine';
import cuid from 'cuid';
import { ChartConfig, ChartType, SourceType } from '../../services/ChartDatasetService';
import McsLazyLoad from '../lazyload';
import { AbstractScope } from '../../models/datamart/graphdb/Scope';
import DashboardFilter from './dashboard-filter';
import { QueryFragment } from '../chart-engine/Chart';
import { DimensionFilter } from '../../models/report/ReportRequestBody';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const BASE_FRAMEWORK_HEIGHT = 96;

export interface DashboardLayoutProps {
  datamart_id: string;
  schema: DashboardContentSchema;
  scope?: AbstractScope;
}

interface DashboardContentCard {
  x: number;
  y: number;
  w: number;
  h: number;
  layout?: string;
  charts: ChartConfig[];
}

interface DashboardContentSection {
  title: string;
  cards: DashboardContentCard[];
}

type DashboardAvailableFilterType = 'compartments';
type DashboardValuesRetrieveMethodType = 'query';

export interface DashboardFilterQueryFragments {
  type: SourceType;
  starting_object_type: string;
  fragment: string | DimensionFilter[];
}

export interface DashboardAvailableFilters {
  technical_name: DashboardAvailableFilterType;
  title: string;
  values_retrieve_method: DashboardValuesRetrieveMethodType;
  values_query: string;
  multi_select: boolean;
  query_fragments: DashboardFilterQueryFragments[];
}

export interface DashboardContentSchema {
  sections: DashboardContentSection[];
  available_filters?: DashboardAvailableFilters[];
}

interface FilterValues {
  [key: string]: string[];
}
export interface DashboardLayoutState {
  dashboardFilterValues: FilterValues;
  formattedQueryFragment: QueryFragment;
}

export default class DashboardLayout extends React.Component<
  DashboardLayoutProps,
  DashboardLayoutState
> {
  constructor(props: DashboardLayoutProps) {
    super(props);
    this.state = {
      dashboardFilterValues: {},
      formattedQueryFragment: {},
    };
  }

  renderChart(chart: ChartConfig, cssProperties?: CSSProperties) {
    const { datamart_id, scope } = this.props;
    const { formattedQueryFragment } = this.state;

    return (
      <Chart
        key={cuid()}
        datamartId={datamart_id}
        chartConfig={chart}
        chartContainerStyle={cssProperties}
        scope={scope}
        queryFragment={formattedQueryFragment}
      />
    );
  }

  computeCSSProperties = (
    charts: ChartConfig[],
    layout: string = 'horizontal',
    chartType: ChartType,
    cardHeight: number,
  ) => {
    const horizontalCssProperties = {
      float: 'left' as any,
      height: '100%',
    };

    const isMetricChartType = chartType.toLowerCase() === 'metric';
    const metricChartsList = charts.filter(chart => chart.type.toLowerCase() === 'metric');
    const gridColumnHeight = 96;
    const cardHeightInPixel = cardHeight * gridColumnHeight;
    const metricHeigthInPx = 63;

    const otherThanMetricChartHeigth =
      (cardHeightInPixel -
        metricChartsList.length * metricHeigthInPx -
        (charts.length - metricChartsList.length) * 28) /
      (charts.length - metricChartsList.length);

    const metricChartWidthSize = 20;
    const otherThanMetricChartWidth =
      (100 - metricChartsList.length * metricChartWidthSize) /
      (charts.length - metricChartsList.length);

    if (layout === 'horizontal') {
      if (isMetricChartType && charts.length > 1) {
        return {
          ...horizontalCssProperties,
          width: `${metricChartWidthSize}%`,
        };
      }
      return {
        ...horizontalCssProperties,
        width:
          !isMetricChartType && metricChartsList
            ? `${otherThanMetricChartWidth}%`
            : `${100 / charts.length}%`,
      };
    } else {
      if (isMetricChartType && charts.length > 1) {
        return { height: `${metricHeigthInPx}px` };
      }
      return {
        height: `${otherThanMetricChartHeigth}px`,
      };
    }
  };

  handleDashboardFilterChange = (filterTechnicalName: string, filterValues: string[]) => {
    const { dashboardFilterValues, formattedQueryFragment } = this.state;
    const { schema } = this.props;

    // deep copy array
    let newDashboardFilterValues = JSON.parse(JSON.stringify(dashboardFilterValues));
    let newFormattedQueryFragment = JSON.parse(JSON.stringify(formattedQueryFragment));

    const availableFilter =
      schema.available_filters &&
      schema.available_filters.find(
        f => f.technical_name.toLowerCase() === filterTechnicalName.toLocaleLowerCase(),
      );
    const currentFormattedQueryFragment = availableFilter?.query_fragments.map(
      (q: DashboardFilterQueryFragments) => {
        let formattedFrament;
        switch (q.type.toLowerCase()) {
          case 'otql':
            formattedFrament = (q.fragment as string).replace(
              '$values',
              JSON.stringify(filterValues),
            );
            break;
          case 'activities_analytics':
            formattedFrament = (q.fragment as DimensionFilter[]).map((f: DimensionFilter) => {
              return { ...f, expressions: filterValues };
            });
            break;
        }

        return {
          ...q,
          fragment: formattedFrament,
        };
      },
    );

    if (newDashboardFilterValues[filterTechnicalName]) {
      newDashboardFilterValues[filterTechnicalName] = filterValues.length > 0 ? filterValues : {};
    } else {
      newDashboardFilterValues = {
        ...newDashboardFilterValues,
        [filterTechnicalName]: filterValues,
      };
    }

    if (newFormattedQueryFragment[filterTechnicalName]) {
      newFormattedQueryFragment[filterTechnicalName] =
        filterValues.length > 0 ? currentFormattedQueryFragment : {};
    } else {
      newFormattedQueryFragment = {
        ...newFormattedQueryFragment,
        [filterTechnicalName]: currentFormattedQueryFragment,
      };
    }

    this.setState({
      dashboardFilterValues: newDashboardFilterValues,
      formattedQueryFragment: newFormattedQueryFragment,
    });
  };

  generateDOM(): React.ReactElement {
    const { schema, datamart_id } = this.props;
    const sections = schema.sections.map((section, i) => {
      const cards = section.cards.map((card, index) => {
        return this.renderCard(card, index);
      });
      const layouts = section.cards.map((card, index) => {
        return {
          i: index.toString(),
          x: card.x,
          y: card.y,
          w: card.w,
          h: card.h,
        };
      });
      return (
        <div key={cuid()} className={'mcs-section'}>
          <div className={'mcs-subtitle2'}>{section.title}</div>
          <ResponsiveReactGridLayout
            cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
            layouts={{ lg: layouts }}
            isDraggable={false}
            isResizable={false}
            measureBeforeMount={false}
            compactType={'vertical'}
            preventCollision={true}
            // Disable dragging & resizabling
            rowHeight={BASE_FRAMEWORK_HEIGHT}
          >
            {cards}
          </ResponsiveReactGridLayout>
        </div>
      );
    });
    return (
      <div className={'mcs-dashboardLayout'}>
        <div className={'mcs-dashboardLayout_filters'}>
          {schema.available_filters &&
            schema.available_filters.map((filter, index) => (
              <DashboardFilter
                key={index.toString()}
                filter={filter}
                datamart_id={datamart_id}
                onFilterChange={this.handleDashboardFilterChange}
              />
            ))}
        </div>
        {sections}
      </div>
    );
  }

  renderCard(card: DashboardContentCard, i: number) {
    const charts = card.charts.map((chart, index) => {
      return this.renderChart(
        chart,
        this.computeCSSProperties(card.charts, card.layout, chart.type, card.h),
      );
    });
    const cardComponent = <Card className='mcs-cardFlex'>{charts}</Card>;
    return (
      <div key={i.toString()}>
        <McsLazyLoad key={cuid()} child={cardComponent} />
      </div>
    );
  }

  render() {
    return this.generateDOM();
  }
}

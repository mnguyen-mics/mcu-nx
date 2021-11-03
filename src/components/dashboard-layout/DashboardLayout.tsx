import { Card } from '@mediarithmics-private/mcs-components-library';
import React, { CSSProperties } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Chart from '../chart-engine';
import cuid from 'cuid';
import { ChartConfig, ChartType } from '../../services/ChartDatasetService';
import McsLazyLoad from '../lazyload';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const BASE_FRAMEWORK_HEIGHT = 96;

export interface DashboardLayoutProps {
  datamart_id: string;
  schema: DashboardContentSchema;
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

export interface DashboardContentSchema {
  sections: DashboardContentSection[];
}

export default class DashboardLayout extends React.Component<DashboardLayoutProps> {
  constructor(props: DashboardLayoutProps) {
    super(props);
  }

  renderChart(chart: ChartConfig, cssProperties?: CSSProperties) {
    const { datamart_id } = this.props;
    return (
      <Chart
        key={cuid()}
        datamartId={datamart_id}
        chartConfig={chart}
        chartContainerStyle={cssProperties}
      />
    );
  }

  computeCSSProperties = (
    charts: ChartConfig[],
    layout: string = 'horizontal',
    chartType: ChartType,
  ) => {
    const horizontalCssProperties = {
      float: 'left' as any,
      height: '100%',
    };

    const isMetricChartType = chartType.toLowerCase() === 'metric';
    const metricChartsList = charts.filter(chart => chart.type.toLowerCase() === 'metric');
    const metricChartSize = 20;
    const otherThanMetricChartSize =
      (100 - metricChartsList.length * metricChartSize) / (charts.length - metricChartsList.length);

    if (layout === 'horizontal') {
      if (isMetricChartType && charts.length > 1) {
        return {
          ...horizontalCssProperties,
          width: `${metricChartSize}%`,
        };
      }
      return {
        ...horizontalCssProperties,
        width:
          !isMetricChartType && metricChartsList
            ? `${otherThanMetricChartSize}%`
            : `${100 / charts.length}%`,
      };
    } else {
      if (isMetricChartType && charts.length > 1) {
        return { minHeight: '85px', height: `${metricChartSize}%` };
      }
      return {
        height:
          !isMetricChartType && metricChartsList
            ? `${otherThanMetricChartSize}%`
            : `${100 / charts.length}%`,
      };
    }
  };

  generateDOM(): React.ReactElement {
    const sections = this.props.schema.sections.map((section, i) => {
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
    return <div className={'mcs-dashboardLayout'}>{sections}</div>;
  }

  renderCard(card: DashboardContentCard, i: number) {
    const charts = card.charts.map((chart, index) => {
      return this.renderChart(
        chart,
        this.computeCSSProperties(card.charts, card.layout, chart.type),
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

import { Card } from '@mediarithmics-private/mcs-components-library';
import React, { CSSProperties } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Chart from '../chart-engine';
import cuid from 'cuid';
import { ChartConfig } from '../../services/ChartDatasetService';
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

  computeCSSProperties = (numberOfCharts: number, layout: string = 'horizontal') => {
    if (layout === 'horizontal')
      return {
        width: `${100 / numberOfCharts}%`,
        float: 'left' as any,
        height: '100%',
      };
    else return { height: `${100 / numberOfCharts}%` };
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
      return this.renderChart(chart, this.computeCSSProperties(card.charts.length, card.layout));
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

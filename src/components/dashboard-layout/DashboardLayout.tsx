import { Card, ContentHeader } from '@mediarithmics-private/mcs-components-library';
import React from 'react';
import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
import ChartDataFetcher from '../chart-engine';
import { ChartConfig } from '../chart-engine/ChartDataFetcher';
import LazyLoad from 'react-lazyload';
import { FormattedMessage } from 'react-intl';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const BASE_FRAMEWORK_HEIGHT = 96;

interface Props {
    datamart_id: string,
    schema: DashboardContentSchema;
}

interface DashboardContentCard {
    x: number,
    y: number,
    w: number,
    h: number,
    layout?: string,
    charts: ChartConfig[]
}

interface DashboardContentSection {
    title: string,
    cards: DashboardContentCard[]
}

interface DashboardContentSchema {
    sections: DashboardContentSection[]
}


export default class DashboardLayout extends React.Component<Props> {

    constructor(props: Props) {
        super(props)
    }

    renderChart(chart: ChartConfig) {
        const { datamart_id } = this.props;
        return <ChartDataFetcher
            datamartId={datamart_id}
            chartConfig={chart}
        ></ChartDataFetcher>
    }

    renderCard(card: DashboardContentCard, i: number) {
        const charts = card.charts.map(chart => {
            return this.renderChart(chart)
        })
        return <div
            key={i.toString()}
        >
            <Card
                className="mcs-cardFlex"
            >
                {charts}
            </Card>
        </div>
    }

    generateDOM(): React.ReactElement {
        const sections = this.props.schema.sections.map(section => {
            const cards = section.cards.map((card, index) => {
                return this.renderCard(card, index);
            })
            const layouts = section.cards.map((card, index) => {
                return {
                    i: index.toString(),
                    x: card.x,
                    y: card.y,
                    w: card.w,
                    h: card.h
                }
            })
            return <div className={"mcs-section"}>
                <div className={"mcs-subtitle2"}>
                    {section.title}
                </div>
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
        })
        return <div className={"mcs-dashboardLayout"}>{sections}</div>
    }


    render() {
        return <LazyLoad
            overflow={true}
            resize={true}
            scroll={true}
            offset={50}
            height={350}
            style={{ height: '100%' }}
        >
            {this.generateDOM()}
        </LazyLoad>
    }
}

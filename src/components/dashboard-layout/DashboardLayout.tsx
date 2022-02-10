import { Card } from '@mediarithmics-private/mcs-components-library';
import { Button, Modal } from 'antd';
import React, { CSSProperties } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Chart from '../chart-engine';
import cuid from 'cuid';
import { ChartConfig, ChartType } from '../../services/ChartDatasetService';
import McsLazyLoad from '../lazyload';
import { AbstractScope } from '../../models/datamart/graphdb/Scope';
import DashboardFilter from './dashboard-filter';
import { QueryFragment } from '../chart-engine/Chart';
import { DimensionFilter } from '../../models/report/ReportRequestBody';
import {
  DashboardContentCard,
  DashboardContentSchema,
  DashboardFilterQueryFragments,
} from '../../models/customDashboards/customDashboards';
import { InjectedDrawerProps } from '../..';
import ChartEditionTab from './wysiwig/ChartEditionTab';
import CardEditionTab from './wysiwig/CardEditionTab';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { defineMessages, InjectedIntlProps } from 'react-intl';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const BASE_FRAMEWORK_HEIGHT = 96;

export interface DashboardLayoutProps {
  datamart_id: string;
  organisationId: string;
  schema: DashboardContentSchema;
  scope?: AbstractScope;
  editable: boolean;
  updateState?: (d: DashboardContentSchema) => void;
}

interface FilterValues {
  [key: string]: string[];
}
export interface DashboardLayoutState {
  dashboardFilterValues: FilterValues;
  formattedQueryFragment: QueryFragment;
}

type Props = DashboardLayoutProps & InjectedIntlProps & InjectedDrawerProps;

const messages = defineMessages({
  dashboardLayoutConfirmation: {
    id: 'dashboard.layout.confirmation',
    defaultMessage: 'Confirmation',
  },
  dashboardLayoutConfirmationText: {
    id: 'dashboard.layout.confirmationText',
    defaultMessage: 'Are you sure you want to delete this chart?',
  },
  confirm: {
    id: 'dashboard.layout.confirm',
    defaultMessage: 'Yes',
  },
  decline: {
    id: 'dashboard.layout.decline',
    defaultMessage: 'No',
  },
});

export default class DashboardLayout extends React.Component<Props, DashboardLayoutState> {
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

  private findCardNode(
    nodeId: string,
    content: DashboardContentSchema,
  ): DashboardContentCard | undefined {
    let res;
    content.sections.forEach(section => {
      section.cards.forEach(card => {
        if (card.id === nodeId) res = card;
      });
    });
    return res;
  }

  private findChartNode(nodeId: string, content: DashboardContentSchema): ChartConfig | undefined {
    let res;
    content.sections.forEach(section => {
      section.cards.forEach(card => {
        card.charts.forEach(chart => {
          if (chart.id === nodeId) res = chart;
        });
      });
    });
    return res;
  }

  private swapCharts(chartsList: ChartConfig[], index1: number, index2: number) {
    const tmp = chartsList[index1];
    chartsList[index1] = chartsList[index2];
    chartsList[index2] = tmp;
  }

  private moveChartNode(
    direction: 'up' | 'down',
    chartIndex: number,
    card: DashboardContentCard,
  ): boolean {
    let neighborIndex: number | undefined;
    if (direction === 'up' && chartIndex > 0) neighborIndex = chartIndex - 1;
    else if (direction === 'down' && chartIndex < card.charts.length - 1)
      neighborIndex = chartIndex + 1;

    if (neighborIndex !== undefined) {
      this.swapCharts(card.charts, chartIndex, neighborIndex);
      return true;
    }

    return false;
  }

  private updateChart(
    newChartConfig: ChartConfig,
    chartNode: ChartConfig,
    contentCopy: DashboardContentSchema,
  ) {
    const { updateState } = this.props;
    const existingChart: any = chartNode;
    const newChart: any = newChartConfig;

    const keys = Object.keys(newChart);
    keys.forEach(key => {
      existingChart[key] = newChart[key];
    });
    if (updateState) updateState(contentCopy);
  }

  private createChart(
    newChartConfig: ChartConfig,
    cardNode: DashboardContentCard,
    contentCopy: DashboardContentSchema,
    newId: string,
  ) {
    const { updateState } = this.props;
    newChartConfig.id = newId;

    cardNode.charts.push(newChartConfig);

    if (updateState) updateState(contentCopy);
  }

  private deleteChart(
    chartIndex: number,
    card: DashboardContentCard,
    contentCopy: DashboardContentSchema,
  ) {
    const { updateState } = this.props;

    if (updateState) {
      card.charts.splice(chartIndex, 1);
      updateState(contentCopy);
    }
  }

  private handleMoveChart(
    direction: 'up' | 'down',
    chartIndex: number,
    card: DashboardContentCard,
    content: DashboardContentSchema,
  ) {
    const { updateState } = this.props;
    if (card.id && updateState) {
      const contentCopy: DashboardContentSchema = JSON.parse(JSON.stringify(content));
      const cardNode = this.findCardNode(card.id, contentCopy);

      if (cardNode && this.moveChartNode(direction, chartIndex, cardNode)) updateState(contentCopy);
    }
  }

  private handleEditCard(card: DashboardContentCard, content: DashboardContentSchema) {
    const { updateState, openNextDrawer, closeNextDrawer } = this.props;
    const contentCopy = JSON.parse(JSON.stringify(content));
    if (card.id) {
      const cardNode: any = this.findCardNode(card.id, contentCopy);
      if (updateState && cardNode) {
        openNextDrawer(CardEditionTab, {
          size: 'extrasmall',
          className: 'mcs-drawer-cardEdition',
          additionalProps: {
            closeTab: closeNextDrawer,
            card: card,
            saveCard: (c: DashboardContentCard) => {
              const newDashboardContentCard: any = c;
              const keys = Object.keys(newDashboardContentCard);
              keys.forEach(key => {
                cardNode[key] = newDashboardContentCard[key];
              });
              updateState(contentCopy);
            },
          },
        });
      }
    }
  }

  private handleEditChart(chart: ChartConfig, content: DashboardContentSchema) {
    const { updateState, openNextDrawer, closeNextDrawer } = this.props;
    const contentCopy = JSON.parse(JSON.stringify(content));
    if (chart.id) {
      const chartNode = this.findChartNode(chart.id, contentCopy);
      if (updateState && chartNode) {
        openNextDrawer(ChartEditionTab, {
          size: 'small',
          className: 'mcs-drawer-cardEdition',
          additionalProps: {
            closeTab: closeNextDrawer,
            chartConfig: chartNode,
            saveChart: (c: ChartConfig) => {
              this.updateChart(c, chartNode, contentCopy);
            },
          },
        });
      }
    }
  }

  private handleDeleteChart(
    chartIndex: number,
    card: DashboardContentCard,
    content: DashboardContentSchema,
  ) {
    const { intl } = this.props;
    const contentCopy = JSON.parse(JSON.stringify(content));

    if (card.id) {
      const cardNode = this.findCardNode(card.id, contentCopy);
      if (cardNode) {
        const deleteChart = () => {
          this.deleteChart(chartIndex, cardNode, contentCopy);
        };
        Modal.confirm({
          title: intl.formatMessage(messages.dashboardLayoutConfirmation),
          content: intl.formatMessage(messages.dashboardLayoutConfirmationText),
          okText: intl.formatMessage(messages.confirm),
          cancelText: intl.formatMessage(messages.decline),
          onOk() {
            deleteChart();
          },
        });
      }
    }
  }

  private handleCreateChart(
    card: DashboardContentCard,
    content: DashboardContentSchema,
    newId: string,
  ) {
    const { updateState, openNextDrawer, closeNextDrawer } = this.props;
    const contentCopy = JSON.parse(JSON.stringify(content));
    if (card.id) {
      const cardNode = this.findCardNode(card.id, contentCopy);
      if (updateState && cardNode) {
        openNextDrawer(ChartEditionTab, {
          size: 'small',
          className: 'mcs-drawer-cardEdition',
          additionalProps: {
            closeTab: closeNextDrawer,
            saveChart: (newChartConfig: ChartConfig) => {
              const chartNode = this.findChartNode(newId, contentCopy);
              if (chartNode) {
                this.updateChart(newChartConfig, chartNode, contentCopy);
              } else this.createChart(newChartConfig, cardNode, contentCopy, newId);
            },
          },
        });
      }
    }
  }

  renderCard(card: DashboardContentCard, i: number) {
    const { editable, schema } = this.props;

    const charts = card.charts.map((chart, index) => {
      return this.renderChart(
        chart,
        index,
        card,
        this.computeCSSProperties(card.charts, card.layout, chart.type, card.h),
      );
    });

    const handleEditCard = () => this.handleEditCard(card, schema);
    const handleCreateChart = () => this.handleCreateChart(card, schema, cuid());

    const menu =
      editable && card.id ? (
        <div className='mcs-card-cardMenu'>
          <div className='mcs-cardMenu-buttons'>
            <EditOutlined className='mcs-cardMenu-circleIcon' onClick={handleEditCard} />
            <div
              className='mcs-cardMenu-option mcs-cardMenu-option_left mcs-dashboardLayout_edit_card'
              onClick={handleEditCard}
            >
              Edit card
            </div>
            <PlusOutlined className='mcs-cardMenu-circleIcon' onClick={handleCreateChart} />
            <div
              className='mcs-cardMenu-option mcs-dashboardLayout_add_chart'
              onClick={handleCreateChart}
            >
              Add chart
            </div>
          </div>
        </div>
      ) : undefined;

    const cardComponent = (
      <Card className='mcs-cardFlex'>
        {menu ? menu : <div />}
        {charts}
      </Card>
    );
    return (
      <div key={i.toString()}>
        <McsLazyLoad key={cuid()} child={cardComponent} />
      </div>
    );
  }

  renderChart(
    chart: ChartConfig,
    chartIndex: number,
    card: DashboardContentCard,
    cssProperties?: CSSProperties,
  ) {
    const { datamart_id, scope, organisationId, editable, schema } = this.props;
    const { formattedQueryFragment } = this.state;

    const onClickEdit = editable ? () => this.handleEditChart(chart, schema) : undefined;
    const onClickChartMove = editable
      ? (direction: 'up' | 'down') => this.handleMoveChart(direction, chartIndex, card, schema)
      : undefined;
    const onClickDelete = editable
      ? () => this.handleDeleteChart(chartIndex, card, schema)
      : undefined;
    return (
      <Chart
        key={cuid()}
        datamartId={datamart_id}
        onClickEdit={onClickEdit}
        onClickMove={onClickChartMove}
        onClickDelete={onClickDelete}
        organisationId={organisationId}
        chartConfig={chart}
        chartContainerStyle={cssProperties}
        scope={scope}
        queryFragment={formattedQueryFragment}
        openNextDrawer={this.props.openNextDrawer}
        closeNextDrawer={this.props.closeNextDrawer}
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

    const metricChartWidthSize = 30;
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

  applyFilter = () => {
    const { dashboardFilterValues, formattedQueryFragment } = this.state;
    const { schema } = this.props;

    // deep copy array
    let newFormattedQueryFragment = JSON.parse(JSON.stringify(formattedQueryFragment));

    for (const filterName in dashboardFilterValues) {
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
                JSON.stringify(dashboardFilterValues[filterName]),
              );
              break;
            case 'activities_analytics':
              formattedFrament = (q.fragment as DimensionFilter[]).map((f: DimensionFilter) => {
                return { ...f, expressions: dashboardFilterValues[filterName] };
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
          dashboardFilterValues[filterName].length > 0 ? currentFormattedQueryFragment : {};
      } else {
        newFormattedQueryFragment = {
          ...newFormattedQueryFragment,
          [filterName]: currentFormattedQueryFragment,
        };
      }
    }

    this.setState({
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
          {section.title && <div className={'mcs-subtitle2'}>{section.title}</div>}
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
        {schema.available_filters && (
          <div className={'mcs-dashboardLayout_filters'}>
            {schema.available_filters.map((filter, index) => (
              <DashboardFilter
                key={index.toString()}
                filter={filter}
                datamartId={datamart_id}
                onFilterChange={this.handleDashboardFilterChange}
              />
            ))}
            <Button
              onClick={this.applyFilter}
              type='primary'
              className='mcs-primary mcs-dashboardLayout_filters_applyBtn'
            >
              Apply
            </Button>
          </div>
        )}
        {sections}
      </div>
    );
  }

  render() {
    return this.generateDOM();
  }
}

import { Card } from '@mediarithmics-private/mcs-components-library';
import { Button, Modal } from 'antd';
import React, { CSSProperties } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import Chart from '../chart-engine';
import cuid from 'cuid';
import { ChartCommonConfig, ChartConfig, ChartType } from '../../services/ChartDatasetService';
import McsLazyLoad from '../lazyload';
import { AbstractScope } from '../../models/datamart/graphdb/Scope';
import DashboardFilter from './dashboard-filter';
import { DimensionFilter } from '../../models/report/ReportRequestBody';
import {
  DashboardContentCard,
  DashboardContentSchema,
  DashboardContentSection,
  DashboardFilterQueryFragments,
} from '../../models/customDashboards/customDashboards';
import { ICustomDashboardService, InjectedDrawerProps, lazyInject, TYPES } from '../..';
import ChartEditionTab from './wysiwig/ChartEditionTab';
import CardEditionTab from './wysiwig/CardEditionTab';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { defineMessages, InjectedIntlProps } from 'react-intl';
import { QueryFragment } from '../../utils/source/DataSourceHelper';
import SectionTitleEditionPanel, { VerticalDirection } from './wysiwig/SectionTitleEditionPanel';
import {
  QueryExecutionSource,
  QueryExecutionSubSource,
} from '../../models/platformMetrics/QueryExecutionSource';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const BASE_FRAMEWORK_HEIGHT = 96;

export interface DashboardLayoutProps {
  datamart_id: string;
  organisationId: string;
  schema: DashboardContentSchema;
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
  dashboardLayoutChartDeleteConfirmationText: {
    id: 'dashboard.layout.chartDeleteConfirmationText',
    defaultMessage: 'Are you sure you want to delete this chart?',
  },
  dashboardLayoutCardDeleteConfirmationText: {
    id: 'dashboard.layout.cardDeleteConfirmationText',
    defaultMessage: 'Are you sure you want to delete this card?',
  },
  dashboardLayoutConfirmationSectionText: {
    id: 'dashboard.layout.confirmationSectionText',
    defaultMessage: 'Are you sure you want to delete this section?',
  },
  confirm: {
    id: 'dashboard.layout.confirm',
    defaultMessage: 'Yes',
  },
  decline: {
    id: 'dashboard.layout.decline',
    defaultMessage: 'No',
  },
  addCard: {
    id: 'dashboard.layout.addCard',
    defaultMessage: 'Add a card',
  },
});

export default class DashboardLayout extends React.Component<Props, DashboardLayoutState> {
  @lazyInject(TYPES.ICustomDashboardService)
  private _dashboardService: ICustomDashboardService;

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

  private findSectionNode(
    nodeId: string,
    content: DashboardContentSchema,
  ): DashboardContentSection | undefined {
    return content.sections.find(section => section.id === nodeId);
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

  private swapSections(sectionsList: DashboardContentSection[], index1: number, index2: number) {
    const tmp = sectionsList[index1];
    sectionsList[index1] = sectionsList[index2];
    sectionsList[index2] = tmp;
  }

  private moveChartNode(
    direction: VerticalDirection,
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
    newChartConfig: ChartCommonConfig,
    chartNode: ChartConfig,
    contentCopy: DashboardContentSchema,
  ) {
    const { updateState, organisationId } = this.props;
    const existingChart: any = chartNode;

    this._dashboardService
      .getChartConfigByCommonChartConfig(newChartConfig, organisationId)
      .then(chartConfig => {
        const newChart: any = chartConfig;
        const keys = Object.keys(newChart).filter(key => key !== 'id');
        keys.forEach(key => {
          existingChart[key] = newChart[key];
        });
        if (updateState) updateState(contentCopy);
      });
  }

  private createChart(
    newChartConfig: ChartCommonConfig,
    cardNode: DashboardContentCard,
    contentCopy: DashboardContentSchema,
    newId: string,
  ) {
    const { updateState, organisationId } = this.props;
    newChartConfig.id = newId;
    this._dashboardService
      .getChartConfigByCommonChartConfig(newChartConfig, organisationId)
      .then(chartConfig => {
        cardNode.charts.push(chartConfig);

        if (updateState) updateState(contentCopy);
      });
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

  private deleteSection = (sectionId: string, contentCopy: DashboardContentSchema) => {
    const { updateState } = this.props;

    if (updateState) {
      const sectionIndex = contentCopy.sections.findIndex(s => s.id === sectionId);
      contentCopy.sections.splice(sectionIndex, 1);
      updateState(contentCopy);
    }
  };

  private moveSectionNode(
    direction: VerticalDirection,
    sectionIndex: number,
    schema: DashboardContentSchema,
  ): boolean {
    let neighborIndex: number | undefined;
    if (direction === 'up' && sectionIndex > 0) neighborIndex = sectionIndex - 1;
    else if (direction === 'down' && sectionIndex < schema.sections.length - 1)
      neighborIndex = sectionIndex + 1;

    if (neighborIndex !== undefined) {
      this.swapSections(schema.sections, sectionIndex, neighborIndex);
      return true;
    }

    return false;
  }

  private handleMoveChart(
    direction: VerticalDirection,
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
    const { updateState, openNextDrawer, closeNextDrawer, intl } = this.props;
    const contentCopy: DashboardContentSchema = JSON.parse(JSON.stringify(content));
    if (card.id) {
      const cardNode: any = this.findCardNode(card.id, contentCopy);
      if (updateState && cardNode) {
        openNextDrawer(CardEditionTab, {
          size: 'extrasmall',
          className: 'mcs-drawer-cardEdition',
          additionalProps: {
            closeTab: closeNextDrawer,
            card: card,
            deleteCard: () => {
              const onOk = () => {
                contentCopy.sections.forEach(section => {
                  section.cards = section.cards.filter(x => x.id !== card.id);
                });
                updateState(contentCopy);
                closeNextDrawer();
              };
              Modal.confirm({
                title: intl.formatMessage(messages.dashboardLayoutConfirmation),
                content: intl.formatMessage(messages.dashboardLayoutCardDeleteConfirmationText),
                okText: intl.formatMessage(messages.confirm),
                cancelText: intl.formatMessage(messages.decline),
                onOk,
              });
            },
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
    const { datamart_id, updateState, openNextDrawer, closeNextDrawer, intl } = this.props;
    const contentCopy: DashboardContentSchema = JSON.parse(JSON.stringify(content));
    if (chart.id) {
      const chartNode = this.findChartNode(chart.id, contentCopy);
      if (updateState && chartNode) {
        openNextDrawer(ChartEditionTab, {
          size: 'small',
          className: 'mcs-drawer-cardEdition',
          additionalProps: {
            datamartId: datamart_id,
            closeTab: closeNextDrawer,
            chartConfig:
              this._dashboardService.removeExternallyLoadedPropertiesFromChartConfig(chartNode),
            saveChart: (c: ChartCommonConfig) => {
              this.updateChart(c, chartNode, contentCopy);
            },
            deleteChart: () => {
              const onOk = () => {
                contentCopy.sections.forEach(section => {
                  section.cards.forEach(card => {
                    card.charts = card.charts.filter(ch => ch.id !== chart.id);
                  });
                });
                updateState(contentCopy);
                closeNextDrawer();
              };
              Modal.confirm({
                title: intl.formatMessage(messages.dashboardLayoutConfirmation),
                content: intl.formatMessage(messages.dashboardLayoutChartDeleteConfirmationText),
                okText: intl.formatMessage(messages.confirm),
                cancelText: intl.formatMessage(messages.decline),
                onOk,
              });
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
          content: intl.formatMessage(messages.dashboardLayoutChartDeleteConfirmationText),
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
    const { datamart_id, updateState, openNextDrawer, closeNextDrawer } = this.props;
    const contentCopy = JSON.parse(JSON.stringify(content));
    if (card.id) {
      const cardNode = this.findCardNode(card.id, contentCopy);
      if (updateState && cardNode) {
        openNextDrawer(ChartEditionTab, {
          size: 'small',
          className: 'mcs-drawer-cardEdition',
          additionalProps: {
            datamartId: datamart_id,
            closeTab: closeNextDrawer,
            saveChart: (newChartConfig: ChartCommonConfig) => {
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

  renderCreateSectionIcon = (index: number) => {
    const handleCreateSection = () => {
      this.handleCreateSection(index);
    };

    return (
      <div className='mcs-section_buttons'>
        <PlusOutlined className='mcs-section_circleIcon' onClick={handleCreateSection} />
        <div
          className='mcs-cardMenu-option mcs-cardMenu-option_left mcs-dashboardLayout_add_section'
          onClick={handleCreateSection}
        >
          Create new section
        </div>
      </div>
    );
  };

  renderCard(card: DashboardContentCard, i: string) {
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
            <div
              className='mcs-cardMenu-option mcs-cardMenu-option_left mcs-dashboardLayout_edit_card'
              onClick={handleEditCard}
            >
              <EditOutlined className='mcs-cardMenu-circleIcon' />
              Edit card
            </div>
            <div
              className='mcs-cardMenu-option mcs-dashboardLayout_add_chart'
              onClick={handleCreateChart}
            >
              <PlusOutlined className='mcs-cardMenu-circleIcon' />
              Add chart
            </div>
          </div>
        </div>
      ) : undefined;

    const cardComponent = (
      <Card className='mcs-cardFlex mcs-dashboardLayout_card'>
        {menu ? menu : <div />}
        {charts}
      </Card>
    );
    return (
      <div key={i}>
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
    const {
      datamart_id,
      scope,
      organisationId,
      editable,
      schema,
      queryExecutionSource,
      queryExecutionSubSource,
    } = this.props;
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
        key={chart.id ? chart.id : cuid()}
        datamartId={datamart_id}
        onClickEdit={onClickEdit}
        onClickMove={onClickChartMove}
        onClickDelete={onClickDelete}
        organisationId={organisationId}
        chartConfig={chart}
        chartContainerStyle={cssProperties}
        scope={scope}
        queryFragment={formattedQueryFragment}
        showButtonUp={chartIndex > 0}
        showButtonDown={chartIndex < card.charts.length - 1}
        layout={
          card.layout === 'vertical' || card.layout === 'horizontal' ? card.layout : 'horizontal'
        }
        queryExecutionSource={queryExecutionSource}
        queryExecutionSubSource={queryExecutionSubSource}
      />
    );
  }

  computeCSSProperties = (
    charts: ChartConfig[],
    layout: string = 'horizontal',
    chartType: ChartType,
    cardHeight: number,
  ) => {
    const { editable } = this.props;

    const isMetricChartType = chartType.toLowerCase() === 'metric';
    const metricChartsList = charts.filter(chart => chart.type.toLowerCase() === 'metric');
    const metricHeigthInPx = 63;
    const cardPadding = 15;
    const vSpaceBetweenRows = 10;
    const metricHeightInPxWithPadding = 83;
    const cardEditMenuHeight = 18;
    const cardHeightInPixel =
      cardHeight * BASE_FRAMEWORK_HEIGHT + (cardHeight - 1) * vSpaceBetweenRows;
    const chartPadding = 20;
    // We add this correction to avoid charts exceeding the bottom limits in some cases
    const heightCorrectionForHorizontalCase = 12;

    const horizontalChartHeight =
      cardHeightInPixel -
      2 * cardPadding -
      (editable ? cardEditMenuHeight : 0) -
      heightCorrectionForHorizontalCase;

    const horizontalCssProperties = {
      float: 'left' as any,
      height: `${horizontalChartHeight}px`,
    };

    const nonMetricChartsCount =
      charts.length - metricChartsList.length > 0 ? charts.length - metricChartsList.length : 1;

    const otherThanMetricChartHeigth =
      (cardHeightInPixel -
        2 * cardPadding -
        (editable ? cardEditMenuHeight : 0) -
        metricChartsList.length * metricHeightInPxWithPadding) /
        nonMetricChartsCount -
      chartPadding;

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
      if (dashboardFilterValues.hasOwnProperty(filterName)) {
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
    }

    this.setState({
      formattedQueryFragment: newFormattedQueryFragment,
    });
  };

  onLayoutChange(currentLayout: Layout[], sectionId: string) {
    const { schema, updateState } = this.props;
    if (updateState) {
      const contentCopy: DashboardContentSchema = JSON.parse(JSON.stringify(schema));
      const sectionNode = this.findSectionNode(sectionId, contentCopy);
      if (sectionNode) {
        currentLayout.forEach(layout => {
          const card = sectionNode.cards.find(c => c.id === layout.i);

          if (card) {
            card.h = layout.h;
            card.w = layout.w;
            card.x = layout.x;
            card.y = layout.y;
          }
        });

        updateState(contentCopy);
      }
    }
  }

  handleAddCardToSection(sectionId: string) {
    const { schema, updateState } = this.props;

    const contentCopy: DashboardContentSchema = JSON.parse(JSON.stringify(schema));
    const sectionNode = this.findSectionNode(sectionId, contentCopy);

    if (updateState && sectionNode) {
      let maxY = 0;
      sectionNode.cards.forEach(card => {
        if (card.y + card.h > maxY) maxY = card.y + card.h;
      });

      const newCard: DashboardContentCard = {
        id: cuid(),
        x: 0,
        y: maxY,
        w: 12,
        h: 3,
        layout: 'horizontal',
        charts: [],
      };
      sectionNode.cards.push(newCard);
      updateState(contentCopy);
    }
  }

  handleSaveSection(sectionId: string, title: string) {
    const { schema, updateState } = this.props;

    if (updateState) {
      const contentCopy: DashboardContentSchema = JSON.parse(JSON.stringify(schema));
      const sectionNode = this.findSectionNode(sectionId, contentCopy);
      if (sectionNode) {
        sectionNode.title = title;
        updateState(contentCopy);
      }
    }
  }

  handleDeleteSection = (sectionId: string, content: DashboardContentSchema) => {
    const { intl } = this.props;
    const contentCopy = JSON.parse(JSON.stringify(content));

    const deleteSection = () => {
      this.deleteSection(sectionId, contentCopy);
    };
    Modal.confirm({
      title: intl.formatMessage(messages.dashboardLayoutConfirmation),
      content: intl.formatMessage(messages.dashboardLayoutConfirmationSectionText),
      okText: intl.formatMessage(messages.confirm),
      cancelText: intl.formatMessage(messages.decline),
      onOk() {
        deleteSection();
      },
    });
  };

  handleMoveSection = (sectionId: string, direction: VerticalDirection) => {
    const { schema, updateState } = this.props;

    if (updateState) {
      const contentCopy: DashboardContentSchema = JSON.parse(JSON.stringify(schema));
      const sectionNode = this.findSectionNode(sectionId, contentCopy);
      const sectionIndex = schema.sections.findIndex(s => s.id === sectionId);
      if (sectionNode && this.moveSectionNode(direction, sectionIndex, contentCopy))
        updateState(contentCopy);
    }
  };

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  renderSection(section: DashboardContentSection, sectionIndex: number) {
    const { editable, intl, schema } = this.props;

    const cards = section.cards.map((card, index) => {
      return this.renderCard(card, editable && card.id ? card.id : index.toString());
    });
    const layouts: Layout[] = section.cards.map((card, index) => {
      return {
        i: editable && card.id ? card.id : index.toString(),
        x: card.x,
        y: card.y,
        w: card.w,
        h: card.h,
      };
    });

    const onLayoutChange = (currentLayout: Layout[]) => {
      if (section.id) this.onLayoutChange(currentLayout, section.id);
    };

    const addCardToSection = () => {
      if (section.id) this.handleAddCardToSection(section.id);
    };

    const handleSaveSection = (s: DashboardContentSection) => {
      if (s.id) this.handleSaveSection(s.id, s.title);
    };

    const handleClickDelete = () => {
      if (section.id) this.handleDeleteSection(section.id, schema);
    };

    const handleClickMove = (direction: VerticalDirection) => {
      if (section.id) this.handleMoveSection(section.id, direction);
    };

    const sectionKey = section.id ? section.id : cuid();

    return (
      <div key={sectionKey} className={'mcs-section'}>
        {editable ? (
          <SectionTitleEditionPanel
            section={section}
            onSaveSection={handleSaveSection}
            showButtonUp={sectionIndex > 0}
            showButtonDown={sectionIndex < schema.sections.length - 1}
            onClickDelete={handleClickDelete}
            onClickMove={handleClickMove}
          />
        ) : (
          section.title && <div className={'mcs-subtitle2'}>{section.title}</div>
        )}
        <ResponsiveReactGridLayout
          cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
          layouts={{ lg: layouts }}
          isDraggable={editable}
          isResizable={editable}
          measureBeforeMount={false}
          compactType={'vertical'}
          preventCollision={false}
          rowHeight={BASE_FRAMEWORK_HEIGHT}
          onLayoutChange={editable ? onLayoutChange : undefined}
          resizeHandles={editable ? ['se'] : undefined}
          className={editable ? 'mcs-section_editable' : undefined}
        >
          {cards}
        </ResponsiveReactGridLayout>
        {editable && (
          <div>
            <Button className='mcs-section_addCardButton' onClick={addCardToSection}>
              {intl.formatMessage(messages.addCard)}
            </Button>
            {this.renderCreateSectionIcon(sectionIndex)}
          </div>
        )}
      </div>
    );
  }

  generateDOM(): React.ReactElement {
    const { schema, datamart_id, organisationId, queryExecutionSource, queryExecutionSubSource } =
      this.props;
    const sections = schema.sections.map((section, i) => this.renderSection(section, i));
    return (
      <div className={'mcs-dashboardLayout'}>
        {schema.available_filters && (
          <div className={'mcs-dashboardLayout_filters'}>
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

import { Card } from '@mediarithmics-private/mcs-components-library';
import { Button, Divider, Modal, Tooltip } from 'antd';
import React, { CSSProperties } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import Chart from '../chart-engine';
import cuid from 'cuid';
import { ChartConfig } from '../../services/ChartDatasetService';
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
import { InjectedFeaturesProps, injectFeatures } from '../Features';
import { injectDrawer } from '../drawer';
import { InjectedDrawerProps, SegmentSelector } from '../..';
import ChartEditionTab from './wysiwig/ChartEditionTab';
import CardEditionTab from './wysiwig/CardEditionTab';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { InjectedIntlProps, injectIntl, defineMessages, WrappedComponentProps } from 'react-intl';
import { QueryFragment } from '../../utils/source/DataSourceHelper';
import SectionTitleEditionPanel, { VerticalDirection } from './wysiwig/SectionTitleEditionPanel';
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
  BASE_FRAMEWORK_HEIGHT,
  computeCSSProperties,
  findCardNode,
  findChartNode,
  findSectionNode,
  injectFirstSectionTitle,
  limitTextLength,
  mergeChartConfigs,
  moveChartNode,
  moveSectionNode,
  transformSchemaForComparaison,
} from './DashboardFunctions';
import { AudienceSegmentShape } from '../../models/audienceSegment/AudienceSegmentResource';
import { compose } from 'recompose';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

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
  dashboardLayoutConfirmation: {
    id: 'dashboard.layout.confirmation',
    defaultMessage: 'Confirmation',
  },
  dashboardLayoutChartDeleteConfirmationText: {
    id: 'dashboard.layout.chartDeleteConfirmationText',
    defaultMessage: 'Are you sure you want to remove this chart?',
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

  private setChartsFormattedData = (
    chartTitle: string,
    data?: AggregateDataset | CountDataset | JsonDataset,
  ) => {
    this.chartsFormattedData = this.chartsFormattedData.set(chartTitle, data);
  };

  private updateChart(
    newChartConfig: ChartConfig,
    chartId: string,
    contentCopy: DashboardContentSchema,
  ) {
    const { updateState } = this.props;
    const newSections = contentCopy.sections.map(section => ({
      ...section,
      cards: section.cards.map(card => ({
        ...card,
        charts: card.charts.map(chart => {
          if (chart.id === chartId) {
            return { ...chart, ...newChartConfig };
          } else {
            return chart;
          }
        }),
      })),
    }));

    mergeChartConfigs(chartNode, savingChartConfig);
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

  private deleteSection = (sectionId: string, contentCopy: DashboardContentSchema) => {
    const { updateState } = this.props;

    if (updateState) {
      const sectionIndex = contentCopy.sections.findIndex(s => s.id === sectionId);
      contentCopy.sections.splice(sectionIndex, 1);
      updateState(contentCopy);
    }
  };

  private handleMoveChart(
    direction: VerticalDirection,
    chartIndex: number,
    card: DashboardContentCard,
    content: DashboardContentSchema,
  ) {
    const { updateState } = this.props;
    if (card.id && updateState) {
      const contentCopy: DashboardContentSchema = JSON.parse(JSON.stringify(content));
      const cardNode = findCardNode(card.id, contentCopy);

      if (cardNode && moveChartNode(direction, chartIndex, cardNode)) updateState(contentCopy);
    }
  }

  private handleEditCard(card: DashboardContentCard, content: DashboardContentSchema) {
    const { updateState, openNextDrawer, closeNextDrawer, intl } = this.props;
    const contentCopy: DashboardContentSchema = JSON.parse(JSON.stringify(content));
    if (card.id) {
      const cardNode: any = findCardNode(card.id, contentCopy);
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
      const chartNode = findChartNode(chart.id, contentCopy);
      if (updateState && chartNode) {
        openNextDrawer(ChartEditionTab, {
          size: 'large',
          className: 'mcs-drawer-chartEdition',
          closingDrawerClassName: 'mcs-drawer-chartEdition-close',
          additionalProps: {
            datamartId: datamart_id,
            closeTab: closeNextDrawer,
            chartConfig: chartNode,
            saveChart: (savingChartConfig: ChartConfig) => {
              this.updateChart(savingChartConfig, chartId, contentCopy);
              closeNextDrawer();
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
      const cardNode = findCardNode(card.id, contentCopy);
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
      const cardNode = findCardNode(card.id, contentCopy);
      if (updateState && cardNode) {
        openNextDrawer(ChartEditionTab, {
          size: 'large',
          className: 'mcs-drawer-chartEdition',
          closingDrawerClassName: 'mcs-drawer-chartEdition-close',
          additionalProps: {
            datamartId: datamart_id,
            closeTab: closeNextDrawer,
            saveChart: (newChartConfig: ChartConfig) => {
              const chartNode = findChartNode(newId, contentCopy);
              if (chartNode) {
                this.updateChart(newChartConfig, chartNode, contentCopy);
              } else this.createChart(newChartConfig, cardNode, contentCopy, newId);
              closeNextDrawer();
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

  renderCard(card: DashboardContentCard, cardIndex: string, queryFragment: QueryFragment) {
    const { editable, schema } = this.props;

    const charts = card.charts.map((chart, chartIndex) => {
      return this.renderChart(
        chart,
        chartIndex,
        card,
        queryFragment,
        computeCSSProperties(card.charts, chart.type, card.h, editable, card.layout),
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
      <div key={cardIndex}>
        <McsLazyLoad key={cuid()} child={cardComponent} />
      </div>
    );
  }

  renderChart(
    chart: ChartConfig,
    chartIndex: number,
    card: DashboardContentCard,
    queryFragment: QueryFragment,
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
        queryFragment={queryFragment}
        showButtonUp={chartIndex > 0}
        showButtonDown={chartIndex < card.charts.length - 1}
        layout={
          card.layout === 'vertical' || card.layout === 'horizontal' ? card.layout : 'horizontal'
        }
        queryExecutionSource={queryExecutionSource}
        queryExecutionSubSource={queryExecutionSubSource}
        setChartsFormattedData={this.setChartsFormattedData}
      />
    );
  }

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

  onLayoutChange(currentLayout: Layout[], sectionId: string) {
    const { schema, updateState } = this.props;
    if (updateState) {
      const contentCopy: DashboardContentSchema = JSON.parse(JSON.stringify(schema));
      const sectionNode = findSectionNode(sectionId, contentCopy);
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
    const sectionNode = findSectionNode(sectionId, contentCopy);

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
      const sectionNode = findSectionNode(sectionId, contentCopy);
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
      const sectionNode = findSectionNode(sectionId, contentCopy);
      const sectionIndex = schema.sections.findIndex(s => s.id === sectionId);
      if (sectionNode && moveSectionNode(direction, sectionIndex, contentCopy))
        updateState(contentCopy);
    }
  };

  renderSection(
    section: DashboardContentSection,
    sectionIndex: number,
    queryFragment: QueryFragment,
  ) {
    const { editable, intl, schema } = this.props;

    const cards = section.cards.map((card, index) => {
      return this.renderCard(card, editable && card.id ? card.id : index.toString(), queryFragment);
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

    const sections = schemaToDisplay.sections.map((section, i) =>
      this.renderSection(section, i, formattedQueryFragment),
    );

    const sectionsCompare =
      schemaToCompare && comparisonValues
        ? schemaToCompare.sections.map((section, i) =>
            this.renderSection(section, i, comparisonValues.fragment),
          )
        : undefined;

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

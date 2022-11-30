import { Card } from '@mediarithmics-private/mcs-components-library';
import { Button, Modal } from 'antd';
import React from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import cuid from 'cuid';
import { ChartConfig } from '../../services/ChartDatasetService';
import McsLazyLoad from '../lazyload';
import { AbstractScope } from '../../models/datamart/graphdb/Scope';
import {
  DashboardContentCard,
  DashboardContentSchema,
  DashboardContentSection,
} from '../../models/customDashboards/customDashboards';
import { InjectedFeaturesProps, injectFeatures } from '../Features';
import { injectDrawer } from '../drawer';
import { InjectedDrawerProps } from '../..';
import ChartEditionTab from './wysiwig/ChartEditionTab';
import CardEditionTab from './wysiwig/CardEditionTab';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl';
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
import {
  BASE_FRAMEWORK_HEIGHT,
  computeCSSProperties,
  findCardNode,
  findSectionNode,
  moveElement,
} from './DashboardFunctions';
import { compose } from 'recompose';
import DashboardChartLayout from './DashboardChartLayout';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const messages = defineMessages({
  dashboardLayoutConfirmation: {
    id: 'dashboard.layout.confirmation',
    defaultMessage: 'Confirmation',
  },
  dashboardLayoutCardDeleteConfirmationText: {
    id: 'dashboard.layout.cardDeleteConfirmationText',
    defaultMessage: 'Are you sure you want to delete this card?',
  },
  confirm: {
    id: 'dashboard.layout.confirm',
    defaultMessage: 'Yes',
  },
  decline: {
    id: 'dashboard.layout.decline',
    defaultMessage: 'No',
  },
  dashboardLayoutChartDeleteConfirmationText: {
    id: 'dashboard.layout.chartDeleteConfirmationText',
    defaultMessage: 'Are you sure you want to remove this chart?',
  },
  dashboardLayoutConfirmationSectionText: {
    id: 'dashboard.layout.confirmationSectionText',
    defaultMessage: 'Are you sure you want to delete this section?',
  },
  addCard: {
    id: 'dashboard.layout.addCard',
    defaultMessage: 'Add a card',
  },
});

export interface DashboardBodyProps {
  schema: DashboardContentSchema;
  updateState?: (d: DashboardContentSchema) => void;
  editable: boolean;
  datamartId: string;
  scope?: AbstractScope;
  organisationId: string;
  queryExecutionSource: QueryExecutionSource;
  queryExecutionSubSource: QueryExecutionSubSource;
  formattedQueryFragment: QueryFragment;
  setChartsFormattedData: (
    chartTitle: string,
    data?: AggregateDataset | CountDataset | JsonDataset,
  ) => void;
}

export interface DashboardBodyState {}

type Props = DashboardBodyProps &
  WrappedComponentProps &
  InjectedDrawerProps &
  InjectedFeaturesProps;

class DashboardBody extends React.Component<Props, DashboardBodyState> {
  constructor(props: Props) {
    super(props);
  }

  shouldComponentUpdate(nextProps: Props, nextState: DashboardBodyState) {
    const {
      schema,
      scope,
      formattedQueryFragment,
      queryExecutionSource,
      organisationId,
      datamartId,
      editable,
    } = this.props;
    return (
      JSON.stringify(schema) !== JSON.stringify(nextProps.schema) ||
      JSON.stringify(scope) !== JSON.stringify(nextProps.scope) ||
      JSON.stringify(formattedQueryFragment) !== JSON.stringify(nextProps.formattedQueryFragment) ||
      JSON.stringify(queryExecutionSource) !== JSON.stringify(nextProps.queryExecutionSource) ||
      organisationId !== nextProps.organisationId ||
      datamartId !== nextProps.datamartId ||
      editable !== nextProps.editable
    );
  }

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
    if (updateState) updateState({ ...contentCopy, sections: newSections });
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

  private handleCreateChart(
    card: DashboardContentCard,
    content: DashboardContentSchema,
    newId: string,
  ) {
    const { datamartId, updateState, openNextDrawer, closeNextDrawer } = this.props;
    const contentCopy = JSON.parse(JSON.stringify(content));
    if (card.id) {
      const cardNode = findCardNode(card.id, contentCopy);
      if (updateState && cardNode) {
        openNextDrawer(ChartEditionTab, {
          size: 'large',
          className: 'mcs-drawer-chartEdition',
          closingDrawerClassName: 'mcs-drawer-chartEdition-close',
          additionalProps: {
            datamartId: datamartId,
            closeTab: closeNextDrawer,
            saveChart: (newChartConfig: ChartConfig) => {
              this.createChart(newChartConfig, cardNode, contentCopy, newId);
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
      if (sectionNode && moveElement(direction, sectionIndex, contentCopy.sections))
        updateState(contentCopy);
    }
  };

  private deleteSection = (sectionId: string, contentCopy: DashboardContentSchema) => {
    const { updateState } = this.props;

    if (updateState) {
      const sectionIndex = contentCopy.sections.findIndex(s => s.id === sectionId);
      contentCopy.sections.splice(sectionIndex, 1);
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

  renderCard(card: DashboardContentCard, cardIndex: string) {
    const {
      editable,
      schema,
      datamartId,
      scope,
      organisationId,
      queryExecutionSource,
      queryExecutionSubSource,
      formattedQueryFragment,
      updateState,
      setChartsFormattedData,
    } = this.props;

    const charts = card.charts.map((chart, chartIndex) => {
      return (
        <DashboardChartLayout
          key={chartIndex + 10000}
          datamartId={datamartId}
          scope={scope}
          organisationId={organisationId}
          editable={editable}
          schema={schema}
          queryExecutionSource={queryExecutionSource}
          queryExecutionSubSource={queryExecutionSubSource}
          formattedQueryFragment={formattedQueryFragment}
          chart={chart}
          chartIndex={chartIndex}
          card={card}
          updateChart={this.updateChart}
          updateState={updateState}
          setChartsFormattedData={setChartsFormattedData}
          cssProperties={computeCSSProperties(
            card.charts,
            chart.type,
            card.h,
            editable,
            card.layout,
          )}
        />
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

  render() {
    const { schema } = this.props;

    return schema.sections.map((section, i) => this.renderSection(section, i));
  }
}

export default compose<Props, DashboardBodyProps>(
  injectFeatures,
  injectIntl,
  injectDrawer,
)(DashboardBody);

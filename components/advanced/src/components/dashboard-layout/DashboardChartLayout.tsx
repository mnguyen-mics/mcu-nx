import React, { CSSProperties } from 'react';
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl';
import {
  DashboardContentCard,
  DashboardContentSchema,
} from '../../models/customDashboards/customDashboards';
import { AbstractScope } from '../../models/datamart/graphdb/Scope';
import {
  QueryExecutionSource,
  QueryExecutionSubSource,
} from '../../models/platformMetrics/QueryExecutionSource';
import { ChartConfig } from '../../services/ChartDatasetService';
import { QueryFragment } from '../../utils/source/DataSourceHelper';
import injectDrawer, { InjectedDrawerProps } from '../drawer/injectDrawer';
import Chart from '../chart-engine';
import { findCardNode, findChartNode, moveChartNode } from './DashboardFunctions';
import ChartEditionTab from './wysiwig/ChartEditionTab';
import {
  AggregateDataset,
  CountDataset,
  JsonDataset,
} from '../../models/dashboards/dataset/dataset_tree';
import { VerticalDirection } from './wysiwig/SectionTitleEditionPanel';
import { Modal } from 'antd';
import { compose } from 'recompose';

export interface DashboardChartLayoutProps {
  datamartId: string;
  scope?: AbstractScope;
  organisationId: string;
  editable: boolean;
  schema: DashboardContentSchema;
  queryExecutionSource: QueryExecutionSource;
  queryExecutionSubSource: QueryExecutionSubSource;
  chart: ChartConfig;
  chartIndex: number;
  card: DashboardContentCard;
  cssProperties?: CSSProperties;
  formattedQueryFragment: QueryFragment;
  updateState?: (d: DashboardContentSchema) => void;
  setChartsFormattedData: (
    chartTitle: string,
    data?: AggregateDataset | CountDataset | JsonDataset,
  ) => void;
  updateChart: (
    newChartConfig: ChartConfig,
    chartId: string,
    contentCopy: DashboardContentSchema,
  ) => void;
}

export interface DashboardChartLayoutState {}

type Props = DashboardChartLayoutProps & WrappedComponentProps & InjectedDrawerProps;

const messages = defineMessages({
  dashboardLayoutConfirmation: {
    id: 'dashboard.layout.confirmation',
    defaultMessage: 'Confirmation',
  },
  dashboardLayoutChartDeleteConfirmationText: {
    id: 'dashboard.layout.chartDeleteConfirmationText',
    defaultMessage: 'Are you sure you want to remove this chart?',
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

class DashboardChartLayout extends React.Component<Props, DashboardChartLayoutState> {
  constructor(props: Props) {
    super(props);
  }

  private handleEditChart(chart: ChartConfig, content: DashboardContentSchema) {
    const { datamartId, updateState, openNextDrawer, closeNextDrawer, intl, updateChart } =
      this.props;
    const contentCopy: DashboardContentSchema = JSON.parse(JSON.stringify(content));
    if (chart.id) {
      const chartNode = findChartNode(chart.id, contentCopy);
      if (updateState && chartNode?.id !== undefined) {
        const chartId = chartNode.id;
        openNextDrawer(ChartEditionTab, {
          size: 'large',
          className: 'mcs-drawer-chartEdition',
          closingDrawerClassName: 'mcs-drawer-chartEdition-close',
          additionalProps: {
            datamartId: datamartId,
            closeTab: closeNextDrawer,
            chartConfig: chartNode,
            saveChart: (savingChartConfig: ChartConfig) => {
              updateChart(savingChartConfig, chartId, contentCopy);
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

  render() {
    const { chart, chartIndex, card, cssProperties } = this.props;
    const {
      datamartId,
      scope,
      organisationId,
      editable,
      schema,
      queryExecutionSource,
      queryExecutionSubSource,
      formattedQueryFragment,
      setChartsFormattedData,
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
        key={chart.id ? chart.id : chartIndex}
        datamartId={datamartId}
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
        setChartsFormattedData={setChartsFormattedData}
      />
    );
  }
}

export default compose<Props, DashboardChartLayoutProps>(
  injectIntl,
  injectDrawer,
)(DashboardChartLayout);

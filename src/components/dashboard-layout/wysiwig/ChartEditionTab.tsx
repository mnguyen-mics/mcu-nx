import { Button, Col, Form, Input, Row, Tabs } from 'antd';
import React from 'react';
import { ChartConfig, isExternalChartConfig } from '../../../services/ChartDatasetService';
import AceEditor from 'react-ace';
import { Ace } from 'ace-builds';
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { AbstractScope } from '../../../models/datamart/graphdb/Scope';
import {
  QueryFragment,
  extractQueriesHelper,
  QueryInfo,
} from '../../../utils/source/DataSourceHelper';
import { IQueryService, QueryService } from '../../../services/QueryService';
import { QueryScopeAdapter } from '../../../utils/QueryScopeAdapter';
import { defaultChartConfigText as defaultChartConfig } from '../../../services/CustomDashboardService';
import { Card, McsIcon } from '@mediarithmics-private/mcs-components-library';
import { DotChartOutlined } from '@ant-design/icons';
import Chart, { ChartsSearchPanel } from '../../chart-engine';
import { RouteComponentProps, withRouter } from 'react-router';
import { ChartResource } from '../../../models/chart/Chart';
import _ from 'lodash';
import cuid from 'cuid';

interface ChartEditionProps {
  chartConfig?: ChartConfig;
  saveChart: (chartToSave: ChartConfig) => void;
  deleteChart?: () => void;
  closeTab: () => void;
  datamartId: string;
  scope?: AbstractScope;
  queryFragment?: QueryFragment;
}

type Props = InjectedIntlProps &
  ChartEditionProps &
  RouteComponentProps<{ organisationId: string }>;

interface ChartEditionState {
  chartConfigPreviewText?: string;
  currentChartConfigText: string;
  selectedChartId?: string;
  resetSelectedChartId: boolean;
  contentErrorMessage?: string;
  queryInfos: QueryInfo[];
  activeTab: 'JSON' | 'charts';
}

const messages = defineMessages({
  chartEditionEditChart: {
    id: 'chart.edition.chart.edit',
    defaultMessage: 'Edit chart',
  },
  chartEditionSave: {
    id: 'chart.edition.save',
    defaultMessage: 'Save',
  },
  chartEditionDelete: {
    id: 'chart.edition.delete',
    defaultMessage: 'Remove chart from dashbaord',
  },
});

class ChartEditionTab extends React.Component<Props, ChartEditionState> {
  constructor(props: Props) {
    super(props);
    const chartConfigText = this.convertChartConfigToText(
      props.chartConfig ? props.chartConfig : defaultChartConfig,
    );
    this.state = {
      currentChartConfigText: chartConfigText,
      selectedChartId:
        props.chartConfig && isExternalChartConfig(props.chartConfig)
          ? props.chartConfig.chart_id
          : undefined,
      queryInfos: [],
      activeTab: 'charts',
      resetSelectedChartId: false,
    };
    setTimeout(() => {
      this.setState({ chartConfigPreviewText: chartConfigText });
    }, 500);
  }

  componentDidMount() {
    this.fetchQueries();
  }

  private removeChartId = (chartConfig: ChartConfig): ChartConfig => {
    return {
      ...chartConfig,
      chart_id: undefined,
      id: undefined,
    };
  };

  private convertChartConfigToText = (chartConfig: ChartConfig) => {
    return JSON.stringify(this.removeChartId(chartConfig), null, 2);
  };

  private parseChartConfigText = (chartConfigText: string): ChartConfig | undefined => {
    try {
      return JSON.parse(chartConfigText);
    } catch (e) {
      return undefined;
    }
  };

  private saveChartConfig = () => {
    const { currentChartConfigText, contentErrorMessage, selectedChartId, resetSelectedChartId } =
      this.state;
    const { saveChart } = this.props;

    const savingChartConfig = this.parseChartConfigText(currentChartConfigText);

    if (selectedChartId === undefined || resetSelectedChartId) {
      if (!contentErrorMessage) {
        if (savingChartConfig !== undefined)
          saveChart({
            ...savingChartConfig,
            chart_id: undefined,
          });
      }
    } else {
      if (savingChartConfig) {
        saveChart({
          ...savingChartConfig,
          chart_id: selectedChartId,
        });
      }
    }
  };

  private queryService: IQueryService = new QueryService();
  private scopeAdapter: QueryScopeAdapter = new QueryScopeAdapter(this.queryService);

  extractOtqlQueriesFromDataset(chartConfigText: string): Promise<QueryInfo[]> {
    const { datamartId, scope, queryFragment } = this.props;

    const chartConfig = this.parseChartConfigText(chartConfigText);

    if (chartConfig) {
      return extractQueriesHelper(
        chartConfig.dataset,
        datamartId,
        this.queryService,
        this.scopeAdapter,
        scope,
        queryFragment,
      );
    } else return Promise.resolve([]);
  }

  onContentValidateInAceEditor = (annotations: Ace.Annotation[]) => {
    const { contentErrorMessage } = this.state;

    const message =
      annotations.length > 0
        ? annotations
            .map(
              annotation =>
                `${annotation.type} (${annotation.row}:${annotation.column}): ${annotation.text}`,
            )
            .reduce((previousValue, currentValue, currentIndex) => {
              if (currentIndex === 0) return `${currentValue}`;
              else return `${previousValue}\n${currentValue}`;
            })
        : undefined;

    if (contentErrorMessage !== message)
      this.setState({
        contentErrorMessage: message,
      });

    if (!message) this.fetchQueries();
  };

  fetchQueries() {
    const { currentChartConfigText } = this.state;
    this.extractOtqlQueriesFromDataset(currentChartConfigText).then(otqlQueries => {
      this.setState({
        queryInfos: otqlQueries,
      });
    });
  }

  renderQueriesList() {
    const { queryInfos } = this.state;

    if (queryInfos.length > 0)
      return (
        <div className='mcs-chartQueries'>
          <div className='mcs-chartMetaDataInfo_section_title'>Queries</div>
          <div className='mcs-chartMetaDataInfo_query_list'>
            {queryInfos.map(q => {
              return (
                <div className='mcs-chartMetaDataInfo_query_item' key={q.queryText}>
                  <label className='mcs-chartMetaDataInfo_query_item_label'>
                    Query {q.queryId}: OTQL
                  </label>
                  <Input
                    className='mcs-chartMetaDataInfo_query_item_input'
                    readOnly={true}
                    name={q.queryText}
                    key={q.queryText}
                    value={q.queryText}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    else return undefined;
  }

  onChangeJson = (value: string) => {
    const { currentChartConfigText } = this.state;
    const valueObject = this.parseChartConfigText(value);
    const chartConfigObject = this.parseChartConfigText(currentChartConfigText);
    if (valueObject && !_.isEqual(valueObject, chartConfigObject)) {
      this.setState({ currentChartConfigText: value, resetSelectedChartId: true });
      setTimeout(() => {
        const currentChartConfigChangeObject = this.parseChartConfigText(
          this.state.currentChartConfigText,
        );
        if (_.isEqual(valueObject, currentChartConfigChangeObject))
          this.setState({
            chartConfigPreviewText: value,
            selectedChartId: cuid(),
          });
      }, 1000);
    }
  };

  onChangeChart = (item: ChartResource) => {
    this.setState({
      currentChartConfigText: this.convertChartConfigToText(item.content),
      chartConfigPreviewText: this.convertChartConfigToText(item.content),
      selectedChartId: item.id,
      resetSelectedChartId: false,
    });
  };

  onTabClick = (activeKey: string, e: React.KeyboardEvent | React.MouseEvent) => {
    switch (activeKey) {
      case 'JSON':
        this.setState({
          activeTab: activeKey,
        });
        break;
      case 'charts':
        this.setState({
          activeTab: activeKey,
        });
        break;
    }
  };

  renderJsonEdition() {
    const { currentChartConfigText, contentErrorMessage, activeTab } = this.state;
    const contentErrorStatus = contentErrorMessage ? 'error' : 'success';

    if (activeTab === 'JSON')
      return (
        <div>
          <Form.Item
            className='mcs-chartEdition_aceEditor'
            validateStatus={contentErrorStatus}
            help={contentErrorMessage}
          >
            <AceEditor
              mode='json'
              theme='github'
              fontSize={12}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={false}
              width='100%'
              minLines={20}
              maxLines={1000}
              height='auto'
              setOptions={{
                highlightGutterLine: false,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                showLineNumbers: true,
              }}
              onValidate={this.onContentValidateInAceEditor}
              value={currentChartConfigText}
              onChange={this.onChangeJson}
            />
          </Form.Item>
          {this.renderQueriesList()}
        </div>
      );
    else return <div />;
  }

  renderSelectedChartPreview = () => {
    const { chartConfigPreviewText, selectedChartId } = this.state;
    const {
      datamartId,
      match: {
        params: { organisationId },
      },
    } = this.props;

    const onClick = (e: any) => e.stopPropagation();

    return chartConfigPreviewText ? (
      <React.Fragment>
        <div style={{ flex: '1' }} />
        <div onClick={onClick}>
          <Card className='mcs-chartEdition-preview-card'>
            <Chart
              chartContainerStyle={{ height: '400px', width: '560px' }}
              key={selectedChartId}
              datamartId={datamartId}
              organisationId={organisationId}
              chartConfig={this.parseChartConfigText(chartConfigPreviewText)!}
              queryExecutionSource={'DASHBOARD'}
              queryExecutionSubSource={'HOME_DASHBOARD'}
              hideOpenDrawer={true}
            />
          </Card>
        </div>
        <div style={{ flex: '1' }} />
      </React.Fragment>
    ) : (
      <div />
    );
  };

  render() {
    const {
      closeTab,
      intl,
      deleteChart,
      match: {
        params: { organisationId },
      },
    } = this.props;

    const { selectedChartId, activeTab } = this.state;

    const chartPreview = this.renderSelectedChartPreview();

    return (
      <Row style={{ height: '100%' }}>
        <Col span={13} onClick={closeTab} className='mcs-chartEdition-preview-container'>
          {chartPreview}
        </Col>
        <Col span={11}>
          <div className='mcs-chartEdition_container'>
            <Row>
              <span className='mcs-chartEdition_title'>
                {intl.formatMessage(messages.chartEditionEditChart)}
              </span>
              <McsIcon
                type='close'
                className='close-icon'
                style={{ cursor: 'pointer' }}
                onClick={closeTab}
              />
            </Row>
            <Row style={{ height: '100%' }}>
              <Tabs
                defaultActiveKey={activeTab}
                style={{ width: '100%', height: '100%' }}
                onTabClick={this.onTabClick}
              >
                <Tabs.TabPane
                  className='mcs-chartEdition_scrollArea'
                  tab={
                    <div className='mcs-chartEdition-sub-header'>
                      <DotChartOutlined className='mcs-chartEdition_chartsTab_icon' />
                      <span className='mcs-chartEdition-tab-title'>{'Saved charts'}</span>
                    </div>
                  }
                  key={'charts'}
                >
                  <ChartsSearchPanel
                    chartItem={selectedChartId}
                    organisationId={organisationId}
                    onItemClick={this.onChangeChart}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane
                  className='mcs-chartEdition_scrollArea'
                  tab={
                    <div className='mcs-chartEdition-sub-header'>
                      <span className='mcs-chartEdition_jsonTab_icon'>{'>_'}</span>
                      <span className='mcs-chartEdition-tab-title'>{'JSON'}</span>
                    </div>
                  }
                  key={'JSON'}
                >
                  {this.renderJsonEdition()}
                </Tabs.TabPane>
              </Tabs>
            </Row>
          </div>
          <div className='mcs-chartEdition-submit-button-container'>
            <Button
              className='mcs-primary mcs-chartEdition-submit-button mcs-cardEdition-button'
              type='primary'
              onClick={this.saveChartConfig}
            >
              {intl.formatMessage(messages.chartEditionSave)}
            </Button>
            <Button
              className='mcs-primary mcs-cardEdition-delete-button'
              type='link'
              onClick={deleteChart}
            >
              {intl.formatMessage(messages.chartEditionDelete)}
            </Button>
          </div>
        </Col>
      </Row>
    );
  }
}

const editionTab = compose<Props, ChartEditionProps>(injectIntl, withRouter)(ChartEditionTab);
export default editionTab;

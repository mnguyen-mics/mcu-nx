import { Button, Form, Input, Row, Tabs } from 'antd';
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
import { McsIcon } from '@mediarithmics-private/mcs-components-library';
import { DotChartOutlined } from '@ant-design/icons';
import { ChartsSearchPanel } from '../../chart-engine';
import { RouteComponentProps, withRouter } from 'react-router';
import { InjectedFeaturesProps, injectFeatures } from '../../Features';
import { ChartResource } from '../../../models/chart/Chart';

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
  RouteComponentProps<{ organisationId: string }> &
  InjectedFeaturesProps;

interface ChartEditionState {
  chartConfigText: string;
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
    this.state = {
      chartConfigText: this.convertChartConfigToText(
        props.chartConfig ? props.chartConfig : defaultChartConfig,
      ),
      selectedChartId:
        props.chartConfig && isExternalChartConfig(props.chartConfig)
          ? props.chartConfig.chart_id
          : undefined,
      queryInfos: [],
      activeTab: props.chartConfig?.chart_id !== undefined ? 'charts' : 'JSON',
      resetSelectedChartId: false,
    };
  }

  private removeChartId = (chartConfig: ChartConfig): ChartConfig => {
    return {
      ...chartConfig,
      chart_id: undefined,
    };
  };

  private convertChartConfigToText = (chartConfig: ChartConfig) => {
    return JSON.stringify(this.removeChartId(chartConfig), null, 2);
  };

  componentDidMount() {
    this.fetchQueries();
  }

  private parseChartConfigText = (chartConfigText: string): ChartConfig | undefined => {
    try {
      return JSON.parse(chartConfigText);
    } catch (e) {
      return undefined;
    }
  };

  private saveChartConfig = () => {
    const { chartConfigText, contentErrorMessage, selectedChartId, resetSelectedChartId } =
      this.state;
    const { saveChart } = this.props;

    const savingChartConfig = this.parseChartConfigText(chartConfigText);

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
    const { chartConfigText } = this.state;
    this.extractOtqlQueriesFromDataset(chartConfigText).then(otqlQueries => {
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
    const { chartConfigText } = this.state;
    if (chartConfigText !== value) {
      this.setState({
        chartConfigText: value,
        resetSelectedChartId: true,
      });
    }
  };

  onChangeChart = (item: ChartResource) => {
    this.setState({
      chartConfigText: this.convertChartConfigToText(item.content),
      selectedChartId: item.id,
    });
  };

  onTabClick = (activeKey: string, e: React.KeyboardEvent | React.MouseEvent) => {
    const { resetSelectedChartId, selectedChartId } = this.state;
    switch (activeKey) {
      case 'JSON':
        this.setState({
          activeTab: activeKey,
        });
        break;
      case 'charts':
        this.setState({
          activeTab: activeKey,
          selectedChartId: resetSelectedChartId ? undefined : selectedChartId,
          resetSelectedChartId: false,
        });
        break;
    }
  };

  renderJsonEdition() {
    const { chartConfigText, contentErrorMessage, activeTab } = this.state;
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
              value={chartConfigText}
              onChange={this.onChangeJson}
            />
          </Form.Item>
          {this.renderQueriesList()}
        </div>
      );
    else return <div />;
  }

  render() {
    const {
      closeTab,
      intl,
      deleteChart,
      match: {
        params: { organisationId },
      },
      hasFeature,
      chartConfig,
    } = this.props;

    const { selectedChartId } = this.state;

    return (
      <React.Fragment>
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
            {
              // Remove feature flag when charts selection work
              hasFeature('dashboard-new-edition-drawer') ? (
                <Tabs
                  defaultActiveKey={
                    chartConfig !== undefined && chartConfig.chart_id === undefined
                      ? 'JSON'
                      : 'charts'
                  }
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
              ) : (
                <React.Fragment>
                  <div className='mcs-chartEdition-sub-header'>
                    <span className='mcs-chartEdition_jsonTab_icon'>{'>_'}</span>
                    <span className='mcs-chartEdition-tab-title'>{'JSON'}</span>
                  </div>
                  <div
                    className='mcs-chartEdition_scrollArea'
                    style={{ height: '100%', width: '100%' }}
                  >
                    {this.renderJsonEdition()}
                  </div>
                </React.Fragment>
              )
            }
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
      </React.Fragment>
    );
  }
}

const editionTab = compose<Props, ChartEditionProps>(
  injectIntl,
  withRouter,
  injectFeatures,
)(ChartEditionTab);
export default editionTab;

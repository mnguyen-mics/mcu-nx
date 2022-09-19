import { Button, Form, Input, Row, Tabs } from 'antd';
import React from 'react';
import { ChartCommonConfig } from '../../../services/ChartDatasetService';
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
import { defaultChartConfigText } from '../../../services/CustomDashboardService';
import { McsIcon } from '@mediarithmics-private/mcs-components-library';
import { DotChartOutlined } from '@ant-design/icons';
import { ChartsSearchPanel } from '../../chart-engine';
import { RouteComponentProps, withRouter } from 'react-router';
import { InjectedFeaturesProps, injectFeatures } from '../../Features';

interface ChartEditionProps {
  chartConfig?: ChartCommonConfig;
  saveChart: (c: ChartCommonConfig) => void;
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
  contentErrorMessage?: string;
  queryInfos: QueryInfo[];
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
    const chartConfigText = JSON.stringify(
      props.chartConfig ? props.chartConfig : defaultChartConfigText,
      null,
      2,
    );

    this.state = {
      chartConfigText: chartConfigText,
      queryInfos: [],
    };
  }

  componentDidMount() {
    this.fetchQueries();
  }

  private saveChartConfig() {
    const { chartConfigText, contentErrorMessage } = this.state;
    const { saveChart } = this.props;
    if (!contentErrorMessage) {
      try {
        const chartConfig = JSON.parse(chartConfigText);
        saveChart(chartConfig);
      } catch (e) {
        return;
      }
    }
  }

  private queryService: IQueryService = new QueryService();
  private scopeAdapter: QueryScopeAdapter = new QueryScopeAdapter(this.queryService);

  extractOtqlQueriesFromDataset(chartConfigText: string): Promise<QueryInfo[]> {
    const { datamartId, scope, queryFragment } = this.props;

    const chartConfig = JSON.parse(chartConfigText);

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

  async onContentValidateInAceEditor(annotations: Ace.Annotation[]) {
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
  }

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

  onChangeJson(value: string) {
    this.setState({
      chartConfigText: value,
    });
  }

  renderJsonEdition() {
    const { chartConfigText, contentErrorMessage } = this.state;
    const contentErrorStatus = contentErrorMessage ? 'error' : 'success';

    const onChangeJson = this.onChangeJson.bind(this);
    const onContentValidateInAceEditor = this.onContentValidateInAceEditor.bind(this);

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
            onValidate={onContentValidateInAceEditor}
            value={chartConfigText}
            onChange={onChangeJson}
          />
        </Form.Item>
        {this.renderQueriesList()}
      </div>
    );
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
    } = this.props;

    const saveChartConfig = this.saveChartConfig.bind(this);

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
                <Tabs style={{ width: '100%', height: '100%' }}>
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
                    <ChartsSearchPanel organisationId={organisationId} />
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
            onClick={saveChartConfig}
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

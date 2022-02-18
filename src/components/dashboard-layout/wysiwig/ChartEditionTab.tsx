import { Button, Form, Input } from 'antd';
import React from 'react';
import { ChartConfig } from '../../../services/ChartDatasetService';
import AceEditor from 'react-ace';
import { Ace } from 'ace-builds';
import { CloseOutlined } from '@ant-design/icons';
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

interface ChartEditionProps {
  chartConfig?: ChartConfig;
  saveChart: (c: ChartConfig) => void;
  closeTab: () => void;
  datamartId: string;
  scope?: AbstractScope;
  queryFragment?: QueryFragment;
}

type Props = InjectedIntlProps & ChartEditionProps;

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
});

const defaultChartConfigText = {
  title: 'Number of active user points',
  type: 'Metric',
  dataset: {
    type: 'activities_analytics',
    query_json: {
      dimensions: [],
      metrics: [
        {
          expression: 'users',
        },
      ],
    },
  },
};

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

  render() {
    const { closeTab, intl } = this.props;
    const { chartConfigText, contentErrorMessage } = this.state;
    const contentErrorStatus = contentErrorMessage ? 'error' : 'success';

    const saveChartConfig = this.saveChartConfig.bind(this);
    const onChangeJson = this.onChangeJson.bind(this);
    const onContentValidateInAceEditor = this.onContentValidateInAceEditor.bind(this);

    return (
      <div className='mcs-chartEdition-content'>
        <div className='mcs-chartEdition-header'>
          <span className='mcs-chartEdition-header-title'>
            {intl.formatMessage(messages.chartEditionEditChart)}
          </span>
          <CloseOutlined className='mcs-chartEdition-header-close' onClick={closeTab} />
        </div>

        <div className='mcs-chartEdition-scrollarea'>
          <div className='mcs-chartEdition-sub-header'>
            <span className='mcs-chartEdition-shellIcon'>{'>_'}</span>
            <span className='mcs-chartEdition-json-title'>{'JSON'}</span>
          </div>
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
        <div className='mcs-chartEdition-submit-button-container'>
          <Button
            className='mcs-primary mcs-chartEdition-submit-button mcs-cardEdition-button'
            type='primary'
            onClick={saveChartConfig}
          >
            {intl.formatMessage(messages.chartEditionSave)}
          </Button>
        </div>
      </div>
    );
  }
}

const editionTab = compose<Props, ChartEditionProps>(injectIntl)(ChartEditionTab);
export default editionTab;

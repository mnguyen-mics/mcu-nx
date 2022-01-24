import { Button, Form } from 'antd';
import React from 'react';
import { ChartConfig } from '../../../services/ChartDatasetService';
import AceEditor from 'react-ace';
import { Ace } from 'ace-builds';
import { CloseOutlined } from '@ant-design/icons';
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';

interface ChartEditionProps {
  chartConfig: ChartConfig;
  saveChart: (c: ChartConfig) => void;
  closeTab: () => void;
}

type Props = InjectedIntlProps & ChartEditionProps;

interface ChartEditionState {
  chartConfigText: string;
  contentErrorMessage?: string;
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

class ChartEditionTab extends React.Component<Props, ChartEditionState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      chartConfigText: JSON.stringify(props.chartConfig, null, 2),
    };
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

  onContentValidateInAceEditor = (annotations: Ace.Annotation[]) => {
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

    this.setState({
      contentErrorMessage: message,
    });
  };

  render() {
    const { closeTab, intl } = this.props;
    const { chartConfigText, contentErrorMessage } = this.state;
    const contentErrorStatus = contentErrorMessage ? 'error' : 'success';

    const onChangeJson = (value: string) => {
      this.setState({
        chartConfigText: value,
      });
    };

    const saveChartConfig = this.saveChartConfig.bind(this);

    return (
      <div>
        <div className={'mcs-chartEdition-header'}>
          <span className={'mcs-chartEdition-header-title'}>
            {intl.formatMessage(messages.chartEditionEditChart)}
          </span>
          <CloseOutlined className={'mcs-chartEdition-header-close'} onClick={closeTab} />
        </div>
        <div className={'mcs-chartEdition-sub-header'}>
          <span className={'mcs-chartEdition-shellIcon'}>{'>_'}</span>
          <span className={'mcs-chartEdition-json-title'}>{'JSON'}</span>
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
            onValidate={this.onContentValidateInAceEditor}
            value={chartConfigText}
            onChange={onChangeJson}
          />
        </Form.Item>
        <div className={'mcs-chartEdition-submit-button-container'}>
          <Button
            className={'mcs-primary mcs-chartEdition-submit-button'}
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

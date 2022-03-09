import { Button, Form, Input } from 'antd';
import AceEditor from 'react-ace';
import { Content } from 'antd/lib/layout/layout';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import messages from '../messages';
import { PluginLayoutFileFormData } from './PluginLayoutsContainer';

export interface PluginLayoutFormProps {
  onSave: (formData: PluginLayoutFileFormData) => void;
  formData: PluginLayoutFileFormData;
  isEditing?: boolean;
}

type Props = PluginLayoutFormProps & InjectedIntlProps;

interface State {
  inputValue?: string;
  jsonValue?: string;
}

class PluginLayoutForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      inputValue: props.formData.locale || '',
      jsonValue: props.formData.file || '',
    };
  }

  handleSubmit = () => {
    const { onSave } = this.props;
    const { inputValue, jsonValue } = this.state;
    return onSave({
      locale: inputValue,
      file: jsonValue,
    });
  };

  onInputChange = (e: any) => {
    this.setState({
      inputValue: e.target.value,
    });
  };

  onJsonChange = (v: string, e: any) => {
    this.setState({
      jsonValue: v,
    });
  };

  render() {
    const {
      intl: { formatMessage },
      isEditing,
    } = this.props;

    const { inputValue, jsonValue } = this.state;

    return (
      <Form layout='vertical' className='mcs-pluginEdit-drawer-form'>
        <Content className='mcs-content-container mcs-pluginEdit-drawer-container'>
          <Form.Item
            label={
              <div className='mcs-pluginEdit-drawer-form-label'>
                {formatMessage(messages.locale)}
              </div>
            }
            className='mcs-pluginEdit-drawer-form-item'
          >
            <Input
              className='mcs-pluginEdit-drawer-form-input mcs-pluginEdit-drawer-form-input-technicalName'
              placeholder='your-technical-name'
              value={inputValue}
              onChange={this.onInputChange}
              disabled={isEditing}
            />
          </Form.Item>
          <AceEditor
            value={jsonValue}
            theme='github'
            name={'Content'}
            width={'100%'}
            showPrintMargin={false}
            onChange={this.onJsonChange}
          />
          <Button
            onClick={this.handleSubmit}
            className='mcs-primary mcs-pluginEdit-drawer-saveButton'
            type='primary'
          >
            {formatMessage(messages.saveLayout)}
          </Button>
        </Content>
      </Form>
    );
  }
}

export default compose<Props, PluginLayoutFormProps>(injectIntl)(PluginLayoutForm);

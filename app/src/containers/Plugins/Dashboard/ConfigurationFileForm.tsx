import { Button, Form, Input } from 'antd';
import AceEditor from 'react-ace';
import { Content } from 'antd/lib/layout/layout';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import messages from '../messages';
import { ConfigurationFileFormData } from './ConfigurationFilesContainer';

export interface ConfigurationFileFormProps {
  onSave: (formData: ConfigurationFileFormData) => void;
  formData: ConfigurationFileFormData;
  isEditing?: boolean;
}

type Props = ConfigurationFileFormProps & InjectedIntlProps;

interface State {
  inputValue?: string;
  jsonValue?: string;
}

class ConfigurationFileForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      inputValue: props.formData.technical_name || '',
      jsonValue: props.formData.file || '',
    };
  }

  handleSubmit = () => {
    const { onSave } = this.props;
    const { inputValue, jsonValue } = this.state;
    return onSave({
      technical_name: inputValue,
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
                {formatMessage(messages.technicalName)}
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
          <Form.Item
            label={
              <div className='mcs-pluginEdit-drawer-form-label'>
                {formatMessage(messages.content)}
              </div>
            }
            className='mcs-pluginEdit-drawer-form-item'
          >
            <AceEditor
              className='mcs-pluginEdit-drawer-form-input mcs-pluginEdit-drawer-form-aceEditor'
              value={jsonValue}
              theme='github'
              name={'Content'}
              width={'100%'}
              showPrintMargin={false}
              onChange={this.onJsonChange}
            />
          </Form.Item>

          <Button
            onClick={this.handleSubmit}
            className='mcs-primary mcs-pluginEdit-drawer-saveButton'
            type='primary'
          >
            {formatMessage(messages.save)}
          </Button>
        </Content>
      </Form>
    );
  }
}

export default compose<Props, ConfigurationFileFormProps>(injectIntl)(ConfigurationFileForm);

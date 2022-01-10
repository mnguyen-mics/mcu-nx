import { InfoCircleOutlined } from '@ant-design/icons';
import { IntegrationBatchResource } from '@mediarithmics-private/advanced-components';
import { Button, Form, Input, Divider } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import Cron, { CronError } from 'react-js-cron';
import { compose } from 'recompose';
import messages from '../messages';

interface IntegrationBatchInstanceExecutionEditPageProps {
  onClose: () => void;
  integrationBatchInstance?: IntegrationBatchResource;
  onSave: (cronValue: string) => void;
}

type Props = IntegrationBatchInstanceExecutionEditPageProps & InjectedIntlProps;

const IntegrationBatchInstanceExecutionEditPage = (props: Props) => {
  const inputRef = React.useRef<Input>(null);
  const defaultValue =
    props.integrationBatchInstance && props.integrationBatchInstance.cron
      ? props.integrationBatchInstance.cron
      : '30 5 * * 1,6';
  const [value, setValue] = React.useState(defaultValue);
  const customSetValue = React.useCallback(
    (newValue: string) => {
      setValue(newValue);
      inputRef.current?.setValue(newValue);
    },
    [inputRef],
  );
  const [error, onError] = React.useState<CronError>();

  const save = () => {
    props.onSave(value);
  };

  const onBlur = (event: any) => {
    setValue(event.target.value);
  };

  const onPressEnter = () => {
    setValue(inputRef.current?.input.value || '');
  };
  return (
    <Form layout='vertical' className='mcs-pluginEdit-drawer-form'>
      <Content className='mcs-content-container mcs-pluginEdit-drawer-container'>
        <Input ref={inputRef} onBlur={onBlur} onPressEnter={onPressEnter} />

        <Divider>{props.intl.formatMessage(messages.or)}</Divider>

        <Cron value={value} setValue={customSetValue} onError={onError} />

        <div>
          <InfoCircleOutlined style={{ marginRight: 5 }} />
          <span style={{ fontSize: 12 }}>
            {props.intl.formatMessage(messages.periodicityTooltip)}
          </span>
        </div>
        {error ? <p style={{ marginTop: 20 }}>Error: {error.description}</p> : ''}

        <Button
          className='mcs-primary mcs-pluginEdit-drawer-saveButton'
          type='primary'
          onClick={save}
        >
          {props.intl.formatMessage(messages.save)}
        </Button>
      </Content>
    </Form>
  );
};

export default compose<Props, IntegrationBatchInstanceExecutionEditPageProps>(injectIntl)(
  IntegrationBatchInstanceExecutionEditPage,
);

import * as React from 'react';
import { Input, Select, Button, Modal } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';
import { injectIntl, FormattedMessage, InjectedIntlProps } from 'react-intl';
import { compose } from 'recompose';
import { Actionbar } from '../../Actionbar';
import McsIcon from '../../../components/McsIcon';
import messages from './messages';

const InputGroup = Input.Group;
const Option = Select.Option;

type Props = InjectedIntlProps &
  RouteComponentProps<{ organisationId: string }>;

interface State {
  modalVisible: boolean;
  form: {
    type?: string;
    value: string | null;
  };
}

class MonitoringActionbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalVisible: false,
      form: {
        type: 'user_point_id',
        value: null,
      },
    };
  }

  setModalVisible = (modalVisible: boolean) => {
    this.setState({ modalVisible });
  };

  submitModal = (e: any) => {
    const {
      history,
      match: {
        params: { organisationId },
      },
      location
    } = this.props;
    const datamartId = queryString.parse(location.search).datamartId
      ? queryString.parse(location.search).datamartId
      : '';
    history.push(
      `/v2/o/${organisationId}/audience/timeline/${this.state.form.type}/${
        this.state.form.value
      }?datamartId=${datamartId}`,
    );
    this.setState(prevState => {
      const nextState = {
        ...prevState,
        modalVisible: false,
        form: {
          type: 'user_point_id',
          value: null,
        },
      };
      return nextState;
    });
  };

  updateValue = (e: any) => {
    this.setState(prevState => {
      const nextState = {
        ...prevState,
      };
      nextState.form.value = e.target.value;
      return nextState;
    });
  };

  updateType = (type: string) => {
    this.setState(prevState => {
      const nextState = {
        ...prevState,
      };
      nextState.form.type = type;
      return nextState;
    });
  };

  render() {
    const {
      match: {
        params: { organisationId },
      },
      intl: { formatMessage },
    } = this.props;

    const breadcrumbPaths = [
      {
        name: formatMessage(messages.monitoring),
        url: `/v2/o/${organisationId}/audience/timeline`,
      },
    ];

    const onReturnClick = () => this.setModalVisible(false);
    const onUserLookupClick = () => this.setModalVisible(true);
    const onSubmitClick = (e: any) => this.submitModal(e);
    const onValueChange = (e: any) => {
      e.persist();
      this.updateValue(e);
    };

    return (
      <Actionbar path={breadcrumbPaths}>
        <Modal
          title="Enter the user identifier you want to lookup"
          wrapClassName="vertical-center-modal"
          visible={this.state.modalVisible}
          footer={[
            <Button key="back" size="large" onClick={onReturnClick}>
              Return
            </Button>,
            <Button
              disabled={
                this.state.form.value === null || this.state.form.type === null
              }
              key="submit"
              type="primary"
              size="large"
              onClick={onSubmitClick}
            >
              Submit
            </Button>,
          ]}
          onCancel={onReturnClick}
        >
          <InputGroup compact={true}>
            <Select
              style={{ width: '30%' }}
              defaultValue={this.state.form.type}
              onChange={this.updateType}
            >
              <Option value="user_point_id">User Point Id</Option>
              <Option value="user_account_id">User Account Id</Option>
              <Option value="user_agent_id">Vector Id</Option>
              <Option value="email_hash">Email Hash</Option>
            </Select>
            <Input
              name="value"
              placeholder="input your value"
              style={{ width: '70%' }}
              onChange={onValueChange}
            />
          </InputGroup>
        </Modal>
        <Button
          className="mcs-primary"
          type="primary"
          onClick={onUserLookupClick}
        >
          <McsIcon type="refresh" />{' '}
          <FormattedMessage {...messages.lookUpUser} />
        </Button>
      </Actionbar>
    );
  }
}

export default compose<Props, {}>(
  injectIntl,
  withRouter,
)(MonitoringActionbar);

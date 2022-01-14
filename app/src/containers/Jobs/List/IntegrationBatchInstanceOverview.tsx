import * as React from 'react';
import _ from 'lodash';
import moment, { Moment } from 'moment';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import { Content } from 'antd/lib/layout/layout';
import { Actionbar, McsIcon, McsTabs } from '@mediarithmics-private/mcs-components-library';
import {
  CronStatus,
  IntegrationBatchResource,
  lazyInject,
  TYPES,
  IIntegrationBatchService,
} from '@mediarithmics-private/advanced-components';
import IntegrationBatchExecutionsListTab from './IntegrationBatchExecutionsListTab';
import { Button, Drawer, Tag, Modal, DatePicker, message } from 'antd';
import {
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PauseCircleFilled,
  PlayCircleFilled,
} from '@ant-design/icons';
import cronstrue from 'cronstrue';
import DashboardHeader from '../../../components/DashboardHeader/DashboardHeader';
import OrganisationName from '../../../components/Common/OrganisationName';
import messages from '../messages';
import { Link } from 'react-router-dom';
import IntegrationBatchInstanceEditPage from '../Edit/IntegrationBatchInstanceEditPage';
import IntegrationBatchInstanceExecutionEditPage from '../Edit/IntegrationBatchInstanceExecutionEditPage';

interface RouteProps {
  organisationId: string;
  batchInstanceId: string;
}

type Props = InjectedIntlProps & InjectedNotificationProps & RouteComponentProps<RouteProps>;

interface State {
  integrationBatchInstance?: IntegrationBatchResource;
  isLoading: boolean;
  isEditionDrawerVisible?: boolean;
  startDate?: number;
  shouldUpdateExecutions: boolean;
  isExecutionDrawerVisible?: boolean;
}

class IntegrationBatchInstanceOverview extends React.Component<Props, State> {
  @lazyInject(TYPES.IIntegrationBatchService)
  private _integrationBatchService: IIntegrationBatchService;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      shouldUpdateExecutions: false,
    };
  }

  componentDidMount() {
    this.fetchIntegrationBatchInstance();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      history,
      match: {
        params: { organisationId },
      },
    } = this.props;
    const {
      match: {
        params: { organisationId: prevOrganisationId },
      },
    } = prevProps;

    if (prevOrganisationId !== organisationId) {
      history.push(`/o/${organisationId}/jobs/integration_batch_instances`);
    }
  }

  fetchIntegrationBatchInstance = () => {
    const {
      notifyError,
      match: {
        params: { batchInstanceId },
      },
    } = this.props;
    this.setState({
      isLoading: true,
    });

    this._integrationBatchService
      .getIntegrationBatchInstance(batchInstanceId)
      .then(res => {
        this.setState({
          integrationBatchInstance: res.data,
          isLoading: false,
        });
      })
      .catch(err => {
        notifyError(err);
        this.setState({
          isLoading: false,
        });
      });
  };

  getCronStatusIcon(cronStatus: CronStatus) {
    if (cronStatus === ('ACTIVE' as CronStatus)) {
      return <PlayCircleFilled className='mcs-batchInstanceTable_playIcon' />;
    } else {
      return <PauseCircleFilled className='mcs-batchInstanceTable_pauseIcon' />;
    }
  }

  closeEditionDrawer = () => {
    this.setState({
      isEditionDrawerVisible: false,
    });
  };

  openEditionDrawer = () => {
    this.setState({
      isEditionDrawerVisible: true,
    });
  };

  closeExecutionDrawer = () => {
    this.setState({
      isExecutionDrawerVisible: false,
    });
  };

  openExecutionDrawer = () => {
    this.setState({
      isExecutionDrawerVisible: true,
    });
  };

  onExecutionSave = (cronValue: string) => {
    const {
      match: {
        params: { batchInstanceId },
      },
      notifyError,
    } = this.props;
    const { integrationBatchInstance } = this.state;
    if (integrationBatchInstance)
      this._integrationBatchService
        .updateIntegrationBatchInstance(batchInstanceId, {
          ...integrationBatchInstance,
          cron: cronValue,
          cron_status: 'ACTIVE' as CronStatus,
        })
        .then(res => {
          this.setState({
            isExecutionDrawerVisible: false,
            integrationBatchInstance: res.data,
          });
        })
        .catch(e => {
          notifyError(e);
        });
  };

  showModal = () => {
    const {
      intl: { formatMessage },
    } = this.props;
    Modal.confirm({
      title: formatMessage(messages.newExecution),
      icon: <ExclamationCircleOutlined />,
      content: (
        <React.Fragment>
          <div>{formatMessage(messages.modalStartDateContent)}</div>
          <br />
          <DatePicker
            format='YYYY-MM-DD HH:mm:ss'
            disabledDate={this.disabledDate}
            disabledTime={this.disabledTime}
            defaultValue={moment()}
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            style={{ width: '100%' }}
            onOk={this.onDatePickerOk}
            onChange={this.onDatePickerChange}
          />
        </React.Fragment>
      ),
      onOk: this.onModalOk,
    });
  };

  onModalOk = () => {
    const {
      notifyError,
      match: {
        params: { organisationId, batchInstanceId },
      },
      intl: { formatMessage },
    } = this.props;
    const { startDate } = this.state;
    this.setState({
      shouldUpdateExecutions: false,
    });

    this._integrationBatchService
      .createIntegrationBatchInstanceExecution(batchInstanceId, {
        organisation_id: organisationId,
        status: 'PENDING',
        parameters: {
          execution_type: 'MANUAL',
          expected_start_date: startDate ? startDate : moment.now(),
        },
      })
      .then(res => {
        this.setState({
          shouldUpdateExecutions: true,
        });
        this.fetchIntegrationBatchInstance();
        message.success(formatMessage(messages.newExecutionSuccessMessage), 3);
      })
      .catch(err => {
        notifyError(err);
      });
  };

  onDatePickerOk = (date: any) => {
    this.setState({
      startDate: moment(date).valueOf(),
    });
  };

  onDatePickerChange = (date: any, dateString: string) => {
    this.setState({
      startDate: moment(date).valueOf(),
    });
  };

  disabledDate = (current: any) => {
    return current && current < moment().startOf('day');
  };

  disabledTime = (date: any) => ({
    disabledHours: () => this.disabledHours(date),
    disabledMinutes: () => this.disabledMinutes(date),
  });

  disabledHours = (date: Moment | null) => {
    const now = moment();
    const disabledHours: number[] = [];
    if (!date?.isSame(now, 'date')) return disabledHours;
    else {
      for (let i = 0; i < now.hour(); i += 1) {
        disabledHours.push(i);
      }
      return disabledHours;
    }
  };

  disabledMinutes = (date: Moment | null) => {
    const now = moment();
    const disabledMinutes: number[] = [];
    if (!date?.isSame(now, 'date') || !date?.isSame(now, 'hour')) return disabledMinutes;
    else {
      for (let i = 0; i < now.minute(); i += 1) {
        disabledMinutes.push(i);
      }
      return disabledMinutes;
    }
  };

  renderActivePauseButton = () => {
    const { integrationBatchInstance } = this.state;
    const {
      intl: { formatMessage },
      notifyError,
    } = this.props;
    const onClickElement = (status: CronStatus) => () => {
      if (integrationBatchInstance?.id)
        this._integrationBatchService
          .updateIntegrationBatchInstance(integrationBatchInstance?.id, {
            ...integrationBatchInstance,
            cron_status: status,
          })
          .then(res => {
            this.fetchIntegrationBatchInstance();
            message.success(formatMessage(messages.newStatusMessage), 3);
          })
          .catch(err => {
            notifyError(err);
          });
    };

    const activeButton = (
      <Button
        className='mcs-primary mcs-integrationBatchInstance_actionBar_activate'
        type='primary'
        onClick={onClickElement('ACTIVE' as CronStatus)}
      >
        <McsIcon type='play' />
        <FormattedMessage {...messages.activateBatchInstance} />
      </Button>
    );
    const pauseButton = (
      <Button
        className='mcs-primary mcs-integrationBatchInstance_actionBar_pause'
        type='primary'
        onClick={onClickElement('PAUSED')}
      >
        <McsIcon type='pause' />
        <FormattedMessage {...messages.pauseBatchInstance} />
      </Button>
    );

    if (!integrationBatchInstance?.cron_status) return;

    return integrationBatchInstance && integrationBatchInstance.cron_status === 'PAUSED'
      ? activeButton
      : pauseButton;
  };

  render() {
    const {
      match: {
        params: { batchInstanceId, organisationId },
      },
      intl: { formatMessage },
    } = this.props;

    const {
      integrationBatchInstance,
      isLoading,
      isEditionDrawerVisible,
      isExecutionDrawerVisible,
      shouldUpdateExecutions,
    } = this.state;

    const tabs = [
      {
        title: 'Executions',
        display: (
          <IntegrationBatchExecutionsListTab
            shouldUpdateExecutions={shouldUpdateExecutions}
            batchInstanceId={batchInstanceId}
          />
        ),
      },
    ];

    const title = (
      <React.Fragment>
        {integrationBatchInstance?.cron_status && (
          <React.Fragment>
            {this.getCronStatusIcon(integrationBatchInstance.cron_status)}
            <span>&nbsp;</span>
          </React.Fragment>
        )}
        {integrationBatchInstance?.name ? integrationBatchInstance.name : ''}
      </React.Fragment>
    );

    const subtitle = (
      <React.Fragment>
        <Tag>{integrationBatchInstance?.group_id}</Tag>
        <Tag color='blue'>{integrationBatchInstance?.artifact_id}</Tag>
        <Tag color='purple'>{integrationBatchInstance?.version_id}</Tag>
        {formatMessage(messages.for)}
        {` ${integrationBatchInstance?.organisation_id} `}
        <OrganisationName organisationId={integrationBatchInstance?.organisation_id} />
      </React.Fragment>
    );

    const cronElem = integrationBatchInstance?.cron ? (
      <div>
        <ClockCircleOutlined />
        {` Scheduled ${cronstrue.toString(integrationBatchInstance.cron)}`}
      </div>
    ) : undefined;

    const breadcrumbPaths = [
      <Link key='1' to={`/o/${organisationId}/jobs/integration_batch_instances`}>
        {formatMessage(messages.jobs)}
      </Link>,
      <Link key='2' to={`/o/${organisationId}/jobs/integration_batch_instances`}>
        {formatMessage(messages.jobBatchInstances)}
      </Link>,
    ];

    return (
      <div className='ant-layout'>
        <Actionbar pathItems={breadcrumbPaths}>
          <div className='mcs-actionbar_innerElementsPanel'>
            {this.renderActivePauseButton()}
            <Button className='mcs-primary' type='primary' onClick={this.openExecutionDrawer}>
              <McsIcon type='bolt' /> <FormattedMessage {...messages.planExecutions} />
            </Button>
            <Button className='mcs-primary' type='primary' onClick={this.showModal}>
              <McsIcon type='bolt' /> <FormattedMessage {...messages.run} />
            </Button>
            <Button className='mcs-primary' onClick={this.openEditionDrawer}>
              <McsIcon type='pen' /> <FormattedMessage {...messages.edit} />
            </Button>
          </div>
          <Drawer
            className='mcs-integrationBatchInstanceForm_drawer'
            closable={false}
            onClose={this.closeEditionDrawer}
            visible={isEditionDrawerVisible}
            width='1200'
            destroyOnClose={true}
          >
            <IntegrationBatchInstanceEditPage
              onClose={this.closeEditionDrawer}
              integrationBatchInstanceId={batchInstanceId}
            />
          </Drawer>
          <Drawer
            className='mcs-pluginEdit-drawer'
            closable={true}
            bodyStyle={{ padding: '0' }}
            placement={'right'}
            onClose={this.closeExecutionDrawer}
            visible={isExecutionDrawerVisible}
            width='800'
            destroyOnClose={true}
            title={formatMessage(messages.planExecutions)}
          >
            <IntegrationBatchInstanceExecutionEditPage
              onClose={this.closeExecutionDrawer}
              integrationBatchInstance={integrationBatchInstance}
              onSave={this.onExecutionSave}
            />
          </Drawer>
        </Actionbar>
        <div className='ant-layout'>
          <Content className='mcs-content-container'>
            {integrationBatchInstance && (
              <DashboardHeader
                title={title}
                subtitle={subtitle}
                rightElement={cronElem}
                isLoading={isLoading}
              />
            )}
            <McsTabs items={tabs} />
          </Content>
        </div>
      </div>
    );
  }
}

export default compose<Props, {}>(
  withRouter,
  injectIntl,
  injectNotifications,
)(IntegrationBatchInstanceOverview);

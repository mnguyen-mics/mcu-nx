import * as React from 'react';
import _ from 'lodash';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import { Content } from 'antd/lib/layout/layout';
import { Actionbar, McsTabs } from '@mediarithmics-private/mcs-components-library';
import {
  CronStatus,
  IntegrationBatchResource,
  lazyInject,
  TYPES,
  IIntegrationBatchService,
} from '@mediarithmics-private/advanced-components';
import IntegrationBatchExecutionsListTab from './IntegrationBatchExecutionsListTab';
import { Tag } from 'antd';
import { ClockCircleOutlined, PauseCircleFilled, PlayCircleFilled } from '@ant-design/icons';
import cronstrue from 'cronstrue';
import DashboardHeader from '../../../components/DashboardHeader/DashboardHeader';
import OrganisationName from '../../../components/Common/OrganisationName';
import messages from '../messages';
import { Link } from 'react-router-dom';

interface RouteProps {
  organisationId: string;
  batchInstanceId: string;
}

type Props = InjectedIntlProps & InjectedNotificationProps & RouteComponentProps<RouteProps>;

interface State {
  integrationBatchinstance?: IntegrationBatchResource;
  isLoading: boolean;
}

class IntegrationBatchInstanceOverview extends React.Component<Props, State> {
  @lazyInject(TYPES.IIntegrationBatchService)
  private _integrationBatchService: IIntegrationBatchService;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
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
          integrationBatchinstance: res.data,
          isLoading: false,
        });
      })
      .catch(err => {
        notifyError(err);
        this.setState({
          isLoading: false,
        });
      });
  }

  getCronStatusIcon(cronStatus: CronStatus) {
    if (cronStatus === ('ACTIVE' as CronStatus)) {
      return <PlayCircleFilled className='mcs-batchInstanceTable_playIcon' />;
    } else {
      return <PauseCircleFilled className='mcs-batchInstanceTable_pauseIcon' />;
    }
  }

  render() {
    const {
      match: {
        params: { batchInstanceId, organisationId },
      },
      intl: { formatMessage },
    } = this.props;

    const { integrationBatchinstance, isLoading } = this.state;

    const tabs = [
      {
        title: 'Executions',
        display: <IntegrationBatchExecutionsListTab batchInstanceId={batchInstanceId} />,
      },
    ];

    const title = (
      <React.Fragment>
        {integrationBatchinstance?.cron_status && (
          <React.Fragment>
            {this.getCronStatusIcon(integrationBatchinstance.cron_status)}
            <span>&nbsp;</span>
          </React.Fragment>
        )}
        {integrationBatchinstance?.name ? integrationBatchinstance.name : ''}
      </React.Fragment>
    );

    const subtitle = (
      <React.Fragment>
        <Tag>{integrationBatchinstance?.group_id}</Tag>
        <Tag color='blue'>{integrationBatchinstance?.artifact_id}</Tag>
        <Tag color='purple'>{integrationBatchinstance?.version_id}</Tag>
        {formatMessage(messages.for)}
        {` ${integrationBatchinstance?.organisation_id} `}
        <OrganisationName organisationId={integrationBatchinstance?.organisation_id} />
      </React.Fragment>
    );

    const cronElem = integrationBatchinstance?.cron ? (
      <div>
        <ClockCircleOutlined />
        {` Scheduled ${cronstrue.toString(integrationBatchinstance.cron)}`}
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
        <Actionbar pathItems={breadcrumbPaths} />
        <div className='ant-layout'>
          <Content className='mcs-content-container'>
            {integrationBatchinstance && (
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

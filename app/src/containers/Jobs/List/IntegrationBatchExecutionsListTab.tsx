import * as React from 'react';
import _ from 'lodash';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import {
  PlayCircleFilled,
  CloseCircleFilled,
  CheckCircleFilled,
  ClockCircleFilled,
} from '@ant-design/icons';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import messages from '../messages';
import { DataColumnDefinition } from '@mediarithmics-private/mcs-components-library/lib/components/table-view/table-view/TableView';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import { TableViewFilters, Card } from '@mediarithmics-private/mcs-components-library';
import {
  JobExecutionPublicStatus,
  PublicJobExecutionResource,
  lazyInject,
  TYPES,
  IIntegrationBatchService,
} from '@mediarithmics-private/advanced-components';
import McsMoment from '../../../utils/McsMoment';
import moment from 'moment';

interface RouteProps {
  organisationId: string;
}

interface IntegrationBatchExecutionsListTabProps {
  batchInstanceId?: string;
  shouldUpdateExecutions?: boolean;
}

type Props = InjectedIntlProps &
  InjectedNotificationProps &
  RouteComponentProps<RouteProps> &
  IntegrationBatchExecutionsListTabProps;

interface State {
  executions: PublicJobExecutionResource[];
  isLoading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  options: Array<{ value: string }>;
}

class IntegrationBatchExecutionsListTab extends React.Component<Props, State> {
  @lazyInject(TYPES.IIntegrationBatchService)
  private _batchService: IIntegrationBatchService;

  constructor(props: Props) {
    super(props);
    this.state = {
      executions: [],
      isLoading: false,
      total: 0,
      options: [],
      currentPage: 1,
      pageSize: 10,
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    const { currentPage, pageSize } = this.state;
    this.fetchExecutions(currentPage, pageSize);
  }

  fetchExecutions(currentPage: number, pageSize: number) {
    const {
      match: {
        params: { organisationId },
      },
      batchInstanceId,
    } = this.props;
    if (batchInstanceId) {
      this.fetchExecutionsForInstance(batchInstanceId, currentPage, pageSize);
    } else {
      this.fetchExecutionsForOrg(organisationId, currentPage, pageSize);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { shouldUpdateExecutions, batchInstanceId } = this.props;
    if (
      prevProps.shouldUpdateExecutions !== shouldUpdateExecutions &&
      !!shouldUpdateExecutions &&
      !!batchInstanceId
    ) {
      this.fetchExecutionsForInstance(batchInstanceId, 1, 10);
    }
  }

  fetchExecutionsForOrg = (organisationId: string, currentPage: number, pageSize: number) => {
    const { notifyError } = this.props;
    this.setState({
      isLoading: true,
    });
    const firstResult = (currentPage - 1) * pageSize;
    this._batchService
      .getBatchInstanceExecutionsForOrganisation(organisationId, {
        first_result: firstResult,
        max_results: pageSize,
      })
      .then(res => {
        this.setState({
          executions: res.data,
          isLoading: false,
          total: res.total || res.count,
          currentPage: currentPage,
          pageSize: pageSize,
        });
      })
      .catch(err => {
        notifyError(err);
        this.setState({
          isLoading: false,
        });
      });
  };

  fetchExecutionsForInstance = (instanceId: string, currentPage: number, pageSize: number) => {
    const { notifyError } = this.props;
    this.setState({
      isLoading: true,
    });
    const firstResult = (currentPage - 1) * pageSize;
    this._batchService
      .getBatchInstanceExecutions(instanceId, {
        first_result: firstResult,
        max_results: pageSize,
      })
      .then(res => {
        this.setState({
          executions: res.data,
          isLoading: false,
          total: res.total || res.count,
          currentPage: currentPage,
          pageSize: pageSize,
        });
      })
      .catch(err => {
        notifyError(err);
        this.setState({
          isLoading: false,
        });
      });
  };

  renderStatus(status: JobExecutionPublicStatus): JSX.Element | undefined {
    const {
      intl: { formatMessage },
    } = this.props;
    switch (status) {
      case 'PENDING':
        return (
          <span className='mcs-batchExecutionTable_pending_status'>
            <ClockCircleFilled /> <span>{formatMessage(messages.pendingStatus)}</span>
          </span>
        );
      case 'RUNNING':
        return (
          <span className='mcs-batchExecutionTable_running_status'>
            <PlayCircleFilled /> <span>{formatMessage(messages.runningStatus)}</span>
          </span>
        );
      case 'SUCCEEDED':
        return (
          <span className='mcs-batchExecutionTable_succeeded_status'>
            <CheckCircleFilled /> <span>{formatMessage(messages.succeededStatus)}</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className='mcs-batchExecutionTable_failed_status'>
            <CloseCircleFilled /> <span>{formatMessage(messages.failedStatus)}</span>
          </span>
        );
      case 'CANCELED':
        return (
          <span className='mcs-batchExecutionTable_canceled_status'>
            <CloseCircleFilled /> <span>{formatMessage(messages.canceledStatus)}</span>
          </span>
        );
    }
  }

  printDuration(millis: number): string {
    const duration = moment.duration(millis);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    if (hours > 0) {
      return `${hours}h${minutes}mn${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}mn${seconds}s`;
    } else if (seconds > 0) {
      return `${seconds}s`;
    } else {
      return '<1s';
    }
  }

  render() {
    const {
      intl: { formatMessage },
    } = this.props;
    const { executions, isLoading, total, currentPage, pageSize } = this.state;

    const dataColumnsDefinition: Array<DataColumnDefinition<PublicJobExecutionResource>> = [
      {
        title: formatMessage(messages.jobStatus),
        key: 'status',
        isHideable: false,
        render: (text: string, record: PublicJobExecutionResource) =>
          this.renderStatus(record.status),
      },
      {
        title: formatMessage(messages.jobStartDate),
        key: 'start_date',
        isHideable: false,
        render: (text: string, record: PublicJobExecutionResource) => {
          if (record.start_date) {
            return (
              <span className='mcs-batchInstanceExecutionsTable_start'>
                {new McsMoment(record.start_date).toMoment().format('DD/MM/YY HH:mm')}
              </span>
            );
          } else {
            return <span className='mcs-batchInstanceExecutionsTable_start'> - </span>;
          }
        },
      },
      {
        title: formatMessage(messages.jobDuration),
        key: 'duration',
        isHideable: false,
        render: (text: string, record: PublicJobExecutionResource) => {
          if (record.duration) {
            return (
              <span className='mcs-batchInstanceExecutionsTable_duration'>
                {this.printDuration(record.duration)}
              </span>
            );
          } else {
            return <span className='mcs-batchInstanceExecutionsTable_duration'> - </span>;
          }
        },
      },
    ];

    const pagination = {
      currentPage: currentPage,
      pageSize: pageSize,
      onChange: (page: number, size: number) => this.fetchExecutions(page, size),
      onShowSizeChange: (current: number, size: number) => this.fetchExecutions(1, size),
      total,
    };

    return (
      <Card>
        <TableViewFilters
          dataSource={executions}
          columns={dataColumnsDefinition}
          loading={isLoading}
          pagination={pagination}
        />
      </Card>
    );
  }
}

export default compose<Props, IntegrationBatchExecutionsListTabProps>(
  withRouter,
  injectIntl,
  injectNotifications,
)(IntegrationBatchExecutionsListTab);

import * as React from 'react';
import _ from 'lodash';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import cronstrue from 'cronstrue';
import {
  FilterOutlined,
  PauseCircleFilled,
  PlayCircleFilled,
  ClockCircleOutlined,
  ClockCircleFilled,
  CheckCircleFilled,
  CloseCircleFilled,
} from '@ant-design/icons';
import { Drawer, Tag, Tooltip } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import messages from '../messages';
import {
  PAGINATION_SEARCH_SETTINGS,
  PLUGIN_SEARCH_SETTINGS,
  updateSearch,
} from '../../../utils/LocationSearchHelper';
import {
  ActionsColumnDefinition,
  DataColumnDefinition,
} from '@mediarithmics-private/mcs-components-library/lib/components/table-view/table-view/TableView';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import {
  Card,
  EmptyTableView,
  TableViewFilters,
} from '@mediarithmics-private/mcs-components-library';

import { McsIconType } from '@mediarithmics-private/mcs-components-library/lib/components/mcs-icon';
import { DataListResponse } from '@mediarithmics-private/advanced-components/lib/services/ApiService';
import {
  lazyInject,
  TYPES,
  IntegrationBatchInstanceOptions,
  IIntegrationBatchService,
  CronStatus,
  IntegrationBatchResource,
  PublicJobExecutionResource,
  JobExecutionPublicStatus,
} from '@mediarithmics-private/advanced-components';
import IntegrationBatchInstanceEditPage from '../Edit/IntegrationBatchInstanceEditPage';
import { Link } from 'react-router-dom';

const BATCH_INSTANCE_SEARCH_SETTINGS = [...PAGINATION_SEARCH_SETTINGS, ...PLUGIN_SEARCH_SETTINGS];

interface RouteProps {
  organisationId: string;
}

type Props = InjectedIntlProps & InjectedNotificationProps & RouteComponentProps<RouteProps>;

interface IntegrationBatchLine {
  instance: IntegrationBatchResource;
  execs: PublicJobExecutionResource[];
}

interface State {
  nonPeriodicInstances: IntegrationBatchLine[];
  isLoadingNonPeriodicInstances: boolean;
  periodicInstances: IntegrationBatchLine[];
  isLoadingPeriodicInstances: boolean;
  periodicTotal: number;
  nonPeriodicTotal: number;
  currentPage: number;
  pageSize: number;
  currentPage2: number;
  pageSize2: number;
  options: Array<{ value: string }>;
  noInitialNonPeriodicData: boolean;
  noInitialPeriodicData: boolean;
  isDrawerVisible: boolean;
  pluginInstanceId?: string;
}

class IntegrationBatchInstancesOverviewTab extends React.Component<Props, State> {
  @lazyInject(TYPES.IIntegrationBatchService)
  private _integrationBatchService: IIntegrationBatchService;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoadingNonPeriodicInstances: false,
      isLoadingPeriodicInstances: false,
      nonPeriodicInstances: [],
      periodicInstances: [],
      periodicTotal: 0,
      nonPeriodicTotal: 0,
      options: [],
      currentPage: 1,
      pageSize: 10,
      currentPage2: 1,
      pageSize2: 10,
      noInitialPeriodicData: false,
      noInitialNonPeriodicData: false,
      isDrawerVisible: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      match: {
        params: { organisationId },
      },
    } = this.props;
    const {
      match: {
        params: { organisationId: prevOrganisationId },
      },
    } = prevProps;

    if (organisationId !== prevOrganisationId) {
      this.fetchData();
    }
  }

  getBatchInstanceLines = (dataListResponse: DataListResponse<IntegrationBatchResource>) => {
    const result = dataListResponse.data.map(ins => {
      if (ins.id) {
        return this._integrationBatchService
          .getBatchInstanceExecutions(ins.id, { max_results: 10 })
          .then(execsRes => {
            return {
              instance: ins,
              execs: execsRes.data,
            };
          });
      } else {
        return Promise.resolve({
          instance: ins,
          execs: [],
        });
      }
    });

    return Promise.all(result).then(res => {
      return {
        ...dataListResponse,
        data: res,
      };
    });
  };

  fetchData() {
    const {
      notifyError,
      match: {
        params: { organisationId },
      },
    } = this.props;
    const { pageSize, pageSize2 } = this.state;

    this.setState({
      isLoadingPeriodicInstances: true,
      isLoadingNonPeriodicInstances: true,
    });
    const promises: Array<Promise<any>> = [
      this._integrationBatchService.getAllInstanceFilterProperties(),
      this._integrationBatchService
        .getIntegrationBatchInstances(organisationId, {
          is_periodic: true,
          first_result: 0,
          max_results: pageSize,
        })
        .then(this.getBatchInstanceLines),
      this._integrationBatchService
        .getIntegrationBatchInstances(organisationId, {
          is_periodic: false,
          first_result: 0,
          max_results: pageSize2,
        })
        .then(this.getBatchInstanceLines),
    ];

    Promise.all(promises)
      .then(res => {
        const filterOptions = res[0];
        const periodicInstanceLines = res[1] as DataListResponse<IntegrationBatchLine>;
        const nonPeriodicInstanceLines = res[2] as DataListResponse<IntegrationBatchLine>;

        this.setState({
          periodicInstances: periodicInstanceLines.data,
          isLoadingPeriodicInstances: false,
          periodicTotal: periodicInstanceLines.total || periodicInstanceLines.count,
          nonPeriodicInstances: nonPeriodicInstanceLines.data,
          isLoadingNonPeriodicInstances: false,
          nonPeriodicTotal: nonPeriodicInstanceLines.total || nonPeriodicInstanceLines.count,
          options: _.uniq(filterOptions.data as string[]).map(elt => {
            return { value: elt };
          }),
          noInitialNonPeriodicData: nonPeriodicInstanceLines.data.length === 0,
          noInitialPeriodicData: periodicInstanceLines.data.length === 0,
        });
      })
      .catch(err => {
        notifyError(err);
        this.setState({
          isLoadingNonPeriodicInstances: false,
          isLoadingPeriodicInstances: false,
        });
      });
  }

  onClear = (filterProperty: 'group_id' | 'artifact_id' | 'version_id') => () => {
    const {
      history,
      location: { search: currentSearch, pathname },
    } = this.props;
    const params: any = {};
    params[`${filterProperty}`] = '';
    const nextLocation = {
      pathname,
      search: updateSearch(currentSearch, params, BATCH_INSTANCE_SEARCH_SETTINGS),
    };
    history.push(nextLocation);
  };

  onSelect = (filterProperty: 'group_id' | 'artifact_id' | 'version_id') => (value: string) => {
    const { currentPage, currentPage2, pageSize, pageSize2 } = this.state;
    const options: any = {};
    options[`${filterProperty}`] = value;
    this.fetchIntegrationBatchInstances(currentPage2, pageSize2, options, true).then(() => {
      this.fetchIntegrationBatchInstances(currentPage, pageSize, options);
    });
  };

  fetchIntegrationBatchInstances = (
    page: number,
    pageSize: number,
    options?: IntegrationBatchInstanceOptions,
    fetchPeriodic?: boolean,
  ) => {
    const {
      notifyError,
      match: {
        params: { organisationId },
      },
    } = this.props;
    const firstResult = (page - 1) * pageSize;
    if (fetchPeriodic) {
      this.setState({
        isLoadingPeriodicInstances: true,
      });
      return this._integrationBatchService
        .getIntegrationBatchInstances(organisationId, {
          first_result: firstResult,
          max_results: pageSize,
          is_periodic: true,
        })
        .then(this.getBatchInstanceLines)
        .then(res => {
          this.setState({
            periodicInstances: res.data,
            isLoadingPeriodicInstances: false,
            periodicTotal: res.total || res.count,
            currentPage2: page,
            pageSize2: pageSize,
          });
        })
        .catch(err => {
          notifyError(err);
          this.setState({
            isLoadingPeriodicInstances: false,
          });
        });
    } else {
      this.setState({
        isLoadingNonPeriodicInstances: true,
      });
      return this._integrationBatchService
        .getIntegrationBatchInstances(organisationId, {
          first_result: firstResult,
          max_results: pageSize,
          is_periodic: false,
        })
        .then(this.getBatchInstanceLines)
        .then(res => {
          this.setState({
            nonPeriodicInstances: res.data,
            isLoadingNonPeriodicInstances: false,
            nonPeriodicTotal: res.total || res.count,
            currentPage: page,
            pageSize: pageSize,
          });
        })
        .catch(err => {
          notifyError(err);
          this.setState({
            isLoadingNonPeriodicInstances: false,
          });
        });
    }
  };

  renderInputPlaceholder(value: string) {
    return (
      <React.Fragment>
        <span className='mcs-actionBar_placeholderFilter'>{value}</span>
        <FilterOutlined className='mcs-actionBar_iconFilter' />
      </React.Fragment>
    );
  }

  editIntegrationBatchInstance = (integrationBatchLine: IntegrationBatchLine) => {
    this.setState({
      isDrawerVisible: true,
      pluginInstanceId: integrationBatchLine.instance.id,
    });
  };

  closeDrawer = () => {
    this.setState({
      isDrawerVisible: false,
    });
  };

  renderLastExecStatuses(execs: PublicJobExecutionResource[]) {
    return (
      <div className='mcs-batchInstanceTable_lastExecutionsStatuses'>
        {execs.map(exec => {
          return this.renderSingleStatus(exec.status);
        })}
      </div>
    );
  }

  renderSingleStatus(status: JobExecutionPublicStatus): JSX.Element {
    const {
      intl: { formatMessage },
    } = this.props;
    switch (status) {
      case 'PENDING':
        return (
          <Tooltip title={formatMessage(messages.pendingStatus)}>
            <ClockCircleFilled className='mcs-batchInstanceTable_lastExecutionsStatus_pending' />
          </Tooltip>
        );
      case 'RUNNING':
        return (
          <Tooltip title={formatMessage(messages.runningStatus)}>
            <PlayCircleFilled className='mcs-batchInstanceTable_lastExecutionsStatus_running' />
          </Tooltip>
        );
      case 'SUCCEEDED':
        return (
          <Tooltip title={formatMessage(messages.succeededStatus)}>
            <CheckCircleFilled className='mcs-batchInstanceTable_lastExecutionsStatus_succeeded' />
          </Tooltip>
        );
      case 'FAILED':
        return (
          <Tooltip title={formatMessage(messages.failedStatus)}>
            <CloseCircleFilled className='mcs-batchInstanceTable_lastExecutionsStatus_failed' />
          </Tooltip>
        );
      case 'CANCELED':
        return (
          <Tooltip title={formatMessage(messages.canceledStatus)}>
            <CloseCircleFilled className='mcs-batchInstanceTable_lastExecutionsStatus_canceled' />
          </Tooltip>
        );
    }
  }

  render() {
    const {
      intl: { formatMessage },
      match: {
        params: { organisationId },
      },
    } = this.props;
    const {
      periodicInstances,
      nonPeriodicInstances,
      isLoadingPeriodicInstances,
      isLoadingNonPeriodicInstances,
      periodicTotal,
      nonPeriodicTotal,
      currentPage,
      pageSize2,
      currentPage2,
      pageSize,
      noInitialPeriodicData,
      noInitialNonPeriodicData,
      isDrawerVisible,
      pluginInstanceId,
    } = this.state;

    const actionColumns: Array<ActionsColumnDefinition<IntegrationBatchLine>> = [
      {
        className: 'mcs-audienceSegmentTable_dropDownMenu',
        key: 'action',
        actions: () => [
          {
            message: formatMessage(messages.edit),
            callback: this.editIntegrationBatchInstance,
            className: 'mcs-integrationBatchInstanceTable_dropDownMenu--edit',
          },
        ],
      },
    ];

    const dataColumnsDefinition: Array<DataColumnDefinition<IntegrationBatchLine>> = [
      {
        className: 'mcs-integrationBatchInstancesOverviewTab_tableView--jobName',
        title: formatMessage(messages.name),
        key: 'name',
        isHideable: false,
        render: (text: string, record: IntegrationBatchLine) => (
          <Link
            to={`/o/${organisationId}/jobs/integration_batch_instances/${record.instance.id}`}
            className='mcs-integrationBatchInstancesOverviewTab_tableView--instanceName'
          >
            {record.instance.name}
          </Link>
        ),
      },
      {
        className: 'mcs-integrationBatchInstancesOverviewTab_tableView--jobGroupId',
        title: formatMessage(messages.group),
        key: 'group_id',
        isHideable: false,
        render: (text: string, record: IntegrationBatchLine) => (
          <Link
            to={`/o/${organisationId}/jobs/integration_batch_instances/${record.instance.id}`}
            className='mcs-integrationBatchInstancesOverviewTab_tableView--instanceGroupId'
          >
            <Tag className='mcs-batchInstanceTable_groupId'>{record.instance.group_id}</Tag>
          </Link>
        ),
      },
      {
        className: 'mcs-integrationBatchInstancesOverviewTab_tableView--jobArtifactId',
        title: formatMessage(messages.artifactId),
        key: 'artifact_id',
        isHideable: false,
        render: (text: string, record: IntegrationBatchLine) => (
          <Link
            to={`/o/${organisationId}/jobs/integration_batch_instances/${record.instance.id}`}
            className='mcs-integrationBatchInstancesOverviewTab_tableView--instanceArtifactId'
          >
            <Tag className='mcs-batchInstanceTable_artifactId' color='blue'>
              {record.instance.artifact_id}
            </Tag>
          </Link>
        ),
      },
      {
        className: 'mcs-integrationBatchInstancesOverviewTab_tableView--jobVersionId',
        title: formatMessage(messages.currentVersion),
        key: 'version_id',
        isHideable: false,
        render: (text: string, record: IntegrationBatchLine) => (
          <Link
            to={`/o/${organisationId}/jobs/integration_batch_instances/${record.instance.id}`}
            className='mcs-integrationBatchInstancesOverviewTab_tableView--currentVersion'
          >
            <Tag className='mcs-batchInstanceTable_currentVersion' color='purple'>
              {record.instance.version_id}
            </Tag>
          </Link>
        ),
      },
      {
        className: 'mcs-integrationBatchInstancesOverviewTab_tableView--jobLastExecution',
        title: formatMessage(messages.lastExecutions),
        key: 'last_executions',
        isHideable: false,
        render: (text: string, record: IntegrationBatchLine) => (
          <Link
            to={`/o/${organisationId}/jobs/integration_batch_instances/${record.instance.id}`}
            className='mcs-integrationBatchInstancesOverviewTab_tableView--lastExecution'
          >
            {this.renderLastExecStatuses(record.execs)}
          </Link>
        ),
      },
    ];

    const getCronStatusIcon = (cronStatus?: CronStatus) => {
      if (!cronStatus) return 'No status';
      if (cronStatus === ('ACTIVE' as CronStatus)) {
        return <PlayCircleFilled className='mcs-batchInstanceTable_playIcon' />;
      } else {
        return <PauseCircleFilled className='mcs-batchInstanceTable_pauseIcon' />;
      }
    };

    const dataColumnsDefinition2: Array<DataColumnDefinition<IntegrationBatchLine>> =
      dataColumnsDefinition.slice();
    dataColumnsDefinition2.unshift(
      {
        className: 'mcs-integrationBatchInstancesOverviewTab_tableView--jobCronStatus',
        title: formatMessage(messages.cronStatus),
        key: 'cron_status',
        isHideable: false,
        render: (text: string, record: IntegrationBatchLine) =>
          getCronStatusIcon(record.instance.cron_status),
      },
      {
        className: 'mcs-integrationBatchInstancesOverviewTab_tableView--jobCron',
        title: formatMessage(messages.cron),
        key: 'cron',
        isHideable: false,
        render: (text: string, record: IntegrationBatchLine) => {
          return (
            <span>
              <ClockCircleOutlined />
              {` ${record.instance.cron ? cronstrue.toString(record.instance.cron) : '-'}`}
            </span>
          );
        },
      },
    );

    const pagination = {
      current: currentPage,
      pageSize: pageSize,
      onChange: (page: number, size: number) =>
        this.fetchIntegrationBatchInstances(page, size, undefined, false),
      onShowSizeChange: (current: number, size: number) =>
        this.fetchIntegrationBatchInstances(1, size, undefined, false),
      nonPeriodicTotal,
    };

    const pagination2 = {
      current: currentPage2,
      pageSize: pageSize2,
      onChange: (page: number, size: number) =>
        this.fetchIntegrationBatchInstances(page, size, undefined, true),
      onShowSizeChange: (current: number, size: number) =>
        this.fetchIntegrationBatchInstances(1, size, undefined, true),
      periodicTotal,
    };

    const emptyPeriodicTable: {
      iconType: McsIconType;
      message: string;
    } = {
      iconType: 'library',
      message: formatMessage(messages.emptyPeriodicTableMessage),
    };

    const emptyNonPeriodicTable: {
      iconType: McsIconType;
      message: string;
    } = {
      iconType: 'library',
      message: formatMessage(messages.emptyNonPeriodicTableMessage),
    };

    return (
      <React.Fragment>
        <Card title={formatMessage(messages.nonPeriodicInstances)}>
          {noInitialNonPeriodicData ? (
            <EmptyTableView {...emptyNonPeriodicTable} />
          ) : (
            <TableViewFilters
              className='mcs-overviewTab_nonPeriodicInstancesTable'
              dataSource={nonPeriodicInstances}
              columns={dataColumnsDefinition}
              loading={isLoadingNonPeriodicInstances}
              actionsColumnsDefinition={actionColumns}
              pagination={pagination}
            />
          )}
        </Card>

        <Card title={formatMessage(messages.periodicInstances)}>
          {noInitialPeriodicData ? (
            <EmptyTableView {...emptyPeriodicTable} />
          ) : (
            <TableViewFilters
              className='mcs-overviewTab_periodicInstancesTable'
              dataSource={periodicInstances}
              columns={dataColumnsDefinition2}
              loading={isLoadingPeriodicInstances}
              actionsColumnsDefinition={actionColumns}
              pagination={pagination2}
            />
          )}
        </Card>
        <Drawer
          className='mcs-integrationBatchInstanceForm_drawer'
          closable={false}
          onClose={this.closeDrawer}
          visible={isDrawerVisible}
          width='1200'
          destroyOnClose={true}
        >
          <IntegrationBatchInstanceEditPage
            onClose={this.closeDrawer}
            integrationBatchInstanceId={pluginInstanceId}
          />
        </Drawer>
      </React.Fragment>
    );
  }
}

export default compose<Props, {}>(
  withRouter,
  injectIntl,
  injectNotifications,
)(IntegrationBatchInstancesOverviewTab);

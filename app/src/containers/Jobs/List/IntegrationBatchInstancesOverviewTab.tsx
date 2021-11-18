import * as React from 'react';
import _ from 'lodash';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import cronstrue from 'cronstrue';
import {
  FilterOutlined,
  PauseCircleFilled,
  PlayCircleFilled,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import messages from '../messages';
import {
  PAGINATION_SEARCH_SETTINGS,
  PLUGIN_SEARCH_SETTINGS,
  updateSearch,
} from '../../../utils/LocationSearchHelper';
import { DataColumnDefinition } from '@mediarithmics-private/mcs-components-library/lib/components/table-view/table-view/TableView';
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
} from '@mediarithmics-private/advanced-components';

const BATCH_INSTANCE_SEARCH_SETTINGS = [...PAGINATION_SEARCH_SETTINGS, ...PLUGIN_SEARCH_SETTINGS];

interface RouteProps {
  organisationId: string;
}

type Props = InjectedIntlProps & InjectedNotificationProps & RouteComponentProps<RouteProps>;

interface State {
  nonPeriodicInstances: IntegrationBatchResource[];
  isLoadingNonPeriodicInstances: boolean;
  periodicInstances: IntegrationBatchResource[];
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
    };
  }

  componentDidMount() {
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
      this._integrationBatchService.getIntegrationBatchInstances(organisationId, {
        is_periodic: true,
        first_result: 0,
        max_results: pageSize,
      }),
      this._integrationBatchService.getIntegrationBatchInstances(organisationId, {
        is_periodic: false,
        first_result: 0,
        max_results: pageSize2,
      }),
    ];

    return Promise.all(promises)
      .then(res => {
        const filterOptions = res[0];
        const periodicInstances = res[1] as DataListResponse<IntegrationBatchResource>;
        const nonPeriodicInstances = res[2] as DataListResponse<IntegrationBatchResource>;
        this.setState({
          periodicInstances: periodicInstances.data,
          isLoadingPeriodicInstances: false,
          periodicTotal: periodicInstances.total || periodicInstances.count,
          nonPeriodicInstances: nonPeriodicInstances.data,
          isLoadingNonPeriodicInstances: false,
          nonPeriodicTotal: nonPeriodicInstances.total || nonPeriodicInstances.count,
          options: _.uniq(filterOptions.data as string[]).map(elt => {
            return { value: elt };
          }),
          noInitialNonPeriodicData: nonPeriodicInstances.data.length === 0,
          noInitialPeriodicData: periodicInstances.data.length === 0,
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

  saveBatchInstance = () => {
    //
  };

  render() {
    const {
      intl: { formatMessage },
      match: {
        params: { organisationId },
      },
      history,
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
    } = this.state;

    const dataColumnsDefinition: Array<DataColumnDefinition<IntegrationBatchResource>> = [
      {
        title: formatMessage(messages.group),
        key: 'group_id',
        isHideable: false,
        render: (text: string, record: IntegrationBatchResource) => (
          <Tag className='mcs-batchInstanceTable_groupId'>{record.group_id}</Tag>
        ),
      },
      {
        title: formatMessage(messages.artifactId),
        key: 'artifact_id',
        isHideable: false,
        render: (text: string, record: IntegrationBatchResource) => (
          <Tag className='mcs-batchInstanceTable_artifactId' color='blue'>
            {record.artifact_id}
          </Tag>
        ),
      },
      {
        title: formatMessage(messages.currentVersion),
        key: 'version_id',
        isHideable: false,
        render: (text: string, record: IntegrationBatchResource) => (
          <Tag className='mcs-batchInstanceTable_currentVersion' color='purple'>
            {record.version_id}
          </Tag>
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

    const dataColumnsDefinition2: Array<DataColumnDefinition<IntegrationBatchResource>> =
      dataColumnsDefinition.slice();
    dataColumnsDefinition2.unshift(
      {
        title: formatMessage(messages.cronStatus),
        key: 'cron_status',
        isHideable: false,
        render: (text: string, record: IntegrationBatchResource) =>
          getCronStatusIcon(record.cron_status),
      },
      {
        title: formatMessage(messages.cron),
        key: 'cron',
        isHideable: false,
        render: (text: string, record: IntegrationBatchResource) => {
          return (
            <span>
              <ClockCircleOutlined />
              {` ${record.cron ? cronstrue.toString(record.cron) : '-'}`}
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

    const onRow = (record: IntegrationBatchResource) => {
      return {
        onClick: () => {
          history.push(`/o/${organisationId}/jobs/integration_batch_instances/${record.id}`);
        },
        className: 'mcs-batchInstanceTable_row',
      };
    };

    return (
      <React.Fragment>
        <Card title={formatMessage(messages.nonPeriodicInstances)}>
          {noInitialNonPeriodicData ? (
            <EmptyTableView {...emptyNonPeriodicTable} />
          ) : (
            <TableViewFilters
              dataSource={nonPeriodicInstances}
              columns={dataColumnsDefinition}
              loading={isLoadingNonPeriodicInstances}
              pagination={pagination}
              onRow={onRow}
            />
          )}
        </Card>

        <Card title={formatMessage(messages.periodicInstances)}>
          {noInitialPeriodicData ? (
            <EmptyTableView {...emptyPeriodicTable} />
          ) : (
            <TableViewFilters
              dataSource={periodicInstances}
              columns={dataColumnsDefinition2}
              loading={isLoadingPeriodicInstances}
              pagination={pagination2}
              onRow={onRow}
            />
          )}
        </Card>
      </React.Fragment>
    );
  }
}

export default compose<Props, {}>(
  withRouter,
  injectIntl,
  injectNotifications,
)(IntegrationBatchInstancesOverviewTab);

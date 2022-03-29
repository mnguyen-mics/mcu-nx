import * as React from 'react';
import _ from 'lodash';
import queryString from 'query-string';
import { FilterOutlined } from '@ant-design/icons';
import { Layout, Select, Tag, Drawer, TablePaginationConfig } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import messages from '../messages';
import ItemList, { Filters } from '../../../components/ItemList';
import {
  PluginResource,
  lazyInject,
  TYPES,
  IPluginService,
  GetPluginOptions,
} from '@mediarithmics-private/advanced-components';
import {
  PAGINATION_SEARCH_SETTINGS,
  parseSearch,
  PLUGIN_SEARCH_SETTINGS,
  SORT_SEARCH_SETTINGS,
  updateSearch,
} from '../../../utils/LocationSearchHelper';
import PluginsListActionBar from './PluginsListActionBar';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { McsIconType } from '@mediarithmics-private/mcs-components-library/lib/components/mcs-icon';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import PluginEditDrawer from '../Edit/PluginEditDrawer';
import { Link } from 'react-router-dom';
import { Card, PieChart } from '@mediarithmics-private/mcs-components-library';
import { PluginType } from '@mediarithmics-private/advanced-components/lib/models/plugin/Plugins';
import { getPaginatedApiParam } from '../../../utils/ApiHelper';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { Dataset } from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import { DataColumnDefinition } from '@mediarithmics-private/mcs-components-library/lib/components/table-view/table-view/TableView';

const { Content } = Layout;

export const PLUGIN_PAGE_SEARCH_SETTINGS = [
  ...PAGINATION_SEARCH_SETTINGS,
  ...PLUGIN_SEARCH_SETTINGS,
  ...SORT_SEARCH_SETTINGS,
];
interface RouteProps {
  organisationId: string;
}

type Props = InjectedIntlProps & InjectedNotificationProps & RouteComponentProps<RouteProps>;

interface State {
  loading: boolean;
  data: PluginResource[];
  total: number;
  pluginTypeOptions: Array<{ value: PluginType }>;
  groupIdOptions: Array<{ value: string }>;
  artifactIdOptions: Array<{ value: string }>;
  isVisibleDrawer: boolean;
  sortField?: string;
  isSortAsc?: boolean;
  isLoadingPluginPieChart: boolean;
  pluginPieChartDataset: Dataset;
}

class PluginsList extends React.Component<Props, State> {
  @lazyInject(TYPES.IPluginService)
  private _pluginService: IPluginService;

  constructor(props: Props) {
    super(props);
    const {
      location: { search },
    } = props;

    const param: GetPluginOptions = parseSearch<GetPluginOptions>(
      search,
      PLUGIN_PAGE_SEARCH_SETTINGS,
    );

    this.state = {
      loading: false,
      data: [],
      total: 0,
      pluginTypeOptions: [],
      groupIdOptions: [],
      artifactIdOptions: [],
      isVisibleDrawer: false,
      sortField:
        param.order_by && param.order_by.length > 0
          ? param.order_by[0] === '-'
            ? param.order_by.substring(1)
            : param.order_by
          : undefined,
      isSortAsc: param.order_by ? (param.order_by[0] === '-' ? false : true) : undefined,
      isLoadingPluginPieChart: false,
      pluginPieChartDataset: [],
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { organisationId },
      },
    } = this.props;
    this.getPluginFilterOptions(organisationId);
    this.fetchPluginsChart(organisationId);
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
      this.getPluginFilterOptions(organisationId);
      this.fetchPluginsChart(organisationId);
    }
  }

  getPluginFilterOptions = (organisationId: string) => {
    const { notifyError } = this.props;
    this._pluginService
      .getPlugins(
        {
          organisation_id: organisationId,
          max_results: 500,
        },
        true,
      )
      .then(res => {
        const pluginTypes: PluginType[] = [];
        res.data
          .map(p => p.plugin_type)
          .forEach(
            pluginType =>
              pluginType &&
              !pluginTypes.find(type => type === pluginType) &&
              pluginTypes.push(pluginType),
          );
        this.setState({
          pluginTypeOptions: pluginTypes.map(type => {
            return {
              value: type,
            };
          }),
          groupIdOptions: _.uniq(res.data.map(p => p.group_id)).map(groupdId => {
            return { value: groupdId };
          }),
          artifactIdOptions: _.uniq(res.data.map(p => p.artifact_id)).map(artifactId => {
            return {
              value: artifactId,
            };
          }),
        });
      })
      .catch(err => {
        notifyError(err);
      });
  };

  fetchPluginsChart = (organisationId: string) => {
    this.setState({
      isLoadingPluginPieChart: true,
    });
    this._pluginService
      .getPlugins({ organisation_id: organisationId })
      .then(res => {
        const pluginsByType = _.groupBy(res.data, 'plugin_type');

        this.setState({
          isLoadingPluginPieChart: false,
          pluginPieChartDataset: Object.keys(pluginsByType).map(pluginType => {
            return {
              key: pluginType,
              value: pluginsByType[pluginType].length,
            };
          }),
        });
      })
      .catch(err => {
        this.setState({
          isLoadingPluginPieChart: false,
        });
        this.props.notifyError(err);
      });
  };

  onClear = (filterProperty: 'group_id' | 'artifact_id' | 'plugin_type') => () => {
    const {
      history,
      location: { search: currentSearch, pathname },
    } = this.props;
    const newSearch = queryString.parse(currentSearch);
    delete newSearch[`${filterProperty}`];

    const nextLocation = {
      pathname,
      search: updateSearch(queryString.stringify(newSearch), {}, PLUGIN_PAGE_SEARCH_SETTINGS),
    };
    history.push(nextLocation);
  };

  onSelect = (filterProperty: 'group_id' | 'artifact_id' | 'plugin_type') => (value: string) => {
    const {
      history,
      location: { search: currentSearch, pathname },
    } = this.props;
    const params: any = {};
    params[`${filterProperty}`] = value;
    const nextLocation = {
      pathname,
      search: updateSearch(currentSearch, params, PLUGIN_PAGE_SEARCH_SETTINGS),
    };
    history.push(nextLocation);
  };

  onOrderBy = (sortField?: string, isAsc?: boolean) => {
    const {
      history,
      location: { search: currentSearch, pathname },
    } = this.props;
    const value =
      sortField !== undefined && isAsc !== undefined
        ? isAsc
          ? sortField
          : '-' + sortField
        : undefined;
    const params: any = { order_by: value };
    const nextLocation = {
      pathname,
      search: updateSearch(currentSearch, params, PLUGIN_PAGE_SEARCH_SETTINGS),
    };
    history.push(nextLocation);
  };

  unnullValues(values: Array<string | null>): string[] {
    const result: string[] = [];

    values.forEach(value => {
      if (value !== null) result.push(value);
    });

    return result;
  }

  renderActionBarInnerElements() {
    const { groupIdOptions, artifactIdOptions, pluginTypeOptions } = this.state;
    const {
      location: { search },
    } = this.props;

    const defaultGroupId = queryString.parse(search).group_id || undefined;
    const defaultArtifactId = queryString.parse(search).artifact_id || undefined;
    const defaultPluginType = queryString.parse(search).plugin_type || undefined;

    const defaultGroupIdNN = defaultGroupId
      ? Array.isArray(defaultGroupId)
        ? this.unnullValues(defaultGroupId)
        : defaultGroupId
      : undefined;

    const defaultArtifactIdNN = defaultArtifactId
      ? Array.isArray(defaultArtifactId)
        ? this.unnullValues(defaultArtifactId)
        : defaultArtifactId
      : undefined;

    const defaultPluginTypeNN = defaultPluginType
      ? Array.isArray(defaultPluginType)
        ? this.unnullValues(defaultPluginType)
        : defaultPluginType
      : undefined;

    return (
      <div className='mcs-pluginList-filters'>
        <Select
          className='mcs-actionBar_filterInput mcs-actionBar_filterInput--pluginType'
          placeholder={this.renderInputPlaceholder('Plugin Type')}
          showSearch={true}
          allowClear={true}
          showArrow={false}
          options={pluginTypeOptions}
          onSelect={this.onSelect('plugin_type')}
          onClear={this.onClear('plugin_type')}
          defaultValue={defaultPluginTypeNN}
          dropdownMatchSelectWidth={false}
          dropdownClassName={'mcs-pluginList_filterDropdown'}
        />
        <Select
          className='mcs-actionBar_filterInput mcs-actionBar_filterInput--groupId'
          placeholder={this.renderInputPlaceholder('Group Id')}
          showSearch={true}
          allowClear={true}
          showArrow={false}
          options={groupIdOptions}
          onSelect={this.onSelect('group_id')}
          onClear={this.onClear('group_id')}
          defaultValue={defaultGroupIdNN}
          dropdownMatchSelectWidth={false}
          dropdownClassName={'mcs-pluginList_filterDropdown'}
        />
        <Select
          className='mcs-actionBar_filterInput mcs-actionBar_filterInput--artifactId'
          placeholder={this.renderInputPlaceholder('Artifact Id')}
          showSearch={true}
          allowClear={true}
          showArrow={false}
          options={artifactIdOptions}
          onSelect={this.onSelect('artifact_id')}
          onClear={this.onClear('artifact_id')}
          defaultValue={defaultArtifactIdNN}
          dropdownMatchSelectWidth={false}
          dropdownClassName={'mcs-pluginList_filterDropdown'}
        />
      </div>
    );
  }

  fetchPlugins = (organisationId: string, filters: Filters) => {
    const { notifyError } = this.props;
    this.setState({
      loading: true,
    });
    const options = {
      ...filters,
      ...getPaginatedApiParam(filters.currentPage, filters.pageSize),
    };
    this._pluginService
      .getPlugins(
        {
          ...options,
          organisation_id: organisationId,
        },
        true,
      )
      .then(res => {
        this.setState({
          data: res.data,
          total: res.total || res.count,
          loading: false,
        });
      })
      .catch(err => {
        notifyError(err);
        this.setState({
          loading: false,
        });
      });
  };

  renderInputPlaceholder(value: string) {
    return (
      <React.Fragment>
        <span className='mcs-actionBar_placeholderFilter'>{value}</span>
        <FilterOutlined className='mcs-actionBar_iconFilter' />
      </React.Fragment>
    );
  }

  openDrawer = () => {
    this.setState({
      isVisibleDrawer: true,
    });
  };

  closeDrawer = () => {
    this.setState({
      isVisibleDrawer: false,
    });
  };

  savePlugin = (pluginResource: Partial<PluginResource>) => {
    const {
      notifyError,
      history,
      match: {
        params: { organisationId },
      },
    } = this.props;
    this._pluginService
      .createPlugin({
        ...pluginResource,
      })
      .then(res => {
        const pluginId = res.data.id;
        const newPathName = `/o/${organisationId}/plugins/${pluginId}`;
        history.push(newPathName);
      })
      .catch(err => {
        notifyError(err);
      });
  };

  getOrderByForColumn = (key: string, sortField?: string, isSortAsc?: boolean) => {
    if (sortField !== key || isSortAsc === undefined) {
      return undefined;
    } else {
      if (isSortAsc) {
        return 'ascend';
      } else {
        return 'descend';
      }
    }
  };

  onTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<PluginResource>,
  ) => {
    const isSortAsc = sorter.order ? (sorter.order === 'ascend' ? true : false) : undefined;
    const sortField = sorter.columnKey && sorter.order ? sorter.columnKey.toString() : undefined;
    this.setState({
      isSortAsc: isSortAsc,
      sortField: sortField,
    });
    this.onOrderBy(sortField, isSortAsc);
  };

  render() {
    const {
      intl: { formatMessage },
      match: {
        params: { organisationId },
      },
    } = this.props;
    const {
      data,
      loading,
      total,
      isVisibleDrawer,
      sortField,
      isSortAsc,
      isLoadingPluginPieChart,
      pluginPieChartDataset,
    } = this.state;
    const dataColumnsDefinition: Array<DataColumnDefinition<PluginResource>> = [
      {
        title: formatMessage(messages.pluginId),
        key: 'plugin_id',
        isHideable: false,
        render: (text: string, record: PluginResource) => (
          <Link
            className='mcs-pluginTable_pluginId'
            to={`/o/${organisationId}/plugins/${record.id}`}
          >
            {record.id}
          </Link>
        ),
      },
      {
        title: formatMessage(messages.artifactId),
        key: 'artifact_id',
        isHideable: false,
        sorter: true,
        sortOrder: this.getOrderByForColumn('artifact_id', sortField, isSortAsc),
        render: (text: string, record: PluginResource) => (
          <Link
            className='mcs-pluginTable_artifactId'
            to={`/o/${organisationId}/plugins/${record.id}`}
          >
            {record.artifact_id}
          </Link>
        ),
      },
      {
        title: formatMessage(messages.pluginType),
        key: 'plugin_type',
        isHideable: false,
        sorter: true,
        sortOrder: this.getOrderByForColumn('plugin_type', sortField, isSortAsc),
        render: (text: string, record: PluginResource) => (
          <span className='mcs-pluginTable_pluginType'>{text}</span>
        ),
      },
      {
        title: formatMessage(messages.organisation),
        key: 'organisation_id',
        isHideable: false,
        sorter: true,
        sortOrder: this.getOrderByForColumn('organisation_id', sortField, isSortAsc),
        render: (text: string, record: PluginResource) => (
          <span className='mcs-pluginTable_organisation'>{text}</span>
        ),
      },
      {
        title: formatMessage(messages.group),
        key: 'group_id',
        isHideable: false,
        sorter: true,
        sortOrder: this.getOrderByForColumn('group_id', sortField, isSortAsc),
        render: (text: string, record: PluginResource) => (
          <span className='mcs-pluginTable_groupId'>{text}</span>
        ),
      },
    ];

    const emptyTable: {
      iconType: McsIconType;
      message: string;
    } = {
      iconType: 'library',
      message: formatMessage(messages.emptyTableMessage),
    };

    const additionnalComponent = (
      <div className='mcs-pluginList-filterContainer'>
        <div className='mcs-pluginVersions_totalTag'>
          <Tag color='blue'>{`${total} plugins`}</Tag>
        </div>
        {this.renderActionBarInnerElements()}
      </div>
    );
    return (
      <div className='ant-layout'>
        <PluginsListActionBar openDrawer={this.openDrawer} />
        <div className='ant-layout'>
          <Content className='mcs-content-container'>
            {!isLoadingPluginPieChart && pluginPieChartDataset.length > 0 && (
              <div style={{ width: '600px' }}>
                <h3 className='mcs-pluginList_chartTitle'>
                  {formatMessage(messages.pluginsPerType)}
                </h3>
                <PieChart
                  dataset={pluginPieChartDataset}
                  innerRadius={false}
                  legend={{ enabled: true, position: 'right' }}
                  size={'60%'}
                />
              </div>
            )}
            <Card
              className={
                !isLoadingPluginPieChart && pluginPieChartDataset.length > 0
                  ? 'mcs-pluginList_table'
                  : ''
              }
            >
              <ItemList
                fetchList={this.fetchPlugins}
                dataSource={data}
                loading={loading}
                total={total}
                columns={dataColumnsDefinition}
                pageSettings={PLUGIN_PAGE_SEARCH_SETTINGS}
                emptyTable={emptyTable}
                additionnalComponent={additionnalComponent}
                onChange={this.onTableChange}
              />
            </Card>
          </Content>
          <Drawer
            className='mcs-pluginEdit-drawer'
            width='400'
            bodyStyle={{ padding: '0' }}
            title={formatMessage(messages.pluginEditDrawerTitle)}
            placement={'right'}
            closable={true}
            onClose={this.closeDrawer}
            visible={isVisibleDrawer}
          >
            <PluginEditDrawer save={this.savePlugin} />
          </Drawer>
        </div>
      </div>
    );
  }
}

export default compose<Props, {}>(withRouter, injectIntl, injectNotifications)(PluginsList);

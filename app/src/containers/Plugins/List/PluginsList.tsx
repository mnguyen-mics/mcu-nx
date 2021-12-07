import * as React from 'react';
import _ from 'lodash';
import queryString from 'query-string';
import { FilterOutlined } from '@ant-design/icons';
import { Layout, Select, Tag, Drawer } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import messages from '../messages';
import ItemList, { Filters } from '../../../components/ItemList';
import {
  PluginResource,
  lazyInject,
  TYPES,
  IPluginService,
} from '@mediarithmics-private/advanced-components';
import {
  PAGINATION_SEARCH_SETTINGS,
  PLUGIN_SEARCH_SETTINGS,
  updateSearch,
} from '../../../utils/LocationSearchHelper';
import PluginsListActionBar from './PluginsListActionBar';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { DataColumnDefinition } from '@mediarithmics-private/mcs-components-library/lib/components/table-view/table-view/TableView';
import { McsIconType } from '@mediarithmics-private/mcs-components-library/lib/components/mcs-icon';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import PluginEditDrawer from '../Edit/PluginEditDrawer';
import { Link } from 'react-router-dom';
import { Card } from '@mediarithmics-private/mcs-components-library';
import { PLUGIN_PAGE_SEARCH_SETTINGS } from '../Dashboard/PluginVersionsDashboard';

const { Content } = Layout;

interface RouteProps {
  organisationId: string;
}

type Props = InjectedIntlProps & InjectedNotificationProps & RouteComponentProps<RouteProps>;

interface State {
  loading: boolean;
  data: PluginResource[];
  total: number;
  groupIdOptions: Array<{ value: string }>;
  artifactIdOptions: Array<{ value: string }>;
  isVisibleDrawer: boolean;
}

class PluginsList extends React.Component<Props, State> {
  @lazyInject(TYPES.IPluginService)
  private _pluginService: IPluginService;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      total: 0,
      groupIdOptions: [],
      artifactIdOptions: [],
      isVisibleDrawer: false,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { organisationId },
      },
      notifyError,
    } = this.props;
    this._pluginService
      .getPlugins({
        organisation_id: organisationId,
      })
      .then(res => {
        this.setState({
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
  }

  onClear = (filterProperty: 'group_id' | 'artifact_id' | 'plugin_type') => () => {
    const {
      history,
      location: { search: currentSearch, pathname },
    } = this.props;
    const params: any = {};
    params[`${filterProperty}`] = '';
    const nextLocation = {
      pathname,
      search: updateSearch(currentSearch, params, PLUGIN_PAGE_SEARCH_SETTINGS),
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

  renderActionBarInnerElements() {
    const { groupIdOptions, artifactIdOptions } = this.state;
    const {
      location: { search },
    } = this.props;

    const defaultGroupId = queryString.parse(search).group_id || undefined;
    const defaultArtifactId = queryString.parse(search).artifact_id || undefined;
    const defaultPluginType = queryString.parse(search).plugin_type || undefined;

    const pluginTypeOptions = pluginTypeList.map(t => {
      return {
        label: t,
        value: t,
      };
    });

    return (
      <div className='mcs-actionBar_filters'>
        <Select
          className='mcs-actionBar_filterInput'
          placeholder={this.renderInputPlaceholder('Plugin Type')}
          showSearch={true}
          allowClear={true}
          showArrow={false}
          options={pluginTypeOptions}
          onSelect={this.onSelect('plugin_type')}
          onClear={this.onClear('plugin_type')}
          defaultValue={defaultPluginType}
        />
        <Select
          className='mcs-actionBar_filterInput'
          placeholder={this.renderInputPlaceholder('Group Id')}
          showSearch={true}
          allowClear={true}
          showArrow={false}
          options={groupIdOptions}
          onSelect={this.onSelect('group_id')}
          onClear={this.onClear('group_id')}
          defaultValue={defaultGroupId}
        />
        <Select
          className='mcs-actionBar_filterInput'
          placeholder={this.renderInputPlaceholder('Artifact Id')}
          showSearch={true}
          allowClear={true}
          showArrow={false}
          options={artifactIdOptions}
          onSelect={this.onSelect('artifact_id')}
          onClear={this.onClear('artifact_id')}
          defaultValue={defaultArtifactId}
        />
      </div>
    );
  }

  fetchPlugins = (organisationId: string, filters: Filters) => {
    const { notifyError } = this.props;
    this.setState({
      loading: true,
    });
    this._pluginService
      .getPlugins({
        ...filters,
        organisation_id: organisationId,
      })
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

  render() {
    const {
      intl: { formatMessage },
      match: {
        params: { organisationId },
      },
    } = this.props;
    const { data, loading, total, isVisibleDrawer } = this.state;

    const dataColumnsDefinition: Array<DataColumnDefinition<PluginResource>> = [
      {
        title: formatMessage(messages.pluginType),
        key: 'plugin_type',
        isHideable: false,
        render: (text: string, record: PluginResource) => (
          <span className='mcs-pluginTable_pluginType'>{record.plugin_type}</span>
        ),
      },
      {
        title: formatMessage(messages.organisation),
        key: 'organisation_id',
        isHideable: false,
        render: (text: string, record: PluginResource) => (
          <span className='mcs-pluginTable_organisation'>{record.organisation_id}</span>
        ),
      },
      {
        title: formatMessage(messages.group),
        key: 'group_id',
        isHideable: false,
        render: (text: string, record: PluginResource) => (
          <Link
            className='mcs-pluginTable_GroupId'
            to={`/o/${organisationId}/plugins/${record.id}`}
          >
            {record.group_id}
          </Link>
        ),
      },
      {
        title: formatMessage(messages.artifactId),
        key: 'artifact_id',
        isHideable: false,
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
        title: formatMessage(messages.currentVersion),
        key: 'current_version',
        isHideable: false,
        render: (text: string, record: PluginResource) => (
          <Tag className='mcs-pluginTable_currentVersion' color='purple'>
            {record.current_version_id}
          </Tag>
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

    const totalTag = (
      <div className='mcs-pluginVersions_totalTag'>
        <Tag color='blue'>{`${total} plugins`}</Tag>
      </div>
    );

    return (
      <div className='ant-layout'>
        <PluginsListActionBar
          innerElement={this.renderActionBarInnerElements()}
          openDrawer={this.openDrawer}
        />
        <div className='ant-layout'>
          <Content className='mcs-content-container'>
            <Card>
              <ItemList
                fetchList={this.fetchPlugins}
                dataSource={data}
                loading={loading}
                total={total}
                columns={dataColumnsDefinition}
                pageSettings={PLUGIN_PAGE_SEARCH_SETTINGS}
                emptyTable={emptyTable}
                additionnalComponent={totalTag}
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

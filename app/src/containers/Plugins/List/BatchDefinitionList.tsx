import * as React from 'react';
import _ from 'lodash';
import queryString from 'query-string';
import { FilterOutlined } from '@ant-design/icons';
import { Layout, Select, Tag, Drawer } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import messages from './messages';
import ItemList, { Filters } from '../../../components/ItemList';
import BatchDefinitionListActionBar from './BatchDefinitionListActionBar';
import { PluginResource } from '../../../models/plugin/plugins';
import {
  PAGINATION_SEARCH_SETTINGS,
  PLUGIN_SEARCH_SETTINGS,
  updateSearch,
} from '../../../utils/LocationSearchHelper';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { DataColumnDefinition } from '@mediarithmics-private/mcs-components-library/lib/components/table-view/table-view/TableView';
import { McsIconType } from '@mediarithmics-private/mcs-components-library/lib/components/mcs-icon';
import { lazyInject } from '../../../config/inversify.config';
import { TYPES } from '../../../constants/types';
import { IPluginService } from '../../../services/PluginService';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import IntergrationBatchEditDrawer from '../Edit/IntegrationBatchEditDrawer';
import { Link } from 'react-router-dom';
import { Card } from '@mediarithmics-private/mcs-components-library';

const { Content } = Layout;

const BATCH_DEFINITION_SEARCH_SETTINGS = [...PAGINATION_SEARCH_SETTINGS, ...PLUGIN_SEARCH_SETTINGS];

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

class BatchDefinitionList extends React.Component<Props, State> {
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
        plugin_type: 'INTEGRATION_BATCH',
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

  onClear = (filterProperty: 'group_id' | 'artifact_id') => () => {
    const {
      history,
      location: { search: currentSearch, pathname },
    } = this.props;
    const params: any = {};
    params[`${filterProperty}`] = '';
    const nextLocation = {
      pathname,
      search: updateSearch(currentSearch, params, BATCH_DEFINITION_SEARCH_SETTINGS),
    };
    history.push(nextLocation);
  };

  onSelect = (filterProperty: 'group_id' | 'artifact_id') => (value: string) => {
    const {
      history,
      location: { search: currentSearch, pathname },
    } = this.props;
    const params: any = {};
    params[`${filterProperty}`] = value;
    const nextLocation = {
      pathname,
      search: updateSearch(currentSearch, params, BATCH_DEFINITION_SEARCH_SETTINGS),
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

    return (
      <div className='mcs-actionBar_filters'>
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

  fetchBatchDefinitions = (organisationId: string, filters: Filters) => {
    const { notifyError } = this.props;
    this.setState({
      loading: true,
    });
    this._pluginService
      .getPlugins({
        ...filters,
        plugin_type: 'INTEGRATION_BATCH',
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

  saveIntegrationBatchPlugin = (integrationBatchPluginResource: Partial<PluginResource>) => {
    const {
      notifyError,
      history,
      match: {
        params: { organisationId },
      },
    } = this.props;
    this._pluginService
      .createPlugin({
        ...integrationBatchPluginResource,
        plugin_type: 'INTEGRATION_BATCH',
      })
      .then(res => {
        const pluginId = res.data.id;
        const newPathName = `/o/${organisationId}/plugins/batch_definitions/${pluginId}`;
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
        title: formatMessage(messages.organisation),
        key: 'organisation_id',
        isHideable: false,
        render: (text: string, record: PluginResource) => (
          <span className='mcs-batchDefinitionTable_organisation'>{record.organisation_id}</span>
        ),
      },
      {
        title: formatMessage(messages.group),
        key: 'group_id',
        isHideable: false,
        render: (text: string, record: PluginResource) => (
          <Link
            className='mcs-batchDefinitionTable_GroupId'
            to={`/o/${organisationId}/plugins/batch_definitions/${record.id}`}
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
            className='mcs-batchDefinitionTable_artifactId'
            to={`/o/${organisationId}/plugins/batch_definitions/${record.id}`}
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
          <Tag className='mcs-batchDefinitionTable_currentVersion' color='purple'>
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
      <div className='mcs-batchDefinitions_totalTag'>
        <Tag color='blue'>{`${total} plugins`}</Tag>
      </div>
    );

    return (
      <div className='ant-layout'>
        <BatchDefinitionListActionBar
          innerElement={this.renderActionBarInnerElements()}
          openDrawer={this.openDrawer}
        />
        <div className='ant-layout'>
          <Content className='mcs-content-container'>
            <Card>
              <ItemList
                fetchList={this.fetchBatchDefinitions}
                dataSource={data}
                loading={loading}
                total={total}
                columns={dataColumnsDefinition}
                pageSettings={BATCH_DEFINITION_SEARCH_SETTINGS}
                emptyTable={emptyTable}
                additionnalComponent={totalTag}
              />
            </Card>
          </Content>
          <Drawer
            className='mcs-batchPluginEdit-drawer'
            width='400'
            bodyStyle={{ padding: '0' }}
            title={formatMessage(messages.batchEditDrawerTitle)}
            placement={'right'}
            closable={true}
            onClose={this.closeDrawer}
            visible={isVisibleDrawer}
          >
            <IntergrationBatchEditDrawer save={this.saveIntegrationBatchPlugin} />
          </Drawer>
        </div>
      </div>
    );
  }
}

export default compose<Props, {}>(withRouter, injectIntl, injectNotifications)(BatchDefinitionList);

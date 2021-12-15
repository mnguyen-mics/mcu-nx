import * as React from 'react';
import _ from 'lodash';
import { Layout, Tag } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import ItemList, { Filters } from '../../../components/ItemList';
import {
  PluginResource,
  PluginVersionResource,
  lazyInject,
  TYPES,
  IPluginService,
} from '@mediarithmics-private/advanced-components';
import PluginVersionsDashboardActionbar from './PluginVersionsDashboardActionbar';
import {
  PAGINATION_SEARCH_SETTINGS,
  PLUGIN_SEARCH_SETTINGS,
} from '../../../utils/LocationSearchHelper';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { DataColumnDefinition } from '@mediarithmics-private/mcs-components-library/lib/components/table-view/table-view/TableView';
import { McsIconType } from '@mediarithmics-private/mcs-components-library/lib/components/mcs-icon';

import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import { Card } from '@mediarithmics-private/mcs-components-library';
import messages from '../messages';
import DashboardHeader from '../../../components/DashboardHeader/DashboardHeader';
import OrganisationName from '../../../components/Common/OrganisationName';
// import { normalizeArrayOfObject } from '../../../utils/Normalizer';
// import { Index } from '../../../utils/Types';

const { Content } = Layout;

export const PLUGIN_PAGE_SEARCH_SETTINGS = [
  ...PAGINATION_SEARCH_SETTINGS,
  ...PLUGIN_SEARCH_SETTINGS,
];

interface RouteProps {
  organisationId: string;
  pluginId: string;
}

type Props = InjectedIntlProps & InjectedNotificationProps & RouteComponentProps<RouteProps>;

interface State {
  isLoadingPlugin: boolean;
  isLoadingPluginVersions: boolean;
  plugin?: PluginResource;
  pluginVersions: PluginVersionResource[];
  total: number;
  // isLoadingInstances: boolean;
  // pluginInstances?: Index<PluginResource>;
}

class PluginVersionsDashboard extends React.Component<Props, State> {
  @lazyInject(TYPES.IPluginService)
  private _pluginService: IPluginService;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoadingPlugin: false,
      isLoadingPluginVersions: false,
      pluginVersions: [],
      total: 0,
      // isLoadingInstances: true,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { pluginId },
      },
      notifyError,
    } = this.props;
    this.setState({
      isLoadingPlugin: true,
      isLoadingPluginVersions: true,
    });
    this._pluginService
      .getPlugin(pluginId)
      .then(pluginResp => {
        this.setState({
          plugin: pluginResp.data,
          isLoadingPlugin: false,
        });
      })
      .then(() => {
        this._pluginService.getPluginVersions(pluginId).then(res => {
          this.setState({
            pluginVersions: res.data,
            isLoadingPluginVersions: false,
          });
        });
      })
      .then(() => {
        // const { plugin } = this.state;
        // this._pluginService
        //   .getPlugins({
        //     plugin_type: 'INTEGRATION_BATCH',
        //     organisation_id: organisationId,
        //     artifact_id: plugin?.artifact_id,
        //     group_id: plugin?.group_id,
        //   })
        //   .then(res => {
        //     this.setState({
        //       pluginInstances: normalizeArrayOfObject(res.data, 'current_version_id'),
        //       isLoadingInstances: false,
        //     });
        //   })
        //   .catch(err => {
        //     notifyError(err);
        //     this.setState({
        //       isLoadingInstances: false,
        //     });
        //   });
      })
      .catch(err => {
        this.setState({
          isLoadingPluginVersions: false,
          isLoadingPlugin: false,
        });
        notifyError(err);
      });
  }

  fetchPluginVersions = (organisationId: string, filters: Filters) => {
    const {
      notifyError,
      match: {
        params: { pluginId },
      },
    } = this.props;
    this.setState({
      isLoadingPluginVersions: true,
    });
    this._pluginService
      .getPluginVersions(pluginId, filters)
      .then(res => {
        this.setState({
          pluginVersions: res.data,
          total: res.total || res.count,
          isLoadingPluginVersions: false,
        });
      })
      .catch(err => {
        notifyError(err);
        this.setState({
          isLoadingPluginVersions: false,
        });
      });
  };

  render() {
    const {
      intl: { formatMessage },
    } = this.props;
    const {
      plugin,
      isLoadingPlugin,
      isLoadingPluginVersions,
      pluginVersions,
      total,
      // pluginInstances,
      // isLoadingInstances,
    } = this.state;

    const dataColumnsDefinition: Array<DataColumnDefinition<PluginVersionResource>> = [
      {
        title: formatMessage(messages.versionValue),
        key: 'version_id',
        isHideable: false,
        render: (text: string, record: PluginVersionResource) => (
          <Tag color='blue' className='mcs-pluginVersionsDasboard_versionIdColumn'>
            {text}
          </Tag>
        ),
      },
      plugin?.plugin_type === 'INTEGRATION_BATCH'
        ? {
            title: formatMessage(messages.imageName),
            key: 'image_name',
            isHideable: false,
            render: (text: string, record: PluginVersionResource) => (
              <span className='mcs-pluginVersionsDasboard_imageColumn'>{text}</span>
            ),
          }
        : {
            title: formatMessage(messages.buildTag),
            key: 'build_tag',
            isHideable: false,
            render: (text: string, record: PluginVersionResource) => (
              <span className='mcs-pluginVersionsDasboard_buildColumn'>{text}</span>
            ),
          },
      // {
      //   title: formatMessage(messages.instances),
      //   key: 'instances',
      //   isHideable: false,
      //   render: (text: string, record: PluginVersionResource) => {
      //     return pluginInstances && !isLoadingInstances ? (
      //       `${_.uniq(Object.keys(pluginInstances)).length} ${formatMessage(
      //         messages.activeInstances,
      //       )}`
      //     ) : (
      //       <Spin />
      //     );
      //   },
      // },
      // {
      //   title: formatMessage(messages.executions),
      //   key: 'executions',
      //   isHideable: false,
      //   render: (text: string, record: PluginVersionResource) => 'executions',
      // },
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
        <Tag color='blue'>{`${total} versions`}</Tag>
      </div>
    );

    const title = `${plugin?.group_id} ${plugin?.artifact_id}`;

    const subtitle = (
      <React.Fragment>
        <Tag color='blue'>{plugin?.current_version_id}</Tag>
        {formatMessage(messages.for)}
        {` ${plugin?.organisation_id} `}
        <OrganisationName organisationId={plugin?.organisation_id} />
      </React.Fragment>
    );

    return (
      <div className='ant-layout'>
        <PluginVersionsDashboardActionbar plugin={plugin} />
        <div className='ant-layout'>
          <Content className='mcs-content-container'>
            <DashboardHeader title={title} subtitle={subtitle} isLoading={isLoadingPlugin} />
            <Card title='Versions'>
              <ItemList
                fetchList={this.fetchPluginVersions}
                dataSource={pluginVersions}
                loading={isLoadingPluginVersions}
                total={total}
                columns={dataColumnsDefinition}
                pageSettings={PLUGIN_PAGE_SEARCH_SETTINGS}
                emptyTable={emptyTable}
                additionnalComponent={totalTag}
              />
            </Card>
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
)(PluginVersionsDashboard);

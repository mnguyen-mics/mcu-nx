import * as React from 'react';
import _ from 'lodash';
import { Layout, Tag } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import {
  PluginResource,
  PluginVersionResource,
  lazyInject,
  TYPES,
  IPluginService,
} from '@mediarithmics-private/advanced-components';
import {
  PAGINATION_SEARCH_SETTINGS,
  PLUGIN_SEARCH_SETTINGS,
} from '../../../utils/LocationSearchHelper';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import { EmptyTableView } from '@mediarithmics-private/mcs-components-library';
import messages from '../messages';
import DashboardHeader from '../../../components/DashboardHeader/DashboardHeader';
import OrganisationName from '../../../components/Common/OrganisationName';
import PluginPageActionbar from './PluginPageActionbar';
import PluginTabContainer from './PluginTabContainer';

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
  initialPluginVersionId?: string;
}

class PluginPage extends React.Component<Props, State> {
  @lazyInject(TYPES.IPluginService)
  private _pluginService: IPluginService;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoadingPlugin: false,
      isLoadingPluginVersions: false,
      pluginVersions: [],
    };
  }

  componentDidMount() {
    this.fetchPlugin();
  }

  fetchPlugin = () => {
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
          initialPluginVersionId: pluginResp.data.current_version_id,
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
      .catch(err => {
        this.setState({
          isLoadingPluginVersions: false,
          isLoadingPlugin: false,
        });
        notifyError(err);
      });
  };

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
      history.push(`/o/${organisationId}/plugins`);
    }
  }

  fetchLastPluginVersion = () => {
    const { plugin, pluginVersions } = this.state;
    return pluginVersions.find(version => version.id === plugin?.current_version_id);
  };

  render() {
    const {
      intl: { formatMessage },
    } = this.props;
    const {
      plugin,
      isLoadingPlugin,
      isLoadingPluginVersions,
      initialPluginVersionId,
      pluginVersions,
    } = this.state;

    const lastPluginVersion = this.fetchLastPluginVersion()?.version_id;

    const title = `${plugin?.group_id} ${plugin?.artifact_id}`;

    const subtitle = (
      <React.Fragment>
        {formatMessage(messages.pluginPageTitle)} <Tag color='blue'>{lastPluginVersion}</Tag> (
        {plugin?.current_version_id}) {formatMessage(messages.for)} {` ${plugin?.organisation_id} `}
        <OrganisationName organisationId={plugin?.organisation_id} />
      </React.Fragment>
    );

    return (
      <div className='ant-layout'>
        <PluginPageActionbar
          plugin={plugin}
          lastPluginVersion={this.fetchLastPluginVersion()}
          fetchPlugin={this.fetchPlugin}
        />
        <div className='ant-layout'>
          <Content className='mcs-content-container'>
            <DashboardHeader title={title} subtitle={subtitle} isLoading={isLoadingPlugin} />
            {isLoadingPlugin || isLoadingPluginVersions ? (
              <i className='mcs-table-cell-loading-large' />
            ) : initialPluginVersionId ? (
              <PluginTabContainer
                plugin={plugin}
                pluginVersions={pluginVersions}
                initialPluginVersionId={initialPluginVersionId}
                lastPluginVersion={lastPluginVersion}
              />
            ) : (
              <EmptyTableView
                message={formatMessage(messages.emptyVersionMessage)}
                iconType={'library'}
              />
            )}
          </Content>
        </div>
      </div>
    );
  }
}

export default compose<Props, {}>(withRouter, injectIntl, injectNotifications)(PluginPage);

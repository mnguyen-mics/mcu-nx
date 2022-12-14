import {
  IPluginService,
  lazyInject,
  PluginVersionResource,
  TYPES,
  PluginAction,
  PluginManagerResource,
  PluginResource,
} from '@mediarithmics-private/advanced-components';
import { ConfigurationFileListingEntryResource } from '@mediarithmics-private/advanced-components/lib/models/plugin/Plugins';
import { McsTabs } from '@mediarithmics-private/mcs-components-library';
import { Modal, Select, Spin, message, Tag, Input } from 'antd';
import * as React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { getPaginatedApiParam } from '../../../utils/ApiHelper';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import messages from '../messages';
import ConfigurationFilesContainer from './ConfigurationFilesContainer';
import PluginDeploymentContainer from './PluginDeploymentContainer';
import PluginLayoutsContainer from './PluginLayoutsContainer';
import PluginPropertiesContainer from './PluginPropertiesContainer';

interface RouteProps {
  organisationId: string;
  pluginId: string;
}

interface PluginTabContainerProps {
  plugin?: PluginResource;
  pluginVersions: PluginVersionResource[];
  initialPluginVersionId: string;
  lastPluginVersion?: string;
}

type Props = PluginTabContainerProps &
  WrappedComponentProps &
  InjectedNotificationProps &
  RouteComponentProps<RouteProps>;

interface State {
  tabKey: string;
  currentPluginVersionId: string;
  initialPluginVersionContainers: PluginManagerResource[];
  pluginVersionContainerTotal: number;
  pluginConfigurationFiles: ConfigurationFileListingEntryResource[];
  pluginConfigurationFilesLoading: boolean;
  isModalLoading: boolean;
  targetBuildTag?: string;
}

class PluginTabContainer extends React.Component<Props, State> {
  @lazyInject(TYPES.IPluginService)
  private _pluginService: IPluginService;

  constructor(props: Props) {
    super(props);
    this.state = {
      tabKey: 'properties',
      currentPluginVersionId: props.initialPluginVersionId,
      initialPluginVersionContainers: [],
      pluginVersionContainerTotal: 0,
      pluginConfigurationFiles: [],
      isModalLoading: false,
      pluginConfigurationFilesLoading: true,
    };
  }

  componentDidMount() {
    const { currentPluginVersionId } = this.state;
    this.getInitialPluginVersionContainers(currentPluginVersionId);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { currentPluginVersionId } = this.state;
    if (currentPluginVersionId !== prevState.currentPluginVersionId)
      this.getInitialPluginVersionContainers(currentPluginVersionId);
  }

  getInitialPluginVersionContainers = (pluginVersionId: string) => {
    const {
      match: {
        params: { organisationId, pluginId },
      },
      notifyError,
    } = this.props;

    const options = {
      organisation_id: organisationId,
      ...getPaginatedApiParam(1, 10),
    };

    this._pluginService
      .getPluginVersionContainers(pluginId, pluginVersionId, options)
      .then(res => {
        this.setState({
          initialPluginVersionContainers: res.data,
          pluginVersionContainerTotal: res.total || res.count,
        });
      })
      .catch(err => {
        notifyError(err);
      });
  };

  buildPluginTabsItems = () => {
    const { intl, plugin } = this.props;
    const { currentPluginVersionId, initialPluginVersionContainers, pluginVersionContainerTotal } =
      this.state;
    return [
      {
        key: 'properties',
        title: intl.formatMessage(messages.properties),
        display: <PluginPropertiesContainer pluginVersionId={currentPluginVersionId} />,
      },
      {
        key: 'deployment',
        title: intl.formatMessage(messages.deployment),
        display: (
          <PluginDeploymentContainer
            plugin={plugin}
            pluginVersionId={currentPluginVersionId}
            upgradeContainers={this.upgradeContainers}
            deployVersion={this.deployVersion}
            initialPluginVersionContainers={initialPluginVersionContainers}
            initialPluginVersionContainerTotal={pluginVersionContainerTotal}
          />
        ),
      },
      {
        key: 'configuration_file',
        title: intl.formatMessage(messages.technicalConfiguration),
        display: (
          <ConfigurationFilesContainer pluginVersionId={currentPluginVersionId} plugin={plugin} />
        ),
      },
      {
        key: 'layout',
        title: intl.formatMessage(messages.layout),
        display: (
          <PluginLayoutsContainer pluginVersionId={currentPluginVersionId} plugin={plugin} />
        ),
      },
    ];
  };

  handleVersionChange = (versionId: string) => {
    this.setState({ currentPluginVersionId: versionId });
  };

  getPluginVersionOptions = () => {
    const { pluginVersions, intl, lastPluginVersion } = this.props;
    return pluginVersions
      .map((version, i) => ({
        value: version.id,
        comparator: version.version_id,
        label: (
          <span className={`mcs-pluginTabContainer_pluginVersion_${version.version_id}`}>
            {`version ${version.version_id} (${version.id}) `}
            {version.version_id === lastPluginVersion && (
              <Tag color='blue'>{intl.formatMessage(messages.current)}</Tag>
            )}
          </span>
        ),
      }))
      .sort((a, b) => b.comparator.localeCompare(a.comparator));
  };

  renderContainerActionModal = (
    action: PluginAction,
    title: string,
    button: string,
    success: string,
  ) => {
    const {
      intl: { formatMessage },
      match: {
        params: { pluginId },
      },
      notifyError,
      pluginVersions,
    } = this.props;
    const { currentPluginVersionId, isModalLoading } = this.state;

    const currentVersion = pluginVersions.find(_ => _.id === currentPluginVersionId)?.version_id;

    const handleOk = () => {
      const { targetBuildTag } = this.state;
      this.setState({ isModalLoading: true });
      const pluginContainerAction = {
        action: action,
        args: {
          target_build_tag: targetBuildTag,
          // target_image_name: ?
        },
      };

      return this._pluginService
        .postPluginVersionContainerAction(pluginId, currentPluginVersionId, pluginContainerAction)
        .then(_ => {
          this.setState({
            isModalLoading: false,
            targetBuildTag: undefined,
          });
          message.success(success, 3);
        })
        .catch(e => {
          this.setState({ isModalLoading: false });
          notifyError(e);
        });
    };

    const onTargetBuildTagChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      this.setState({ targetBuildTag: e.target.value });

    const okText = isModalLoading ? <Spin /> : button;

    Modal.confirm({
      title: (
        <span>
          {title + ' '} <Tag color='blue'>{currentVersion}</Tag>
        </span>
      ),
      content: (
        <div style={{ paddingBottom: '15px', paddingTop: '10px' }}>
          {formatMessage(messages.deploymentTargetBuildTag)}
          <Input onChange={onTargetBuildTagChange} />
        </div>
      ),
      onOk: handleOk,
      okText: okText,
    });
  };

  deployVersion = () => {
    const {
      intl: { formatMessage },
    } = this.props;
    this.renderContainerActionModal(
      'DEPLOY_PLUGIN',
      formatMessage(messages.deploymentDeployModalTitle),
      formatMessage(messages.deploymentDeployModalButton),
      formatMessage(messages.deploymentDeployModalSuccess),
    );
  };

  upgradeContainers = () => {
    const {
      intl: { formatMessage },
    } = this.props;
    this.renderContainerActionModal(
      'UPGRADE_ALL_CONTAINERS',
      formatMessage(messages.deploymentUpgradeModalTitle),
      formatMessage(messages.deploymentUpgradeModalButton),
      formatMessage(messages.deploymentUpgradeModalSuccess),
    );
  };

  onTabChange = (activeKey: string) => {
    this.setState({ tabKey: activeKey });
  };

  render() {
    const { initialPluginVersionId, pluginVersions, lastPluginVersion, intl } = this.props;
    const { tabKey } = this.state;

    const initialVersion = pluginVersions.find(version => version.id === initialPluginVersionId);

    const defaultValue = (
      <span>
        {`version ${initialVersion?.version_id} (${initialVersion?.id}) `}
        {!!initialVersion && initialVersion?.version_id === lastPluginVersion && (
          <Tag color='blue'>{intl.formatMessage(messages.current)}</Tag>
        )}
      </span>
    ) as any;

    const pluginVersionSelector = (
      <Select
        className='mcs-pluginTabContainer_pluginVersionSelector'
        dropdownClassName='mcs-pluginTabContainer_pluginVersionSelector_dropdown'
        defaultValue={defaultValue}
        onChange={this.handleVersionChange}
        options={this.getPluginVersionOptions()}
        dropdownMatchSelectWidth={true}
      />
    );

    return (
      <McsTabs
        defaultActiveKey={tabKey}
        onChange={this.onTabChange}
        tabBarExtraContent={pluginVersionSelector}
        items={this.buildPluginTabsItems()}
      />
    );
  }
}

export default compose<Props, PluginTabContainerProps>(
  withRouter,
  injectIntl,
  injectNotifications,
)(PluginTabContainer);

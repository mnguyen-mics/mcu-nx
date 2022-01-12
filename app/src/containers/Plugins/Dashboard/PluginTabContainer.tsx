import {
  IPluginService,
  lazyInject,
  PluginVersionResource,
  TYPES,
  PluginAction,
  PluginManagerResource,
  PluginResource,
} from '@mediarithmics-private/advanced-components';
import { McsTabs } from '@mediarithmics-private/mcs-components-library';
import { Modal, Select, Button, Spin, message, Tag, Input } from 'antd';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { getPaginatedApiParam } from '../../../utils/ApiHelper';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import messages from '../messages';
import PluginDeploymentContainer from './PluginDeploymentContainer';
import PluginPropertiesContainer from './PluginPropertiesContainer';

interface RouteProps {
  organisationId: string;
  pluginId: string;
}

interface PluginTabContainerProps {
  plugin?: PluginResource;
  pluginVersions: PluginVersionResource[];
  initialPluginVersionId: string;
}

type Props = PluginTabContainerProps &
  InjectedIntlProps &
  InjectedNotificationProps &
  RouteComponentProps<RouteProps>;

interface State {
  currentPluginVersionId: string;
  initialPluginVersionContainers: PluginManagerResource[];
  pluginVersionContainerTotal: number;
  isModalLoading: boolean;
  targetBuildTag?: string;
}

class PluginTabContainer extends React.Component<Props, State> {
  @lazyInject(TYPES.IPluginService)
  private _pluginService: IPluginService;

  constructor(props: Props) {
    super(props);
    this.state = {
      currentPluginVersionId: props.initialPluginVersionId,
      initialPluginVersionContainers: [],
      pluginVersionContainerTotal: 0,
      isModalLoading: false,
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
    const { intl } = this.props;
    const { currentPluginVersionId, initialPluginVersionContainers, pluginVersionContainerTotal } =
      this.state;
    return [
      {
        title: intl.formatMessage(messages.properties),
        display: <PluginPropertiesContainer pluginVersionId={currentPluginVersionId} />,
      },
      {
        title: intl.formatMessage(messages.deployment),
        display: (
          <PluginDeploymentContainer
            pluginVersionId={currentPluginVersionId}
            initialPluginVersionContainer={initialPluginVersionContainers}
            initialPluginVersionContainerTotal={pluginVersionContainerTotal}
          />
        ),
      },
    ];
  };

  handleVersionChange = (versionId: string) => {
    this.setState({ currentPluginVersionId: versionId });
  };

  getPluginVersionOptions = () => {
    const { pluginVersions } = this.props;
    return pluginVersions
      .map(version => ({
        value: version.id,
        label: version.version_id,
      }))
      .sort((a, b) => b.label.localeCompare(a.label));
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

  render() {
    const { initialPluginVersionId, pluginVersions, plugin } = this.props;
    const { initialPluginVersionContainers } = this.state;

    const initialVersion = pluginVersions.find(version => version.id === initialPluginVersionId);

    const pluginVersionSelector = (
      <React.Fragment>
        {plugin &&
          plugin.current_version_id &&
          plugin.plugin_type !== 'INTEGRATION_BATCH' &&
          (initialPluginVersionContainers.length > 0 ? (
            <Button onClick={this.upgradeContainers}>
              <FormattedMessage {...messages.deploymentUpgradeModalButton} />
            </Button>
          ) : (
            <Button onClick={this.deployVersion}>
              <FormattedMessage {...messages.deploymentDeployModalButton} />
            </Button>
          ))}
        <Select
          style={{ paddingLeft: '10px' }}
          defaultValue={initialVersion?.version_id}
          onChange={this.handleVersionChange}
          options={this.getPluginVersionOptions()}
        />
      </React.Fragment>
    );

    return (
      <McsTabs tabBarExtraContent={pluginVersionSelector} items={this.buildPluginTabsItems()} />
    );
  }
}

export default compose<Props, PluginTabContainerProps>(
  injectIntl,
  injectNotifications,
  withRouter,
)(PluginTabContainer);

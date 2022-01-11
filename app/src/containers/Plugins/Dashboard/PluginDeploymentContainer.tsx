import { McsIconType } from '@mediarithmics-private/mcs-components-library/lib/components/mcs-icon';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import messages from '../messages';
import { PAGINATION_SEARCH_SETTINGS } from '../../../utils/LocationSearchHelper';
import ItemList, { Filters } from '../../../components/ItemList';
import { IPluginService, lazyInject, TYPES } from '@mediarithmics-private/advanced-components';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import { DataColumnDefinition } from '@mediarithmics-private/mcs-components-library/lib/components/table-view/table-view/TableView';
import { RouteComponentProps, withRouter } from 'react-router';
import { PluginManagerResource } from '@mediarithmics-private/advanced-components/lib/models/plugin/Plugins';
import { getPaginatedApiParam } from '../../../utils/ApiHelper';

interface RunningContainer {
  name: string;
  container: string;
}

interface PluginDeploymentContainerProps {
  pluginVersionId: string;
  initialPluginVersionContainer: PluginManagerResource[];
  initialPluginVersionContainerTotal: number;
}

interface RouteProps {
  organisationId: string;
  pluginId: string;
}

type Props = PluginDeploymentContainerProps &
  InjectedIntlProps &
  InjectedNotificationProps &
  RouteComponentProps<RouteProps>;

interface State {
  isLoading: boolean;
  pluginVersionContainers: RunningContainer[];
  pluginVersionContainersTotal: number;
}

class PluginDeploymentContainer extends React.Component<Props, State> {
  @lazyInject(TYPES.IPluginService)
  private _pluginService: IPluginService;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
      pluginVersionContainers: [],
      pluginVersionContainersTotal: props.initialPluginVersionContainerTotal,
    };
  }

  componentDidMount() {
    const { initialPluginVersionContainer } = this.props;
    this.setState({
      isLoading: false,
      pluginVersionContainers: this.formatToRunningContainer(initialPluginVersionContainer),
    });
  }

  componentDidUpdate(prevProp: Props) {
    const {
      match: {
        params: { organisationId },
      },
      pluginVersionId,
    } = this.props;
    if (pluginVersionId !== prevProp.pluginVersionId)
      this.fetchPluginVersionContainers(organisationId, { currentPage: 1, pageSize: 10 });
  }

  fetchPluginVersionContainers = (organisationId: string, filters: Filters) => {
    const {
      pluginVersionId,
      notifyError,
      match: {
        params: { pluginId },
      },
    } = this.props;
    this.setState({
      isLoading: true,
    });

    const options = {
      organisation_id: organisationId,
      ...getPaginatedApiParam(filters.currentPage, filters.pageSize),
    };

    this._pluginService
      .getPluginVersionContainers(pluginId, pluginVersionId, options)
      .then(res => {
        this.setState({
          isLoading: false,
          pluginVersionContainers: this.formatToRunningContainer(res.data),
        });
      })
      .catch(err => {
        notifyError(err);
        this.setState({
          isLoading: false,
        });
      });
  };

  formatToRunningContainer = (
    runningContainerRessource: PluginManagerResource[],
  ): RunningContainer[] => {
    const containers: RunningContainer[] = [];
    runningContainerRessource.forEach(pm =>
      pm.running_containers.forEach(runningContainer => {
        containers.push({
          name: pm.name,
          container: runningContainer.container,
        });
      }),
    );
    return containers;
  };

  render() {
    const {
      intl: { formatMessage },
    } = this.props;
    const { isLoading, pluginVersionContainers, pluginVersionContainersTotal } = this.state;

    const dataColumnsDefinition: Array<DataColumnDefinition<RunningContainer>> = [
      {
        title: formatMessage(messages.deploymentRunningContainer),
        key: 'container',
        isHideable: false,
        render: (text: string, record: RunningContainer) => (
          <span className='mcs-pluginDeploymentList_runningContainer'>{text}</span>
        ),
      },
      {
        title: formatMessage(messages.deploymentRunningContainerName),
        key: 'name',
        isHideable: false,
        render: (text: string, record: RunningContainer) => (
          <span className='mcs-pluginDeploymentList_name'>{text}</span>
        ),
      },
    ];

    const emptyTable: {
      iconType: McsIconType;
      message: string;
    } = {
      iconType: 'library',
      message: formatMessage(messages.deploymentEmptyTable),
    };

    return (
      <ItemList
        fetchList={this.fetchPluginVersionContainers}
        dataSource={pluginVersionContainers}
        loading={isLoading}
        total={pluginVersionContainersTotal}
        columns={dataColumnsDefinition}
        pageSettings={PAGINATION_SEARCH_SETTINGS}
        emptyTable={emptyTable}
      />
    );
  }
}

export default compose<Props, PluginDeploymentContainerProps>(
  injectIntl,
  injectNotifications,
  withRouter,
)(PluginDeploymentContainer);

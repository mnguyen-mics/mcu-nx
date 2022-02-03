import 'reflect-metadata';
import { Layout } from 'antd';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import {
  DashboardPageWrapper,
  ICustomDashboardService,
  IPluginService,
  lazyInject,
  TYPES,
  withDatamartSelector,
  WithDatamartSelectorProps,
} from '@mediarithmics-private/advanced-components/lib';
import { Card, PieChart } from '@mediarithmics-private/mcs-components-library';
import { Dataset } from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import _ from 'lodash';
import injectNotifications, {
  InjectedNotificationProps,
} from '../Notifications/injectNotifications';
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';

const messages = defineMessages({
  pluginsPerType: {
    id: 'home.pluginsPerType',
    defaultMessage: 'Plugins per type',
  },
});

interface RouteProps {
  organisationId: string;
}

interface State {
  isLoading: boolean;
  pluginDataset: Dataset;
}

type Props = RouteComponentProps<RouteProps> &
  WithDatamartSelectorProps &
  InjectedIntlProps &
  InjectedNotificationProps;
const { Content } = Layout;
class HomePage extends React.Component<Props, State> {
  @lazyInject(TYPES.ICustomDashboardService)
  private _dashboardService: ICustomDashboardService;
  @lazyInject(TYPES.IPluginService)
  private _pluginService: IPluginService;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
      pluginDataset: [],
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { organisationId },
      },
    } = this.props;
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

    if (prevOrganisationId !== organisationId) {
      this.fetchPluginsChart(organisationId);
    }
  }

  fetchApiDashboards = () => {
    const {
      match: {
        params: { organisationId },
      },
    } = this.props;
    return this._dashboardService.getDashboardsPageContents(
      organisationId,
      { archived: false },
      'console',
    );
  };

  fetchPluginsChart = (organisationId: string) => {
    this.setState({
      isLoading: true,
    });
    this._pluginService
      .getPlugins({ organisation_id: organisationId })
      .then(res => {
        const pluginsByType = _.groupBy(res.data, 'plugin_type');

        this.setState({
          isLoading: false,
          pluginDataset: Object.keys(pluginsByType).map(pluginType => {
            return {
              key: pluginType,
              value: pluginsByType[pluginType].length,
            };
          }),
        });
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        this.props.notifyError(err);
      });
  };

  render() {
    const {
      selectedDatamartId,
      match: {
        params: { organisationId },
      },
      intl,
    } = this.props;
    const { isLoading, pluginDataset } = this.state;
    return (
      <div className='ant-layout'>
        <div className='ant-layout'>
          <Content className='mcs-content-container'>
            <DashboardPageWrapper
              organisationId={organisationId}
              datamartId={selectedDatamartId}
              fetchApiDashboards={this.fetchApiDashboards}
              isFullScreenLoading={false}
            />
            {!isLoading && (
              <Card
                title={intl.formatMessage(messages.pluginsPerType)}
                className='mcs-HomePage-pluginPieChart'
              >
                <PieChart
                  dataset={pluginDataset}
                  innerRadius={false}
                  legend={{ enabled: true, position: 'right' }}
                />
              </Card>
            )}
          </Content>
        </div>
      </div>
    );
  }
}

export default compose<Props, {}>(
  withRouter,
  withDatamartSelector,
  injectNotifications,
  injectIntl,
)(HomePage);

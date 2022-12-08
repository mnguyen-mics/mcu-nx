import 'reflect-metadata';
import { Layout } from 'antd';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import {
  DashboardPageWrapper,
  ICustomDashboardService,
  ITagService,
  lazyInject,
  TYPES,
  withDatamartSelector,
  WithDatamartSelectorProps,
} from '@mediarithmics-private/advanced-components';
import _ from 'lodash';
import injectNotifications, {
  InjectedNotificationProps,
} from '../Notifications/injectNotifications';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { DashboardPageContent } from '@mediarithmics-private/advanced-components/lib/models/dashboards/dashboardsModel';
import getDefaultSections from './defaultDashboard';
import { InjectedFeaturesProps, injectFeatures } from '@mediarithmics-private/advanced-components';

interface RouteProps {
  organisationId: string;
}

type Props = RouteComponentProps<RouteProps> &
  WithDatamartSelectorProps &
  WrappedComponentProps &
  InjectedNotificationProps &
  InjectedFeaturesProps;
const { Content } = Layout;
class HomePage extends React.Component<Props> {
  @lazyInject(TYPES.ICustomDashboardService)
  private _dashboardService: ICustomDashboardService;
  @lazyInject(TYPES.ITagService)
  private _tagService: ITagService;

  constructor(props: Props) {
    super(props);
    this.state = {};
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

  render() {
    const {
      selectedDatamartId,
      match: {
        params: { organisationId },
      },
    } = this.props;

    const handleOnShowDashboard = (dashboard: DashboardPageContent) => {
      if (dashboard.dashboardRegistrationId) {
        const stats = this._dashboardService.countDashboardsStats(dashboard);
        this._tagService.pushDashboardView(
          'console',
          dashboard.dashboardRegistrationId,
          dashboard.title,
          stats.numberCharts,
          stats.otqlQueries,
          stats.activitiesAnalyticsQueries,
          stats.collectionVolumesQueries,
          stats.resourcesUsageQueries,
          stats.datafileQueries,
        );
      }
    };

    const defaultDashboard: DashboardPageContent = {
      title: 'Standard Dashboard',
      scopes: ['console'],
      dashboardContent: {
        sections: getDefaultSections(selectedDatamartId, this.props).sections,
      },
    };

    return (
      <div className='ant-layout'>
        <div className='ant-layout'>
          <Content className='mcs-content-container'>
            <DashboardPageWrapper
              organisationId={organisationId}
              datamartId={selectedDatamartId}
              fetchApiDashboards={this.fetchApiDashboards}
              isFullScreenLoading={false}
              onShowDashboard={handleOnShowDashboard}
              defaultDashboard={defaultDashboard}
              queryExecutionSource={'DASHBOARD'}
              queryExecutionSubSource={'HOME_DASHBOARD'}
            />
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
  injectFeatures,
)(HomePage);

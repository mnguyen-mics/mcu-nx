import 'reflect-metadata';
import { Layout } from 'antd';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import {
  DashboardPageWrapper,
  ICustomDashboardService,
  ITagService,
  lazyInject,
  TYPES,
  withDatamartSelector,
  WithDatamartSelectorProps,
} from '@mediarithmics-private/advanced-components/lib';
import _ from 'lodash';
import injectNotifications, {
  InjectedNotificationProps,
} from '../Notifications/injectNotifications';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { DashboardPageContent } from '@mediarithmics-private/advanced-components/lib/models/dashboards/old-dashboards-model';

interface RouteProps {
  organisationId: string;
}

type Props = RouteComponentProps<RouteProps> &
  WithDatamartSelectorProps &
  InjectedIntlProps &
  InjectedNotificationProps;
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
          stats.datafileQueries,
        );
      }
    };

    const {
      selectedDatamartId,
      match: {
        params: { organisationId },
      },
    } = this.props;
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
)(HomePage);

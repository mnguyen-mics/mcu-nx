import 'reflect-metadata';
import { Layout } from 'antd';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import {
  DashboardPageWrapper,
  ICustomDashboardService,
  lazyInject,
  TYPES,
  withDatamartSelector,
  WithDatamartSelectorProps,
} from '@mediarithmics-private/advanced-components/lib';
interface RouteProps {
  organisationId: string;
}

type Props = RouteComponentProps<RouteProps> & WithDatamartSelectorProps;
const { Content } = Layout;
class HomePage extends React.Component<Props> {
  @lazyInject(TYPES.ICustomDashboardService)
  private _dashboardService: ICustomDashboardService;

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
    return (
      <div className='ant-layout'>
        <div className='ant-layout'>
          <Content className='mcs-content-container'>
            <DashboardPageWrapper
              datamartId={selectedDatamartId}
              organisationId={organisationId}
              fetchApiDashboards={this.fetchApiDashboards}
              isFullScreenLoading={false}
            />
          </Content>
        </div>
      </div>
    );
  }
}

export default compose<Props, {}>(withRouter, withDatamartSelector)(HomePage);

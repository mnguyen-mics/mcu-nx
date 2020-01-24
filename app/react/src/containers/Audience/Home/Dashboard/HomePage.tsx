import { Layout } from 'antd';
import * as React from 'react';
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import {
  InjectedWorkspaceProps,
  injectWorkspace,
} from '../../../Datamart/index';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../../Notifications/injectNotifications';
import { TYPES } from '../../../../constants/types';
import { lazyInject } from '../../../../config/inversify.config';
import { IDashboardService } from '../../../../services/DashboardServices';
import { DashboardResource } from '../../../../models/dashboards/dashboards';
import { withDatamartSelector, WithDatamartSelectorProps } from '../../../Datamart/WithDatamartSelector';
import { Loading } from '../../../../components';
import DashboardWrapper from '../../Dashboard/DashboardWrapper';
import Error from '../../../../components/Error';
import DatamartAnalysisWrapper from '../../DatamartUsersAnalytics/DatamartUsersAnalyticsWrapper';
import { InjectedFeaturesProps, injectFeatures } from '../../../Features';

const { Content } = Layout;

const messages = defineMessages({
  comingSoon: {
    id: "audience.home.dashboard",
    defaultMessage: "Coming Soon..."
  }
});

interface HomeProps { }

interface HomeState {
  dashboards: DashboardResource[];
  isLoading: boolean;
}

type JoinedProps = HomeProps &
  InjectedWorkspaceProps &
  InjectedIntlProps &
  InjectedNotificationProps &
  RouteComponentProps<{ organisationId: string; }> &
  WithDatamartSelectorProps &
  InjectedFeaturesProps;



class Partition extends React.Component<JoinedProps, HomeState> {
  @lazyInject(TYPES.IDashboardService)
  private _dashboardService: IDashboardService;


  constructor(props: JoinedProps) {
    super(props);
    this.state = {
      dashboards: [],
      isLoading: true
    };
  }

  componentDidMount() {
    const {
      selectedDatamartId
    } = this.props;
    this.loadData(selectedDatamartId);
  }

  componentDidUpdate(prevProps: JoinedProps) {
    const {
      selectedDatamartId
    } = this.props;

    const {
      selectedDatamartId: prevSelectedDatamart
    } = prevProps;

    if (selectedDatamartId !== prevSelectedDatamart) {
      this.loadData(selectedDatamartId);
    }
  }

  loadData = (selectedDatamartId: string) => {
    this.setState({ isLoading: true });
    this._dashboardService.getDashboards(selectedDatamartId, {
      type: "HOME"
    })
      .then(d => {
        return d.data
      })
      .then(d => {
        this.setState({ isLoading: false, dashboards: d })
      })
      .catch(err => {
        this.props.notifyError(err);
        this.setState({
          isLoading: false,
        });
      });
  };

  render() {
    const {
      hasFeature,
      intl,
      selectedDatamartId,
      selectedDatafarm,
    } = this.props;

    const { isLoading, dashboards } = this.state;

    if (isLoading) {
      return <Loading />
    }

    const shouldDisplayAnalyticsFeature = hasFeature('audience-dashboards-datamart_users_analytics') && selectedDatafarm !== 'DF_EU_2017_09';

    if (!isLoading && dashboards.length === 0 && !shouldDisplayAnalyticsFeature) {
      return <Error message={intl.formatMessage(messages.comingSoon)} />
    }

    return (
      <div className="ant-layout">
        <div className="ant-layout">
          <Content className="mcs-content-container">
            {dashboards.map(d => <DashboardWrapper key={d.id} layout={d.components} title={d.name} datamartId={d.datamart_id} />)}
            {
              shouldDisplayAnalyticsFeature && <DatamartAnalysisWrapper title={"Datamart Users analytics"} datamartId={selectedDatamartId} />
            }
          </Content>
        </div>
      </div>
    );
  }
}

export default compose(
  withDatamartSelector,
  withRouter,
  injectIntl,
  injectWorkspace,
  injectNotifications,
  injectFeatures
)(Partition);

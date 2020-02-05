import * as React from 'react';
import { compose } from 'recompose';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { withRouter, RouteComponentProps } from 'react-router';
import injectNotifications from '../../../../Notifications/injectNotifications';
import DatamartActionBar from './DatamartActionBar';
import { DatamartResource } from '../../../../../models/datamart/DatamartResource';
import DatamartHeader from './DatamartHeader';
import { IDatamartService } from '../../../../../services/DatamartService';
import { Row, Col, Layout } from 'antd';
import { notifyError } from '../../../../../state/Notifications/actions';
import McsTabs from '../../../../../components/McsTabs';
import DatamartConfigTab from './DatamartConfigTab';
import DatamartObjectViewTab from './DatamartObjectViewTab';
import DatamartActivity from './DatamartActivity';
import { injectFeatures, InjectedFeaturesProps } from '../../../../Features';
import DatamartTableViewTab from './DatamartTableViewTab';
import { TYPES } from '../../../../../constants/types';
import { lazyInject } from '../../../../../config/inversify.config';
import DatamartUsersAnalyticsWrapper from '../../../../Audience/DatamartUsersAnalytics/DatamartUsersAnalyticsWrapper';
import { sessionInTimeJsonConfig } from '../../../../Audience/DatamartUsersAnalytics/components/config/AnalyticsConfigJson';
import { DashboardConfig } from '../../../../Audience/DatamartUsersAnalytics/DatamartUsersAnalyticsContent';
const { Content } = Layout;

type Props = RouteComponentProps<{
  organisationId: string;
  datamartId: string;
}> &
  InjectedIntlProps &
  InjectedFeaturesProps;

interface State {
  datamart?: DatamartResource;
  isLoading: boolean;
  datamartAnalyticsConfig: DashboardConfig[];
}

class DatamartDashboardPage extends React.Component<Props, State> {
  @lazyInject(TYPES.IDatamartService)
  private _datamartService: IDatamartService;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      datamartAnalyticsConfig: sessionInTimeJsonConfig as any,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { datamartId },
      },
    } = this.props;

    this.fetchDatamart(datamartId);
  }

  fetchDatamart = (datamartId: string) => {
    this._datamartService
      .getDatamart(datamartId)
      .then(res =>
        this.setState({
          datamart: res.data,
          isLoading: false,
        }),
      )
      .catch(err => {
        this.setState({ isLoading: false });
        notifyError(err);
      });
  };

  render() {
    const {
      match: {
        params: { datamartId },
      },
      hasFeature,
    } = this.props;

    const { datamart, isLoading } = this.state;

    const items = [
      {
        title: 'Datamart Configuration',
        display: <DatamartConfigTab datamartId={datamartId} />,
      },
      {
        title: 'Datamart Activity',
        display: <DatamartActivity datamartId={datamartId} />,
      },
    ];

    if (
      hasFeature('datamart-object_tree_schema') &&
      datamart &&
      datamart.storage_model_version !== 'v201506'
    ) {
      items.push({
        title: 'Object View Configuration',
        display: <DatamartObjectViewTab datamartId={datamartId} />,
      });
    }

    if (
      hasFeature('datamart-table_view_schema') &&
      datamart &&
      datamart.storage_model_version !== 'v201506'
    ) {
      items.push({
        title: 'Table View Configuration',
        display: <DatamartTableViewTab datamartId={datamartId} />,
      });
    }

    if (
      hasFeature('audience-dashboards-datamart_users_analytics') &&
      datamart &&
      datamart.datafarm === 'DF_EU_2017_09'
    ) {
      items.push({
        title: 'Statistics',
        display: (
          <Content className="mcs-content-container">
            <DatamartUsersAnalyticsWrapper
              datamartId={datamart.id}
              config={sessionInTimeJsonConfig as any}
            />
          </Content>
        ),
      });
    }

    return (
      <div className="ant-layout">
        <DatamartActionBar />
        <div className="ant-layout">
          <div className="ant-layout-content">
            <Row className="mcs-content-channel">
              <Col className="mcs-datamart-title">
                <DatamartHeader datamart={datamart} isLoading={isLoading} />
              </Col>
            </Row>
            <Row>
              <McsTabs items={items} tabBarStyle={{ margin: '0 40px' }} />
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default compose<Props, {}>(
  withRouter,
  injectIntl,
  injectNotifications,
  injectFeatures,
)(DatamartDashboardPage);

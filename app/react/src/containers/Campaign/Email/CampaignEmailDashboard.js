import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import lodash from 'lodash';
import { CampaignDashboardTabs } from '../../../components/CampaignDashboardTabs';
import { StackedAreaPlot } from '../../../components/StackedAreaPlot';
import { PieChart } from '../../../components/PieChart';
import * as CampaignEmailActions from '../../../state/Campaign/Email/actions';
import { McsDateRangePicker } from '../../../components/McsDateRangePicker';
import { EmptyCharts } from '../../../components/EmptyCharts';
import { LegendChart } from '../../../components/LegendChart';
import { EmailPieCharts, EmailStackedAreaChart } from './Charts';

import {
  CAMPAIGN_EMAIL_QUERY_SETTINGS
} from '../RouteQuerySelector';

import {
  updateQueryWithParams,
  deserializeQuery
} from '../../../services/RouteQuerySelectorService';

import {
  getTableDataSource
 } from '../../../state/Campaign/Email/selectors';

class CampaignEmailDashboard extends Component {

  componentDidMount() {
    const {
      params: {
        campaignId
      },
      query,
      loadCampaignEmailAndDeliveryReport
    } = this.props;

    const filter = deserializeQuery(query, CAMPAIGN_EMAIL_QUERY_SETTINGS);
    console.log(filter);
    loadCampaignEmailAndDeliveryReport(campaignId, filter);
  }

  componentWillUnmount() {
    this.props.resetCampaignEmail();
  }

  componentWillReceiveProps(nextProps) {
    const {
      query,
      activeWorkspace: {
        workspaceId
      },
      loadCampaignEmailAndDeliveryReport
    } = this.props;

    const {
      params: {
        campaignId
      },
      query: nextQuery,
      activeWorkspace: {
        workspaceId: nextWorkspaceId,
        organisationId
      },
    } = nextProps;

    if (!lodash.isEqual(query, nextQuery) || workspaceId !== nextWorkspaceId) {
      const filter = deserializeQuery(nextQuery, CAMPAIGN_EMAIL_QUERY_SETTINGS);
      loadCampaignEmailAndDeliveryReport(campaignId, filter);
    }
  }

  render() {

    const {
      translations,
    } = this.props;

    const items = [
      {
        title: translations.CAMPAIGN_OVERVIEW,
        display: <EmailPieCharts {...this.props} />
      },
      {
        title: translations.CAMPAIGN_DELIVERY_ANALYSIS,
        display: <EmailStackedAreaChart {...this.props} />
      }
    ];

    return <CampaignDashboardTabs items={items} />;
  }

}

CampaignEmailDashboard.propTypes = {
  translations: PropTypes.object.isRequired,  // eslint-disable-line react/forbid-prop-types
  router: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  query: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  activeWorkspace: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  params: PropTypes.shape({
    campaignId: PropTypes.string
  }).isRequired,
  loadCampaignEmailAndDeliveryReport: PropTypes.func.isRequired,
  isFetchingCampaignStat: PropTypes.bool.isRequired,
  hasFetchedCampaignStat: PropTypes.bool.isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
  resetCampaignEmail: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  activeWorkspace: state.sessionState.activeWorkspace,
  translations: state.translationsState.translations,
  params: ownProps.router.params,
  query: ownProps.router.location.query,
  isFetchingCampaignStat: state.campaignEmailSingle.campaignEmailPerformance.isFetching,
  hasFetchedCampaignStat: state.campaignEmailSingle.campaignEmailPerformance.hasFetched,
  dataSource: getTableDataSource(state)
});


const mapDispatchToProps = {
  loadCampaignEmailAndDeliveryReport: CampaignEmailActions.loadCampaignEmailAndDeliveryReport,
  resetCampaignEmail: CampaignEmailActions.resetCampaignEmail
};

CampaignEmailDashboard = connect(
  mapStateToProps,
  mapDispatchToProps
)(CampaignEmailDashboard);

export default CampaignEmailDashboard;

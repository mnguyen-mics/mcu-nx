import * as React from 'react';
import { injectIntl, InjectedIntlProps, defineMessages } from 'react-intl';
import { compose } from 'recompose';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Layout } from 'antd';

import EmailCampaignActionbar from './EmailCampaignActionbar';
import CampaignDashboardHeader from '../../Common/CampaignDashboardHeader';
import { Labels } from '../../../Labels';
import { Card } from '../../../../components/Card';

import {
  EMAIL_DASHBOARD_SEARCH_SETTINGS,
  EmailCampaignDashboardRouteMatchParam,
  EmailDashboardSearchSettings,
} from './constants';

import {
  parseSearch,
  isSearchValid,
  buildDefaultSearch,
  compareSearches,
  updateSearch,
} from '../../../../utils/LocationSearchHelper';

import EmailCampaignService from '../../../../services/EmailCampaignService';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../../Notifications/injectNotifications';
import { EmailCampaignResource } from '../../../../models/campaign/email';
import { Index } from '../../../../utils';
import Overview from './Overview';
import { EmailStackedAreaChart } from './Charts';
import BlastCard from './BlastCard';
import McsTabs from '../../../../components/McsTabs';
import { McsDateRangeValue } from '../../../../components/McsDateRangePicker';
import ReportService from '../../../../services/ReportService';
import log from '../../../../utils/Logger';
import { normalizeReportView } from '../../../../utils/MetricHelper';
import { CampaignStatus } from '../../../../models/campaign';

const { Content } = Layout;

const messageMap = defineMessages({
  overview: {
    id: 'email-campaign-overview',
    defaultMessage: 'Overview',
  },
  devileryAnalysis: {
    id: 'email-campaign-delivery-analysis',
    defaultMessage: 'Delivery Analysis',
  },
  statusUpdateSuccess: {
    id: 'email-campaign-status-update-successfull',
    defaultMessage: 'Campaign status successfully updated',
  },
  statusUpdateFailure: {
    id: 'email-campaign-status-update-failure',
    defaultMessage:
      'There was an error updating your campaign... Please try again...',
  },
  notifSuccess: {
    id: 'email-campaign-notification-success',
    defaultMessage: 'Success',
  },
  notifError: {
    id: 'email-campaign-notification-error',
    defaultMessage: 'Error',
  },
});

type Props = InjectedIntlProps &
  InjectedNotificationProps &
  RouteComponentProps<EmailCampaignDashboardRouteMatchParam>;

interface State {
  campaign?: EmailCampaignResource;
  isLoadingCampaign: boolean;
  campaignStatReport: Array<Index<any>>;
  isLoadingCampaignStatReport: boolean;
}

class EmailCampaign extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoadingCampaign: false,
      isLoadingCampaignStatReport: false,
      campaignStatReport: [],
    };
  }

  componentDidMount() {
    const {
      history,
      location: { search, pathname },
      match: { params: { organisationId, campaignId } },
    } = this.props;
    if (!isSearchValid(search, EMAIL_DASHBOARD_SEARCH_SETTINGS)) {
      history.replace({
        pathname: pathname,
        search: buildDefaultSearch(search, EMAIL_DASHBOARD_SEARCH_SETTINGS),
      });
    } else {
      const filter = parseSearch<EmailDashboardSearchSettings>(search, EMAIL_DASHBOARD_SEARCH_SETTINGS);
      this.loadCampaign(campaignId);
      this.refreshStats(organisationId, campaignId, filter);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const {
      location: { search },
      match: { params: { campaignId } },
      history,
    } = this.props;

    const {
      location: { pathname: nextPathname, search: nextSearch },
      match: {
        params: {
          campaignId: nextCampaignId,
          organisationId: nextOrganisationId,
        },
      },
    } = nextProps;
    if (!compareSearches(search, nextSearch) || campaignId !== nextCampaignId) {
      if (!isSearchValid(nextSearch, EMAIL_DASHBOARD_SEARCH_SETTINGS)) {
        history.replace({
          pathname: nextPathname,
          search: buildDefaultSearch(
            nextSearch,
            EMAIL_DASHBOARD_SEARCH_SETTINGS,
          ),
        });
      } else {
        const filter = parseSearch<EmailDashboardSearchSettings>(nextSearch, EMAIL_DASHBOARD_SEARCH_SETTINGS);
        this.loadCampaign(nextCampaignId);
        this.refreshStats(nextOrganisationId, nextCampaignId, filter);
      }
    }
  }

  loadCampaign = (campaignId: string) => {
    if (!this.state.campaign || this.state.campaign.id !== campaignId) {
      this.setState({ isLoadingCampaign: true });
      EmailCampaignService.getEmailCampaign(campaignId)
        .then(res => {
          this.setState({
            isLoadingCampaign: false,
            campaign: res.data,
          });
        })
        .catch(err => {
          log.error(err);
          this.setState({
            isLoadingCampaign: false,
          });
          this.props.notifyError(err);
        });
    }
  };

  refreshStats = (
    organisationId: string,
    campaignId: string,
    filter: EmailDashboardSearchSettings,
  ) => {
    this.setState({
      isLoadingCampaignStatReport: true,
    });
    ReportService.getSingleEmailDeliveryReport(
      organisationId,
      campaignId,
      filter.from,
      filter.to,
      ['day'],
    )
      .then(res => {
        this.setState({
          isLoadingCampaignStatReport: false,
          campaignStatReport: normalizeReportView(res.data.report_view),
        });
      })
      .catch(err => {
        log.error(err);
        this.setState({
          isLoadingCampaignStatReport: false,
        });
        this.props.notifyError(err);
      });
  };

  updateLocationSearch(params: Index<any>) {
    const {
      history,
      location: { search: currentSearch, pathname },
    } = this.props;

    const nextLocation = {
      pathname,
      search: updateSearch(
        currentSearch,
        params,
        EMAIL_DASHBOARD_SEARCH_SETTINGS,
      ),
    };

    history.push(nextLocation);
  }

  updateCampaignStatus = (status: CampaignStatus) => {
    const {
      match: { params: { campaignId } },
      intl,
      notifySuccess,
      notifyError,
    } = this.props;
    this.setState({
      isLoadingCampaign: true,
    });
    EmailCampaignService.updateEmailCampaign(campaignId, {
      status,
    })
      .then(res => {
        this.setState({
          isLoadingCampaign: false,
          campaign: res.data,
        });
        notifySuccess({
          message: intl.formatMessage(messageMap.notifSuccess),
          description: intl.formatMessage(messageMap.statusUpdateSuccess),
        });
      })
      .catch(err =>
        notifyError(err, {
          message: intl.formatMessage(messageMap.notifError),
          description: intl.formatMessage(messageMap.statusUpdateFailure),
        }),
      );
  };

  render() {
    const {
      match: { params: { organisationId, campaignId } },
      location: { search },
      intl,
    } = this.props;

    const {
      campaign,
      isLoadingCampaignStatReport,
      campaignStatReport,
      isLoadingCampaign,
    } = this.state;

    const filter = parseSearch(
      search,
      EMAIL_DASHBOARD_SEARCH_SETTINGS,
    ) as EmailDashboardSearchSettings;

    const handleDateRangeChange = (values: McsDateRangeValue) =>
      this.updateLocationSearch(values);

    const items = [
      {
        title: intl.formatMessage(messageMap.overview),
        display: <Overview campaign={campaign} isLoading={isLoadingCampaign} />,
      },
      {
        title: intl.formatMessage(messageMap.devileryAnalysis),
        display: (
          <EmailStackedAreaChart
            dateRangeValue={{ from: filter.from, to: filter.to }}
            onDateRangeChange={handleDateRangeChange}
            isLoading={isLoadingCampaignStatReport}
            emailReport={campaignStatReport}
          />
        ),
      },
    ];

    const handlePause = () => this.updateCampaignStatus('PAUSED');
    const handleActivate = () => this.updateCampaignStatus('ACTIVE');
    const handleArchive = () => {
      // TODO
    };

    return (
      <div className="ant-layout">
        <EmailCampaignActionbar
          campaign={campaign}
          activateCampaign={handleActivate}
          pauseCampaign={handlePause}
          archiveCampaign={handleArchive}
        />
        <div className="ant-layout">
          <Content className="mcs-content-container">
            <CampaignDashboardHeader campaign={campaign || {}} />
            <Labels
              labellableId={campaignId}
              labellableType="EMAIL_CAMPAIGN"
              organisationId={organisationId}
            />
            <Card>
              <McsTabs items={items} />
            </Card>
            <BlastCard />
          </Content>
        </div>
      </div>
    );
  }
}

export default compose(withRouter, injectIntl, injectNotifications)(
  EmailCampaign,
);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, message } from 'antd';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import Actionbar from '../../../../components/ActionBar.tsx';
import McsIcon from '../../../../components/McsIcon.tsx';
import ExportService from '../../../../services/ExportService';
import CampaignService from '../../../../services/CampaignService.ts';
import ReportService from '../../../../services/ReportService.ts';
import { normalizeReportView } from '../../../../utils/MetricHelper.ts';
import { normalizeArrayOfObject } from '../../../../utils/Normalizer.ts';
import { EMAIL_SEARCH_SETTINGS } from './constants';
import { parseSearch } from '../../../../utils/LocationSearchHelper.ts';
import messages from './messages.ts';

const fetchExportData = (organisationId, filter) => {
  const campaignType = 'EMAIL';

  const buildOptionsForGetCampaigns = () => {
    const options = {
      archived: filter.statuses.includes('ARCHIVED'),
      first_result: 0,
      max_results: 2000,
    };

    const apiStatuses = filter.statuses.filter(status => status !== 'ARCHIVED');

    if (filter.keywords) {
      options.keywords = filter.keywords;
    }
    if (apiStatuses.length > 0) {
      options.status = apiStatuses;
    }
    return options;
  };

  const startDate = filter.from;
  const endDate = filter.to;
  const dimension = 'campaign_id';

  const apiResults = Promise.all([
    CampaignService.getCampaigns(
      organisationId,
      campaignType,
      buildOptionsForGetCampaigns(),
    ),
    ReportService.getEmailDeliveryReport(
      organisationId,
      startDate,
      endDate,
      dimension,
    ),
  ]);

  return apiResults.then(results => {
    const displayCampaigns = normalizeArrayOfObject(results[0].data, 'id');
    const performanceReport = normalizeArrayOfObject(
      normalizeReportView(results[1].data.report_view),
      'campaign_id',
    );

    const mergedData = Object.keys(displayCampaigns).map(campaignId => {
      return {
        ...displayCampaigns[campaignId],
        ...performanceReport[campaignId],
      };
    });

    return mergedData;
  });
};

class EmailCampaignsActionbar extends Component {
  constructor(props) {
    super(props);
    this.handleRunExport = this.handleRunExport.bind(this);
    this.state = {
      exportIsRunning: false,
    };
  }

  handleRunExport() {
    const {
      match: {
        params: { organisationId },
      },
      intl
    } = this.props;

    const filter = parseSearch(
      this.props.location.search,
      EMAIL_SEARCH_SETTINGS,
    );

    this.setState({ exportIsRunning: true });
    const hideExportLoadingMsg = message.loading(
      intl.formatMessage(messages.exportInProgress),
      0,
    );

    fetchExportData(organisationId, filter)
      .then(data => {
        ExportService.exportEmailCampaigns(
          organisationId,
          data,
          filter
        );
        this.setState({
          exportIsRunning: false,
        });
        hideExportLoadingMsg();
      })
      .catch(() => {
        // TODO notify error
        this.setState({
          exportIsRunning: false,
        });
        hideExportLoadingMsg();
      });
  }

  render() {
    const {
      match: {
        params: { organisationId },
      },
      intl
    } = this.props;

    const exportIsRunning = this.state.exportIsRunning;

    const breadcrumbPaths = [
      {
        name: intl.formatMessage(messages.emails),
        url: `/v2/o/${organisationId}/campaigns/email`,
      },
    ];

    return (
      <Actionbar paths={breadcrumbPaths}>
        <Link to={`/v2/o/${organisationId}/campaigns/email/create`}>
          <Button type="primary" className="mcs-primary">
            <McsIcon type="plus" />{' '}
            <FormattedMessage id="email.campaigns.list.actionbar.newCampaign" defaultMessage="New Campaign" />
          </Button>
        </Link>
        <Button onClick={this.handleRunExport} loading={exportIsRunning}>
          {!exportIsRunning && <McsIcon type="download" />}
          <FormattedMessage id="email.campaigns.list.actionbar.export" defaultMessage="Export" />
        </Button>
      </Actionbar>
    );
  }
}

EmailCampaignsActionbar.propTypes = {
  match: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  intl: PropTypes.shape().isRequired,
};

EmailCampaignsActionbar = compose(
  withRouter,
)(EmailCampaignsActionbar);

export default injectIntl(EmailCampaignsActionbar);

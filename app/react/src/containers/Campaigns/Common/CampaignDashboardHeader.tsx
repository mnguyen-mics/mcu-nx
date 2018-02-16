import * as React from 'react';
import ContentHeader from '../../../components/ContentHeader';
import CampaignStatusIndicator from './CampaignStatusIndicator';
import { CampaignStatus } from '../../../models/campaign/constants';

interface Props {
  campaign: {
    name?: string;
    status?: CampaignStatus;
  };
}

class CampaignDashboardHeader extends React.Component<Props> {
  render() {
    const { campaign } = this.props;

    const campaignStatus = campaign.status && (
      <CampaignStatusIndicator status={campaign.status} />
    );

    return (
      <ContentHeader
        title={campaign.name}
        subTitle={campaignStatus}
        loading={!campaign.name}
      />
    );
  }
}

export default CampaignDashboardHeader;

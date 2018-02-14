import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { message } from 'antd';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { injectDrawer } from '../../../../../components/Drawer/index';
import * as FeatureSelectors from '../../../../../state/Features/selectors';
import {
  AdGroupFormData,
  EditAdGroupRouteMatchParam,
  INITIAL_AD_GROUP_FORM_DATA,
} from './domain';
import { DisplayCampaignResource } from '../../../../../models/campaign/display/DisplayCampaignResource';
import DisplayCampaignService from '../../../../../services/DisplayCampaignService';
import AdGroupFormService from './AdGroupFormService';
import messages from '../messages';
import AdGroupForm from './AdGroupForm';
import Loading from '../../../../../components/Loading';
import { InjectDrawerProps } from '../../../../../components/Drawer/injectDrawer';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../../../Notifications/injectNotifications';

interface State {
  campaign?: DisplayCampaignResource;
  adGroupFormData: AdGroupFormData;
  loading: boolean;
}

type Props = InjectedIntlProps &
  InjectDrawerProps &
  InjectedNotificationProps &
  RouteComponentProps<EditAdGroupRouteMatchParam>;

class EditAdGroupPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true, // default true to avoid render x2 on mounting
      adGroupFormData: INITIAL_AD_GROUP_FORM_DATA,
    };
  }

  componentDidMount() {
    const {
      match: { params: { campaignId, adGroupId: adGroupIdFromURLParam } },
      location,
    } = this.props;

    const adGroupIdFromLocState = location.state && location.state.adGroupId;

    const adGroupId = adGroupIdFromURLParam || adGroupIdFromLocState;

    Promise.all([
      DisplayCampaignService.getCampaignDisplay(campaignId),
      adGroupId
        ? AdGroupFormService.loadAdGroup(
            campaignId,
            adGroupId,
            !!adGroupIdFromLocState,
          )
        : Promise.resolve(null),
    ])
      .then(([campaignApiRes, adGroupFormData]) => {
        this.setState(prevState => {
          const newState = {
            ...prevState,
            campaign: campaignApiRes.data,
            loading: false,
          };
          if (adGroupFormData) newState.adGroupFormData = adGroupFormData;
          return newState;
        });
      })
      .catch(err => {
        this.setState({ loading: false });
        this.props.notifyError(err);
      });
  }

  onSubmitFail = () => {
    const { intl } = this.props;
    message.error(intl.formatMessage(messages.errorFormMessage));
  };

  save = (adGroupFormData: AdGroupFormData) => {
    const {
      match: { params: { organisationId, campaignId } },
      notifyError,
      history,
      intl,
    } = this.props;

    const { adGroupFormData: initialAdGroupFormData } = this.state;

    const hideSaveInProgress = message.loading(
      intl.formatMessage(messages.savingInProgress),
      0,
    );

    this.setState({
      loading: true,
    });

    return AdGroupFormService.saveAdGroup(
      organisationId,
      campaignId,
      adGroupFormData,
      initialAdGroupFormData,
    )
      .then(adGroupId => {
        hideSaveInProgress();
        const adGroupDashboardUrl = `/v2/o/${organisationId}/campaigns/display/${campaignId}/adgroups/${adGroupId}`;
        history.push(adGroupDashboardUrl);
      })
      .catch(err => {
        hideSaveInProgress();
        notifyError(err);
        this.setState({
          loading: false,
        });
      });
  };

  onClose = () => {
    const {
      history,
      location,
      match: { params: { adGroupId, campaignId, organisationId } },
    } = this.props;

    const defaultRedirectUrl = adGroupId
      ? `/v2/o/${organisationId}/campaigns/display/${campaignId}/adgroups/${adGroupId}`
      : `/v2/o/${organisationId}/campaigns/display/${campaignId}`;

    return location.state && location.state.from
      ? history.push(location.state.from)
      : history.push(defaultRedirectUrl);
  };

  render() {
    const {
      match: { params: { organisationId, campaignId, adGroupId } },
      intl: { formatMessage },
    } = this.props;

    const { loading, campaign, adGroupFormData } = this.state;

    if (loading) {
      return <Loading className="loading-full-screen" />;
    }

    const campaignName = campaign ? campaign.name : campaignId;
    const adGroupName = adGroupId
      ? formatMessage(messages.breadcrumbTitle3, {
          name:
            adGroupFormData.adGroup && adGroupFormData.adGroup.name
              ? adGroupFormData.adGroup.name
              : adGroupId,
        })
      : formatMessage(messages.breadcrumbTitle2);

    const breadcrumbPaths = [
      {
        name: messages.breadcrumbTitle1,
        path: `/v2/o/${organisationId}/campaigns/display`,
      },
      {
        name: campaignName,
        path: `/v2/o/${organisationId}/campaigns/display/${campaignId}`,
      },
      {
        name: adGroupName,
      },
    ];

    return (
      <AdGroupForm
        initialValues={adGroupFormData}
        onSubmit={this.save}
        close={this.onClose}
        breadCrumbPaths={breadcrumbPaths}
        onSubmitFail={this.onSubmitFail}
      />
    );
  }
}

const mapStateToProps = (state: any) => ({
  hasFeature: FeatureSelectors.hasFeature(state),
});

export default compose(
  withRouter,
  injectIntl,
  injectDrawer,
  injectNotifications,
  connect(mapStateToProps, undefined),
)(EditAdGroupPage);

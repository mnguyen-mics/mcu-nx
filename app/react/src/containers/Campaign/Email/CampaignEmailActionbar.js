import React, { Component, PropTypes } from 'react';
import { Button, Dropdown, Icon, Menu, Modal } from 'antd';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import { FormattedMessage } from 'react-intl';

import { Actionbar } from '../../Actionbar';
import * as ActionbarActions from '../../../state/Actionbar/actions';
import * as CampaignEmailActions from '../../../state/Campaign/Email/actions';

class CampaignEmailActionbar extends Component {

  constructor(props) {
    super(props);
    this.buildActionElement = this.buildActionElement.bind(this);
    this.buildMenu = this.buildMenu.bind(this);
  }

  componentWillReceiveProps(nextProps) {

    const {
      translations,
      campaignEmail,
      setBreadcrumb
    } = this.props;

    const {
      campaignEmail: newCampaignEmail
    } = nextProps;

    if (newCampaignEmail.id || (newCampaignEmail.id !== campaignEmail.id)) {
      const breadcrumb1 = {
        name: translations.EMAIL_CAMPAIGNS
      };
      const breadcrumb2 = {
        name: newCampaignEmail.name
      };
      setBreadcrumb(0, [breadcrumb1, breadcrumb2]);
    }

  }

  render() {

    const {
      activeWorkspace: {
        workspaceId
      },
      params: {
        campaignId
      }
    } = this.props;

    const actionElement = this.buildActionElement();
    const menu = this.buildMenu();

    return (
      <Actionbar {...this.props}>
        { actionElement }
        <Link to={`/${workspaceId}/campaigns/email/edit/${campaignId}`}>
          <Button>
            <Icon type="edit" />
            <FormattedMessage id="EDIT" />
          </Button>
        </Link>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button>
            <Icon type="ellipsis" />
          </Button>
        </Dropdown>
      </Actionbar>
    );

  }

  buildActionElement() {
    const {
      campaignEmail,
      updateCampaignEmail
    } = this.props;

    const onClickElement = status => updateCampaignEmail(campaignEmail.id, {
      status,
      type: 'EMAIL'
    });

    const activeCampaignElement = (
      <Button type="primary" onClick={() => onClickElement('ACTIVE')}>
        <Icon type="play-circle-o" />
        <FormattedMessage id="ACTIVE" />
      </Button>
    );
    const pauseCampaignElement = (
      <Button type="primary" onClick={() => onClickElement('PAUSED')}>
        <Icon type="pause-circle-o" />
        <FormattedMessage id="PAUSED" />
      </Button>
    );

    return campaignEmail.id ? ((campaignEmail.status === 'PAUSED' || campaignEmail.status === 'PENDING') ? activeCampaignElement : pauseCampaignElement) : null;
  }

  buildMenu() {

    const {
      translations,
      campaignEmail,
      archiveCampaignEmail
    } = this.props;

    const handleArchiveGoal = campaignEmailId => {
      Modal.confirm({
        title: translations.CAMPAIGN_MODAL_CONFIRM_ARCHIVED_TITLE,
        content: translations.CAMPAIGN_MODAL_CONFIRM_ARCHIVED_BODY,
        iconType: 'exclamation-circle',
        okText: translations.MODAL_CONFIRM_ARCHIVED_OK,
        cancelText: translations.MODAL_CONFIRM_ARCHIVED_CANCEL,
        onOk() {
          return archiveCampaignEmail(campaignEmailId);
        },
        onCancel() { },
      });
    };

    const onClick = event => {
      switch (event.key) {
        case 'ARCHIVED':
          return handleArchiveGoal(campaignEmail.id);
        default:
          return () => {};
      }
    };

    const addMenu = (
      <Menu onClick={onClick}>
        <Menu.Item key="ARCHIVED">
          <FormattedMessage id="ARCHIVED" />
        </Menu.Item>
      </Menu>
    );

    return addMenu;
  }

}

CampaignEmailActionbar.propTypes = {
  translations: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  activeWorkspace: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  params: PropTypes.shape({
    campaignId: PropTypes.string
  }).isRequired,
  campaignEmail: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  setBreadcrumb: PropTypes.func.isRequired,
  updateCampaignEmail: PropTypes.func.isRequired,
  archiveCampaignEmail: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  translations: state.translationsState.translations,
  activeWorkspace: state.sessionState.activeWorkspace,
  campaignEmail: state.campaignEmailSingle.campaignEmailApi.campaignEmail,
  params: ownProps.router.params
});

const mapDispatchToProps = {
  setBreadcrumb: ActionbarActions.setBreadcrumb,
  updateCampaignEmail: CampaignEmailActions.updateCampaignEmail.request,
  archiveCampaignEmail: CampaignEmailActions.archiveCampaignEmail.request
};

CampaignEmailActionbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(CampaignEmailActionbar);

export default CampaignEmailActionbar;

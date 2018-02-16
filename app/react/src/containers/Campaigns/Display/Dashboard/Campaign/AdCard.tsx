import * as React from 'react';
import { compose } from 'recompose';
import { Modal, Button, message, Menu, Dropdown } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import {
  InjectedIntlProps,
  injectIntl,
  FormattedMessage,
  defineMessages,
} from 'react-intl';

import { CardProps } from '../../../../../components/Card/Card';
import { AdInfoResource } from '../../../../../models/campaign/display/DisplayCampaignInfoResource';
import { AdResource } from '../../../../../models/campaign/display/AdResource';
import { UpdateMessage } from './DisplayCampaignAdGroupTable';

import { CampaignRouteParams } from '../../../../../models/campaign/CampaignResource';
import DisplayCampaignAdTable from '../Common/DisplayCampaignAdTable';
import { Card } from '../../../../../components/Card/index';
import McsDateRangePicker, {
  McsDateRangeValue,
} from '../../../../../components/McsDateRangePicker';
import {
  parseSearch,
  updateSearch,
} from '../../../../../utils/LocationSearchHelper';
import { DISPLAY_DASHBOARD_SEARCH_SETTINGS } from '../constants';
import messages from '../messages';
import Slide from '../../../../../components/Transition/Slide';
import { McsIcon } from '../../../../../components/index';
import { InjectDrawerProps } from '../../../../../components/Drawer/injectDrawer';
import { injectDrawer } from '../../../../../components/Drawer/index';
import { executeTasksInSequence, Task } from '../../../../../utils/FormHelper';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../../../Notifications/injectNotifications';
import { CreativeAuditAction } from '../../../../../models/creative/CreativeResource';
import CreativeService from '../../../../../services/CreativeService';

const messagesMap = defineMessages({
  setStatus: {
    id: 'set.ads.status',
    defaultMessage: 'Set status to',
  },
  auditAction: {
    id: 'audit.action',
    defaultMessage: 'Audit Action',
  },
  activeAll: {
    id: 'active.all.ads',
    defaultMessage: 'Active',
  },
  pauseAll: {
    id: 'pause.all.ads',
    defaultMessage: 'Paused',
  },
  startAll: {
    id: 'display.campaign.start.all.audits',
    defaultMessage: 'Start',
  },
  resetAll: {
    id: 'display.campaign.reset.all.audits',
    defaultMessage: 'Reset',
  },
  archiveSuccess: {
    id: 'archive.ads.success.msg',
    defaultMessage: 'Creatives successfully archived',
  },
});
interface AdCardProps extends CardProps {
  isFetching: boolean;
  isFetchingStat: boolean;
  dataSet?: AdInfoResource[];
  updateAd: (
    adId: string,
    body: Partial<AdResource>,
    successMessage?: UpdateMessage,
    errorMessage?: UpdateMessage,
    undoBody?: Partial<AdResource>,
  ) => Promise<any>;
  additionalButtons?: React.ReactNode;
}

interface AdCardState {
  adModalvisible: boolean;
  selectedRowKeys: string[];
  allRowsAreSelected: boolean;
  isArchivingAds: boolean;
  isUpdatingStatuses: boolean;
}

type JoinedProps = AdCardProps &
  InjectedIntlProps &
  InjectDrawerProps &
  InjectedNotificationProps &
  RouteComponentProps<CampaignRouteParams>;

class AdCard extends React.Component<JoinedProps, AdCardState> {
  constructor(props: JoinedProps) {
    super(props);
    this.state = {
      adModalvisible: false,
      selectedRowKeys: [],
      allRowsAreSelected: false,
      isArchivingAds: false,
      isUpdatingStatuses: false,
    };
  }

  updateLocationSearch(params: McsDateRangeValue) {
    const {
      history,
      location: { search: currentSearch, pathname },
    } = this.props;

    const nextLocation = {
      pathname,
      search: updateSearch(
        currentSearch,
        params,
        DISPLAY_DASHBOARD_SEARCH_SETTINGS,
      ),
    };

    history.push(nextLocation);
  }
  renderDatePicker() {
    const { location: { search } } = this.props;

    const filter = parseSearch(search, DISPLAY_DASHBOARD_SEARCH_SETTINGS);

    const values = {
      from: filter.from,
      to: filter.to,
    };

    const onChange = (newValues: McsDateRangeValue): void =>
      this.updateLocationSearch({
        from: newValues.from,
        to: newValues.to,
      });

    return <McsDateRangePicker values={values} onChange={onChange} />;
  }

  handleAdModalOk = () => {
    const { intl } = this.props;
    // TODO: backend part
    this.setState({
      adModalvisible: false,
      selectedRowKeys: [],
    });
    message.success(intl.formatMessage(messagesMap.archiveSuccess));
  };

  handleCancel = () => {
    this.setState({
      adModalvisible: false,
    });
  };

  archiveAds = () => {
    this.setState({
      adModalvisible: true,
    });
  };

  selectAllItemIds = () => {
    this.setState({
      allRowsAreSelected: true,
    });
  };

  unselectAllItemIds = () => {
    this.setState({
      selectedRowKeys: [],
      allRowsAreSelected: false,
    });
  };

  unsetAllItemsSelectedFlag = () => {
    this.setState({
      allRowsAreSelected: false,
    });
  };

  onSelectAdRowChange = (selectedRowKeys: string[]) => {
    this.setState({
      selectedRowKeys: selectedRowKeys,
    });
  };

  handleStatusAction = (status: string) => {
    const { allRowsAreSelected, selectedRowKeys } = this.state;
    const { dataSet, updateAd } = this.props;
    this.setState({
      isUpdatingStatuses: true,
    });
    let adIdsToUpdate: string[] = [];
    if (allRowsAreSelected && dataSet) {
      adIdsToUpdate = dataSet.map(ad => {
        return ad.id;
      });
    } else {
      adIdsToUpdate = selectedRowKeys;
    }

    const tasks: Task[] = [];
    adIdsToUpdate.forEach(adId => {
      tasks.push(() => {
        return updateAd(adId, {
          status,
        });
      });
    });
    executeTasksInSequence(tasks)
      .then(() => {
        this.setState({
          selectedRowKeys: [],
          allRowsAreSelected: false,
          isUpdatingStatuses: false,
        });
      })
      .catch((err: any) => {
        this.setState({
          isUpdatingStatuses: false,
        });
      });
  };

  handleAuditAction = (action: CreativeAuditAction) => {
    const { allRowsAreSelected, selectedRowKeys } = this.state;
    const { dataSet, notifyError } = this.props;
    let creativesIds: any[] = [];
    if (allRowsAreSelected && dataSet) {
      creativesIds = dataSet.map(ad => ad.creative_id);
    } else if (dataSet) {
      creativesIds = dataSet
        .filter(ad => selectedRowKeys.includes(ad.id))
        .map(ad => ad.creative_id);
    }
    const tasks: Task[] = [];
    creativesIds.forEach(creativeId => {
      tasks.push(() => {
        return CreativeService.getDisplayAd(creativeId)
          .then(apiResp => apiResp.data)
          .then(creative => {
            if (creative.available_user_audit_actions.includes(action)) {
              CreativeService.makeAuditAction(creative.id, action);
            }
          });
      });
    });
    executeTasksInSequence(tasks)
      .then(() => {
        this.setState({
          selectedRowKeys: [],
          allRowsAreSelected: false,
        });
      })
      .catch((err: any) => {
        notifyError(err);
      });
  };

  buildMenu = () => {
    const onClick = (event: any) => {
      switch (event.key) {
        case 'pause':
          return this.handleStatusAction('PAUSED');
        case 'activate':
          return this.handleStatusAction('ACTIVE');
        default:
          break;
      }
    };

    return (
      <Menu onClick={onClick}>
        <Menu.Item key="pause">
          <FormattedMessage {...messagesMap.pauseAll} />
        </Menu.Item>
        <Menu.Item key="activate">
          <FormattedMessage {...messagesMap.activeAll} />
        </Menu.Item>
      </Menu>
    );
  };

  buildAuditMenu = () => {
    const onClick = (event: any) => {
      switch (event.key) {
        case 'start':
          return this.handleAuditAction('START_AUDIT');
        case 'reset':
          return this.handleAuditAction('RESET_AUDIT');
        default:
          break;
      }
    };

    return (
      <Menu onClick={onClick}>
        <Menu.Item key="start">
          <FormattedMessage {...messagesMap.startAll} />
        </Menu.Item>
        <Menu.Item key="reset">
          <FormattedMessage {...messagesMap.resetAll} />
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    const {
      title,
      isFetching,
      isFetchingStat,
      dataSet,
      updateAd,
      additionalButtons,
    } = this.props;

    const {
      selectedRowKeys,
      allRowsAreSelected,
      isUpdatingStatuses,
    } = this.state;

    const hasAdsSelected = !!(selectedRowKeys && selectedRowKeys.length > 0);

    const buildActionAdsElement = () => {
      return (
        <Dropdown overlay={this.buildMenu()} trigger={['click']}>
          <Button className="button-glow">
            <McsIcon type="chevron" />
            <FormattedMessage {...messagesMap.setStatus} />
          </Button>
        </Dropdown>
      );
    };

    const buildAuditActionAdsElement = () => {
      return (
        <Dropdown overlay={this.buildAuditMenu()} trigger={['click']}>
          <Button className="button-glow" style={{ marginRight: '20px' }}>
            <McsIcon type="chevron" />
            <FormattedMessage {...messagesMap.auditAction} />
          </Button>
        </Dropdown>
      );
    };

    const adButtons: JSX.Element = (
      <span>
        {additionalButtons}

        {this.renderDatePicker()}

        {hasAdsSelected ? (
          <Modal
            title={<FormattedMessage {...messages.archiveAdsModalTitle} />}
            visible={this.state.adModalvisible}
            onOk={this.handleAdModalOk}
            onCancel={this.handleCancel}
          >
            <p>
              <FormattedMessage {...messages.archiveAdsModalMessage} />
            </p>
          </Modal>
        ) : null}
        <Slide
          toShow={hasAdsSelected}
          horizontal={true}
          content={
            <Button
              className="m-r-10 button-slider button-glow"
              onClick={this.archiveAds}
            >
              <McsIcon type="delete" />
              <FormattedMessage {...messages.archiveAdGroup} />
            </Button>
          }
        />
        <Slide
          toShow={hasAdsSelected}
          horizontal={true}
          content={buildActionAdsElement()}
        />
        <Slide
          toShow={hasAdsSelected}
          horizontal={true}
          content={buildAuditActionAdsElement()}
        />
      </span>
    );

    const rowSelection = {
      selectedRowKeys,
      allRowsAreSelected,
      selectAllItemIds: this.selectAllItemIds,
      unselectAllItemIds: this.unselectAllItemIds,
      onChange: this.onSelectAdRowChange,
      onSelectAll: this.unsetAllItemsSelectedFlag,
      onSelect: this.unsetAllItemsSelectedFlag,
    };

    return (
      <Card title={title} buttons={adButtons}>
        <DisplayCampaignAdTable
          isFetching={isFetching || isUpdatingStatuses}
          isFetchingStat={isFetchingStat}
          dataSet={dataSet}
          updateAd={updateAd}
          rowSelection={rowSelection}
        />
      </Card>
    );
  }
}

export default compose<AdCardProps, AdCardProps>(
  injectIntl,
  withRouter,
  injectDrawer,
  injectNotifications,
)(AdCard);

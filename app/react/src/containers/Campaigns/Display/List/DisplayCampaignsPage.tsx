import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { Layout, message } from 'antd';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import DisplayCampaignsActionbar from './DisplayCampaignsActionbar';
import DisplayCampaignsTable from './DisplayCampaignsTable';
import { injectDrawer } from '../../../../components/Drawer';
import CampaignService, {
  GetCampaignsOptions,
} from '../../../../services/CampaignService';
import DisplayCampaignService from '../../../../services/DisplayCampaignService';
import EditCampaignsForm, {
  EditCampaignsFormProps,
  EditCampaignsFormData,
} from '../Edit/Campaign/MutiEdit/EditCampaignsForm';
import {
  parseSearch,
  PAGINATION_SEARCH_SETTINGS,
  updateSearch,
} from '../../../../utils/LocationSearchHelper';
import * as NotificationActions from '../../../../state/Notifications/actions';
import { getTableDataSource } from '../../../../state/Campaigns/Display/selectors';
import { DisplayCampaignResource } from '../../../../models/campaign/display/DisplayCampaignResource';
import { InjectDrawerProps } from '../../../../components/Drawer/injectDrawer';
import messages from '../messages';
import DisplayCampaignFormService from '../Edit/DisplayCampaignFormService';

const { Content } = Layout;
interface DisplayCampaignsPageProps {
  totalDisplayCampaigns: number;
  dataSource: DisplayCampaignResource[];
}

interface DisplayCampaignsPageState {
  selectedRowKeys: string[];
  // selected: boolean;
  visible: boolean;
  loading: boolean;
}

interface MapStateProps {
  notifyError: (err: any) => void;
}

type JoinedProps = DisplayCampaignsPageProps &
  InjectedIntlProps &
  InjectDrawerProps &
  MapStateProps &
  RouteComponentProps<{ organisationId: string }>;

class DisplayCampaignsPage extends React.Component<
  JoinedProps,
  DisplayCampaignsPageState
> {
  constructor(props: JoinedProps) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      visible: false,
      loading: false,
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    const { selectedRowKeys } = this.state;

    const { location: { search, pathname, state }, history, intl } = this.props;

    const filter = parseSearch(search, PAGINATION_SEARCH_SETTINGS);

    return Promise.all(
      selectedRowKeys.map(campaignId => {
        DisplayCampaignService.updateCampaign(campaignId, {
          archived: true,
          type: 'DISPLAY',
        });
      }),
    ).then(() => {
      if (filter.currentPage !== 1) {
        const newFilter = {
          ...filter,
          currentPage: 1,
        };
        history.push({
          pathname: pathname,
          search: updateSearch(search, newFilter),
          state: state,
        });
      } else {
        window.location.reload();
      }

      this.setState({
        visible: false,
        selectedRowKeys: [],
      });
      message.success(intl.formatMessage(messages.campaignsArchived));
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  editCampaigns = (formData: EditCampaignsFormData) => {
    const { selectedRowKeys } = this.state;
    const { notifyError, intl } = this.props;
    this.setState({
      loading: true,
    });

    DisplayCampaignFormService.saveCampaigns(selectedRowKeys, formData)
      .then(() => {
        this.props.closeNextDrawer();
        this.setState({
          selectedRowKeys: [],
          loading: false,
        });
        message.success(intl.formatMessage(messages.campaignsSaved));
      })
      .catch(err => {
        this.props.closeNextDrawer();
        this.setState({
          selectedRowKeys: [],
          loading: false,
        });
        notifyError(err);
      });
  };

  openEditCampaignsDrawer = () => {
    const additionalProps = {
      close: this.props.closeNextDrawer,
      onSubmit: this.editCampaigns,
      selectedRowKeys: this.state.selectedRowKeys,
    };
    const options = {
      additionalProps: additionalProps,
    };
    this.props.openNextDrawer<EditCampaignsFormProps>(
      EditCampaignsForm,
      options,
    );
  };

  archiveCampaigns = () => {
    this.showModal();
  };

  onSelectChange = (selectedRowKeys: string[]) => {
    this.setState({ selectedRowKeys });
  };

  selectAllItemIds = (selected: boolean = true) => {
    const {
      totalDisplayCampaigns,
      match: { params: { organisationId } },
    } = this.props;
    const options: GetCampaignsOptions = {
      max_results: totalDisplayCampaigns,
      archived: false,
    };
    const allCampaignsIds: string[] = [];
    if (selected) {
      CampaignService.getCampaigns(organisationId, 'DISPLAY', options).then(
        apiResp => {
          apiResp.data.map((campaignResource, index) => {
            allCampaignsIds.push(campaignResource.id);
          });
          this.setState({
            selectedRowKeys: allCampaignsIds,
          });
        },
      );
    } else {
      this.setState({
        selectedRowKeys: allCampaignsIds,
      });
    }
  };

  unselectAllItemIds = (selected = false) => {
    this.selectAllItemIds(false);
  };

  onSelectAll = () => {
    const { selectedRowKeys } = this.state;
    const { dataSource } = this.props;
    if (selectedRowKeys.length > 0) {
      this.selectAllItemIds(false);
    } else {
      const allPageItemsIds: string[] = [];
      dataSource.map(dataCampaign => {
        allPageItemsIds.push(dataCampaign.id);
      });
      this.setState({
        selectedRowKeys: allPageItemsIds,
      });
    }
  };

  render() {
    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      selectAllItemIds: this.selectAllItemIds,
      unselectAllItemIds: this.unselectAllItemIds,
      onSelectAll: this.onSelectAll,
    };

    const multiEditProps = {
      archiveCampaigns: this.archiveCampaigns,
      visible: this.state.visible,
      handleOk: this.handleOk,
      handleCancel: this.handleCancel,
      openEditCampaignsDrawer: this.openEditCampaignsDrawer,
    };

    return (
      <div className="ant-layout">
        <DisplayCampaignsActionbar
          selectedRowKeys={rowSelection.selectedRowKeys}
          multiEditProps={multiEditProps}
        />
        <div className="ant-layout">
          <Content className="mcs-content-container">
            <DisplayCampaignsTable rowSelection={rowSelection} />
          </Content>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  totalDisplayCampaigns: state.displayCampaignsTable.displayCampaignsApi.total,
  dataSource: getTableDataSource(state),
  notifyError: NotificationActions.notifyError,
});

export default compose<DisplayCampaignsPageProps, JoinedProps>(
  withRouter,
  injectIntl,
  injectDrawer,
  connect(mapStateToProps, undefined),
)(DisplayCampaignsPage);

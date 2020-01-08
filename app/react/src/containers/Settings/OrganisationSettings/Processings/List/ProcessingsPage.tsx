import * as React from 'react';
import { Layout, Button, Modal } from 'antd';
import ItemList, { Filters } from '../../../../../components/ItemList';
import messages from '../messages';
import { McsIconType } from '../../../../../components/McsIcon';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import settingsMessages from '../../../messages';
import { PAGINATION_SEARCH_SETTINGS } from '../../../../../utils/LocationSearchHelper';
import { getPaginatedApiParam } from '../../../../../utils/ApiHelper';
import { ProcessingResource } from '../../../../../models/timeline/timeline';
import { IOrganisationService } from '../../../../../services/OrganisationService';
import { TYPES } from '../../../../../constants/types';
import {
  DataListResponse,
  DataResponse,
} from '../../../../../services/ApiService';
import { RouteComponentProps, withRouter } from 'react-router';
import { OrganisationResource } from '../../../../../models/organisation/organisation';
import { lazyInject } from '../../../../../config/inversify.config';
import { ActionsColumnDefinition } from '../../../../../components/TableView/TableView';
import { compose } from 'recompose';
import { injectWorkspace, InjectedWorkspaceProps } from '../../../../Datamart';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../../../Notifications/injectNotifications';

const { Content } = Layout;

interface RouterProps {
  organisationId: string;
}

type Props = RouteComponentProps<RouterProps> &
  InjectedNotificationProps &
  InjectedWorkspaceProps &
  InjectedIntlProps;

interface ProcessingPageState {
  communityId?: string;
  loading: boolean;
  isVisibleCommunityModal: boolean;
  roleAuthorizesActions: boolean;
  isVisibleDeleteModal: boolean;
  processingIdToBeDeleted?: string;
  data: ProcessingResource[];
  total: number;
}

class ProcessingPage extends React.Component<Props, ProcessingPageState> {
  @lazyInject(TYPES.IOrganisationService)
  private _organisationService: IOrganisationService;

  constructor(props: Props) {
    super(props);

    const {
      workspace: { role },
    } = this.props;

    this.state = {
      loading: true,
      data: [],
      total: 0,
      isVisibleCommunityModal: false,
      roleAuthorizesActions: role !== 'EDITOR' && role !== 'READER',
      isVisibleDeleteModal: false,
      processingIdToBeDeleted: undefined,
    };
  }

  fetchCommunityId = (organisationId: string): Promise<string> => {
    const communityId = this._organisationService
      .getOrganisation(organisationId)
      .then((res: DataResponse<OrganisationResource>) => {
        const comId = res.data.community_id;
        this.setState({
          communityId: comId,
        });
        return comId;
      });
    return communityId;
  };

  fetchProcessings = (organisationId: string, filter: Filters) => {
    const { notifyError } = this.props;
    const { communityId } = this.state;

    this.setState({ loading: true }, () => {
      const communityIdF: Promise<string> = communityId
        ? Promise.resolve(communityId)
        : this.fetchCommunityId(organisationId);

      communityIdF
        .then(comId => {
          const options = {
            ...getPaginatedApiParam(filter.currentPage, filter.pageSize),
          };
          return this._organisationService
            .getProcessings(comId, options)
            .then((results: DataListResponse<ProcessingResource>) => {
              this.setState({
                loading: false,
                data: results.data,
                total: results.total || results.count,
              });
              return results;
            });
        })
        .catch(err => {
          this.setState({
            loading: false,
            data: [],
            total: 0,
          });
          notifyError(err);
        });
    });
  };

  hasRightToPerformActionsOnProcessing = (): boolean => {
    const {
      workspace: { community_id, organisation_id },
    } = this.props;

    if (community_id !== organisation_id) {
      this.setState({ isVisibleCommunityModal: true });
      return false;
    }
    return true;
  };

  editProcessing = (processing: ProcessingResource): void => {
    const {
      history,
      match: {
        params: { organisationId },
      },
    } = this.props;
    if (this.hasRightToPerformActionsOnProcessing()) {
      history.push(
        `/v2/o/${organisationId}/settings/organisation/processings/${processing.id}/edit`,
      );
    }
  };

  archiveProcessing = (processing: ProcessingResource): void => {
    const {
      match: {
        params: { organisationId },
      },
      history,
      notifyError,
    } = this.props;

    if (this.hasRightToPerformActionsOnProcessing()) {
      this._organisationService
        .archiveProcessing(processing.community_id, processing.id)
        .then(() => {
          history.push(
            `/v2/o/${organisationId}/settings/organisation/processings`,
          );
        })
        .catch(err => {
          notifyError(err);
        });
    }
  };

  deleteProcessing = (processing: ProcessingResource): void => {
    if (this.hasRightToPerformActionsOnProcessing()) {
      this.setState({
        isVisibleDeleteModal: true,
        processingIdToBeDeleted: processing.id,
      });
    }
  };

  deleteProcessingConfirmed = () => {
    // It has been checked previously that the organisationId is in fact the communityId
    const {
      match: {
        params: { organisationId },
      },
      history,
      notifyError,
    } = this.props;
    const { processingIdToBeDeleted } = this.state;

    if (processingIdToBeDeleted)
      this._organisationService
        .deleteProcessing(organisationId, processingIdToBeDeleted)
        .then(() => {
          this.closeDeleteModal();
          history.push(
            `/v2/o/${organisationId}/settings/organisation/processings`,
          );
        })
        .catch(err => {
          this.closeDeleteModal();
          notifyError(err);
        });
  };

  closeDeleteModal = () => {
    this.setState({ isVisibleDeleteModal: false }, () => {
      this.setState({ processingIdToBeDeleted: undefined });
    });
  };

  onClickCommunityModal = () => {
    const {
      history,
      workspace: { community_id },
    } = this.props;

    this.setState({
      isVisibleCommunityModal: false,
    });

    history.push(`/v2/o/${community_id}/settings/organisation/processings`);
  };

  render() {
    const {
      match: {
        params: { organisationId },
      },
      history,
      intl: { formatMessage },
    } = this.props;

    const {
      isVisibleCommunityModal,
      roleAuthorizesActions,
      isVisibleDeleteModal,
      processingIdToBeDeleted,
    } = this.state;

    const dataColumnsDefinition = [
      {
        intlMessage: messages.id,
        key: 'id',
        isHideable: false,
      },
      {
        intlMessage: messages.name,
        key: 'name',
        isHideable: false,
      },
      {
        intlMessage: messages.purpose,
        key: 'purpose',
        isHideable: false,
      },
      {
        intlMessage: messages.legalBasis,
        key: 'legal_basis',
        isHideable: false,
      },
      {
        intlMessage: messages.technicalName,
        key: 'technical_name',
        isHideable: false,
      },
      {
        intlMessage: messages.token,
        key: 'token',
        isHideable: false,
      },
    ];

    const emptyTable: {
      iconType: McsIconType;
      intlMessage: FormattedMessage.Props;
    } = {
      iconType: 'settings',
      intlMessage: messages.emptyProcessings,
    };

    const actionColumns:
      | Array<ActionsColumnDefinition<ProcessingResource>>
      | undefined = roleAuthorizesActions
      ? [
          {
            key: 'action',
            actions: () => [
              {
                intlMessage: messages.editProcessing,
                callback: this.editProcessing,
              },
              {
                intlMessage: messages.archiveProcessing,
                callback: this.archiveProcessing,
              },
              {
                intlMessage: messages.deleteProcessing,
                callback: this.deleteProcessing,
              },
            ],
          },
        ]
      : undefined;

    const createProcessing = () => {
      if (this.hasRightToPerformActionsOnProcessing()) {
        history.push(
          `/v2/o/${organisationId}/settings/organisation/processings/create`,
        );
      }
    };

    const button = roleAuthorizesActions ? (
      <span className="mcs-card-button">
        <Button key="create" type="primary" onClick={createProcessing}>
          <FormattedMessage {...messages.newProcessing} />
        </Button>
      </span>
    ) : (
      undefined
    );

    const additionnalComponent = (
      <div>
        <div className="mcs-card-header mcs-card-title">
          <span className="mcs-card-title">
            <FormattedMessage {...settingsMessages.processingActivities} />
          </span>
          {button}
        </div>
        <hr className="mcs-separator" />
      </div>
    );

    return (
      <div className="ant-layout">
        <Content className="mcs-content-container">
          <ItemList
            fetchList={this.fetchProcessings}
            dataSource={this.state.data}
            loading={this.state.loading}
            total={this.state.total}
            columns={dataColumnsDefinition}
            actionsColumnsDefinition={actionColumns}
            pageSettings={PAGINATION_SEARCH_SETTINGS}
            emptyTable={emptyTable}
            additionnalComponent={additionnalComponent}
          />
        </Content>
        <Modal // Community modal
          visible={isVisibleCommunityModal}
          onOk={this.onClickCommunityModal}
          onCancel={this.closeDeleteModal}
        >
          {isVisibleCommunityModal &&
            formatMessage(messages.communityModalMessage)}
        </Modal>
        <Modal // Confirm delete modal
          visible={isVisibleDeleteModal}
          onOk={this.deleteProcessingConfirmed}
          onCancel={this.closeDeleteModal}
        >
          {formatMessage(messages.deleteModalMessage)}{' '}
          {`${processingIdToBeDeleted}.`}
        </Modal>
      </div>
    );
  }
}

export default compose(
  withRouter,
  injectWorkspace,
  injectIntl,
  injectNotifications,
)(ProcessingPage);

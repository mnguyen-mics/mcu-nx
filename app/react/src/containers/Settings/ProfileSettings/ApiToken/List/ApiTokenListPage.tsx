import * as React from 'react';
import { compose } from 'recompose';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/styles/hljs';
import {
  injectIntl,
  InjectedIntlProps,
  FormattedMessage,
  defineMessages,
} from 'react-intl';
import { Layout, Button, Modal, message } from 'antd';
import { McsIconType } from '../../../../../components/McsIcon';
import ItemList, { Filters } from '../../../../../components/ItemList';
import { PAGINATION_SEARCH_SETTINGS } from '../../../../../utils/LocationSearchHelper';
import ApiTokenService from '../../../../../services/ApiTokenService';
import {
  ApiToken,
  ConnectedUser,
} from '../../../../../models/settings/settings';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../../../Notifications/injectNotifications';
import { connect } from 'react-redux';

const { Content } = Layout;

const initialState = {
  loading: false,
  data: [],
  total: 0,
  isModalVisible: false,
  saving: false,
};

const messages = defineMessages({
  apiTokenId: {
    id: 'settings.profile.apitoken.list.id',
    defaultMessage: 'Api Token ID',
  },
  apiTokenName: {
    id: 'settings.profile.apitoken.list.name',
    defaultMessage: 'Api Token name',
  },
  apiTokenValue: {
    id: 'settings.profile.apitoken.list.value',
    defaultMessage: 'Value',
  },
  apiTokenCreationDate: {
    id: 'settings.profile.apitoken.list.creation.date',
    defaultMessage: 'Creation date',
  },
  apiTokenExpirationDate: {
    id: 'settings.profile.apitoken.list.expiration.date',
    defaultMessage: 'Expiration date',
  },
  emptyApiTokenList: {
    id: 'settings.profile.empty.apitoken.list',
    defaultMessage: 'No Api Token',
  },
  apiTokens: {
    id: 'settings.profile.apitoken.list.title',
    defaultMessage: 'Api Tokens',
  },
  newApiToken: {
    id: 'settings.profile.new.apitoken',
    defaultMessage: 'New Api Token',
  },
  deleteApiToken: {
    id: 'settings.profile.apitoken.list.delete.button',
    defaultMessage: 'Delete',
  },
  deleteApiTokenModalTitle: {
    id: 'settings.profile.apitoken.delete.modal.title',
    defaultMessage: 'Are you sure to delete this Api Token ?',
  },
  deleteApiTokenModalContent: {
    id: 'settings.profile.apitoken.delete.modal.content',
    defaultMessage:
      'If you delete this Api Token, you will not be able to get it back.',
  },
  deleteApiTokenModalOkText: {
    id: 'settings.profile.apitoken.delete.modal.ok.text',
    defaultMessage: 'Delete',
  },
  createApiTokenModalTitle: {
    id: 'settings.profile.apitoken.create.modal.title',
    defaultMessage: 'Do you want to create a new Api Token ?',
  },
  createApiTokenModalContent: {
    id: 'settings.profile.apitoken.create.modal.content',
    defaultMessage:
      'You will get the api token value just after this step. Make sure to copy the value of the api token.',
  },
  createApiTokenModalOkText: {
    id: 'settings.profile.apitoken.create.modal.ok.text',
    defaultMessage: 'Create',
  },
  apiTokenModalTitle: {
    id: 'settings.profile.apitoken.modal.title',
    defaultMessage: 'Your Api Token',
  },
  apiTokenModalContent: {
    id: 'settings.profile.apitoken.modal.content',
    defaultMessage:
      'Copy this token. You will not be able to get it back after.',
  },
  ApiTokenModalCancelText: {
    id: 'settings.profile.apitoken.delete.modal.cancel.text',
    defaultMessage: 'Cancel',
  },
  apiTokenSuccessfullyDeleted: {
    id: 'settings.profile.apitoken.successfully.deleted',
    defaultMessage: 'Api Token successfully deleted.',
  },
  apiTokenSuccessfullySaved: {
    id: 'settings.profile.apitoken.successfully.saved',
    defaultMessage: 'Api Token successfully saved.',
  },
});

interface State {
  loading: boolean;
  data: ApiToken[];
  total: number;
  isModalVisible: boolean;
  saving: boolean;
}

interface MapStateToProps {
  connectedUser: ConnectedUser;
}

interface RouterProps {
  organisationId: string;
}

type Props = RouteComponentProps<RouterProps> &
  InjectedIntlProps &
  MapStateToProps &
  InjectedNotificationProps;

class ApiTokenListPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  fetchApiTokens = (organisationId: string, filter: Filters) => {
    const { connectedUser } = this.props;
    this.setState({ loading: true }, () => {
      ApiTokenService.getApiTokens(connectedUser.id, organisationId)
        .then(results => {
          this.setState({
            loading: false,
            data: results.data,
            total: results.total || results.count,
          });
        })
        .catch(error => {
          this.setState({ loading: false });
          this.props.notifyError(error);
        });
    });
  };

  onClickEdit = (apiToken: ApiToken) => {
    const {
      history,
      match: {
        params: { organisationId },
      },
    } = this.props;

    history.push(
      `/v2/o/${organisationId}/settings/account/api_tokens/${apiToken.id}/edit`,
    );
  };

  onDelete = (apiToken: ApiToken) => {
    const {
      intl,
      connectedUser,
      match: {
        params: { organisationId },
      },
      notifyError,
    } = this.props;
    Modal.confirm({
      title: intl.formatMessage(messages.deleteApiTokenModalTitle),
      content: intl.formatMessage(messages.deleteApiTokenModalContent),
      okText: intl.formatMessage(messages.deleteApiTokenModalOkText),
      cancelText: intl.formatMessage(messages.ApiTokenModalCancelText),
      onOk: () => {
        ApiTokenService.deleteApiToken(
          apiToken.id,
          connectedUser.id,
          organisationId,
        )
          .then(() => {
            message.success(
              intl.formatMessage(messages.apiTokenSuccessfullyDeleted),
            );
            const filters = {
              currentPage: 1,
              pageSize: 10,
            };
            this.fetchApiTokens(organisationId, filters);
          })
          .catch(err => {
            notifyError(err);
          });
      },
      onCancel: () => {
        //
      },
    });
  };

  handleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    });
  };

  render() {
    const {
      match: {
        params: { organisationId },
      },
      intl,
    } = this.props;

    const { isModalVisible, loading, saving } = this.state;

    const actionsColumnsDefinition = [
      {
        key: 'action',
        actions: [
          { translationKey: 'EDIT', callback: this.onClickEdit },
          { intlMessage: messages.deleteApiToken, callback: this.onDelete },
        ],
      },
    ];

    const dataColumnsDefinition = [
      {
        intlMessage: messages.apiTokenId,
        key: 'id',
        isHideable: false,
      },
      {
        intlMessage: messages.apiTokenName,
        key: 'name',
        isVisibleByDefault: true,
        isHideable: false,
        render: (value: string, record: ApiToken) => (
          <Link
            to={`/v2/o/${organisationId}/settings/account/api_tokens/${
              record.id
            }/edit`}
          >
            {value}
          </Link>
        ),
      },
      {
        intlMessage: messages.apiTokenValue,
        key: 'value',
        isVisibleByDefault: true,
        isHideable: false,
      },
      {
        intlMessage: messages.apiTokenCreationDate,
        key: 'creation_date',
        isVisibleByDefault: true,
        isHideable: false,
        render: (value: string, record: ApiToken) =>
          moment(parseInt(value, 10)).format('DD/MM/YYYY'),
      },
      {
        intlMessage: messages.apiTokenExpirationDate,
        key: 'expiration_date',
        isVisibleByDefault: true,
        isHideable: false,
        render: (value: string, record: ApiToken) =>
          moment(parseInt(value, 10)).format('DD/MM/YYYY'),
      },
    ];

    const emptyTable: {
      iconType: McsIconType;
      intlMessage: FormattedMessage.Props;
    } = {
      iconType: 'settings',
      intlMessage: messages.emptyApiTokenList,
    };

    const apiTokenModal = (apiTokenData: ApiToken) => {
      const {
        intl: { formatMessage },
      } = this.props;
      Modal.warning({
        title: formatMessage(messages.apiTokenModalTitle),
        width: '600px',
        content: (
          <p>
            {formatMessage(messages.apiTokenModalContent)}
            <SyntaxHighlighter language="json" style={docco}>
              {apiTokenData.value}
            </SyntaxHighlighter>
          </p>
        ),
        okText: 'Ok',
        onOk: () => {
          message.success(formatMessage(messages.apiTokenSuccessfullySaved));
          const filters = {
            currentPage: 1,
            pageSize: 10,
          };
          this.fetchApiTokens(organisationId, filters);
        },
      });
    };

    const createApiToken = () => {
      const { connectedUser, notifyError } = this.props;
      this.setState({
        saving: true,
      });

      ApiTokenService.createApiToken(connectedUser.id, organisationId)
        .then(resp => resp.data)
        .then(apiTokenData => {
          this.setState({
            saving: false,
          });
          this.handleModal();
          apiTokenModal(apiTokenData);
        })
        .catch(err => {
          this.setState({
            saving: false,
          });
          this.handleModal();
          notifyError(err);
        });
    };

    const buttons = (
      <Button key="create" type="primary" onClick={this.handleModal}>
        <FormattedMessage {...messages.newApiToken} />
      </Button>
    );

    const additionnalComponent = (
      <div>
        <div className="mcs-card-header mcs-card-title">
          <span className="mcs-card-title">
            <FormattedMessage {...messages.apiTokens} />
          </span>
          <span className="mcs-card-button">{buttons}</span>
        </div>
        <hr className="mcs-separator" />
      </div>
    );

    return (
      <div className="ant-layout">
        <Content className="mcs-content-container">
          <ItemList
            fetchList={this.fetchApiTokens}
            dataSource={this.state.data}
            loading={loading}
            total={this.state.total}
            columns={dataColumnsDefinition}
            actionsColumnsDefinition={actionsColumnsDefinition}
            pageSettings={PAGINATION_SEARCH_SETTINGS}
            emptyTable={emptyTable}
            additionnalComponent={additionnalComponent}
          />
        </Content>
        <Modal
          title={intl.formatMessage(messages.createApiTokenModalTitle)}
          visible={isModalVisible}
          onOk={createApiToken}
          confirmLoading={saving}
          onCancel={this.handleModal}
          cancelText={intl.formatMessage(messages.ApiTokenModalCancelText)}
          okText={intl.formatMessage(messages.createApiTokenModalOkText)}
        >
          <p>{intl.formatMessage(messages.createApiTokenModalContent)}</p>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  connectedUser: state.session.connectedUser,
});

export default compose(
  withRouter,
  injectIntl,
  injectNotifications,
  connect(mapStateToProps, undefined),
)(ApiTokenListPage);

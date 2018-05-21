import * as React from 'react';
import { compose } from 'recompose';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/styles/hljs';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  injectIntl,
  InjectedIntlProps,
  FormattedMessage,
  defineMessages,
} from 'react-intl';
import { Layout, Button, Modal, message, Input, Alert } from 'antd';
import McsIcon, { McsIconType } from '../../../../../components/McsIcon';
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
  name: ''
};

const messages = defineMessages({
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
    defaultMessage: 'Revoke',
  },
  deleteApiTokenModalTitle: {
    id: 'settings.profile.apitoken.delete.modal.title',
    defaultMessage: 'Are you sure to revoke this Api Token ?',
  },
  nextButtonApiTokenModal: {
    id: 'settings.profile.apitoken.modal.next.buttin',
    defaultMessage: 'Next',
  },
  deleteApiTokenModalContent: {
    id: 'settings.profile.apitoken.delete.modal.content',
    defaultMessage:
      'If you revoke this Api Token, you will not be able to get it back and any application using this token will cease to work.',
  },
  dangerZone: {
    id: 'settings.profile.apitoken.dangerzone',
    defaultMessage: 'DANGER ZONE!!'
  },
  deleteApiTokenModalOkText: {
    id: 'settings.profile.apitoken.delete.modal.ok.text',
    defaultMessage: 'Revoke Anyway',
  },
  createApiTokenModalTitle: {
    id: 'settings.profile.apitoken.create.modal.title',
    defaultMessage: 'Do you want to create a new Api Token ?',
  },
  createApiTokenModalContent: {
    id: 'settings.profile.apitoken.create.modal.content',
    defaultMessage:
      'Give your Api Token a name. Be aware that you can only see once an API token. Make sure to copy it right away as you will not be able to view it afterwards',
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
      'MAKE SURE TO COPY THIS TOKEN!! You will not be able to get it back afterwards, click on the token to copy it to your clipboard.',
  },
  ApiTokenModalCancelText: {
    id: 'settings.profile.apitoken.delete.modal.cancel.text',
    defaultMessage: 'Cancel',
  },
  apiTokenSuccessfullyDeleted: {
    id: 'settings.profile.apitoken.successfully.deleted',
    defaultMessage: 'Api Token successfully revoked.',
  },
  apiTokenSuccessfullySaved: {
    id: 'settings.profile.apitoken.successfully.saved',
    defaultMessage: 'Api Token successfully saved. Give it a name.',
  },
  snippetCodeCopied: {
    id: 'settings.profile.apitoken.code.copied',
    defaultMessage: 'Code snippet copied',
  },
});

interface State {
  loading: boolean;
  data: ApiToken[];
  total: number;
  isModalVisible: boolean;
  saving: boolean;
  name: string;
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
      content: (
        <div>
          <Alert message={intl.formatMessage(messages.dangerZone)} type="error" />
          <br />
          <p>{intl.formatMessage(messages.deleteApiTokenModalContent)}</p>
        </div>
      ),
      okText: intl.formatMessage(messages.deleteApiTokenModalOkText),
      cancelText: intl.formatMessage(messages.ApiTokenModalCancelText),
      onOk: () => {
        this.setState({ loading: true })
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
      name: ''
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
        render: (value: string) => <div>{`${value.substring(0, 25)}...`}</div>
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
        render: (value: string, record: ApiToken) => {
          const now = Date.now();
          const status =
            record.expiration_date - now < 2592000000 /* 1 month in millisec*/
              ? record.expiration_date - now < 0
                ? 'expirated'
                : 'warning'
              : 'ok';
          return (
            <span>
              {moment(parseInt(value, 10)).format('DD/MM/YYYY')}
              <McsIcon type="status" className={`apitoken-status-${status}`} />
            </span>
          );
        },
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

      const handleOnClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        message.info(formatMessage(messages.snippetCodeCopied));
      };
      Modal.warning({
        title: formatMessage(messages.apiTokenModalTitle),
        width: '600px',
        content: (
          <div>
            <Alert message={formatMessage(messages.apiTokenModalContent)} type="warning" />
            <br />
            <CopyToClipboard text={apiTokenData.value} onCopy={handleOnClick}>
              <div style={{ cursor: 'pointer' }}>
                <SyntaxHighlighter language="json" style={docco}>
                  {apiTokenData.value}
                </SyntaxHighlighter>
              </div>
            </CopyToClipboard>
          </div>
        ),
        okText: formatMessage(messages.nextButtonApiTokenModal),
        onOk: () => {
          message.success(formatMessage(messages.apiTokenSuccessfullySaved), 5);
          const filters = {
            currentPage: 1,
            pageSize: 10,
          };
          this.fetchApiTokens(organisationId, filters)
        },
      });
    };

    const createApiToken = () => {
      const { connectedUser, notifyError } = this.props;
      this.setState({
        saving: true,
      });

      ApiTokenService.createApiToken(connectedUser.id, organisationId, { name: this.state.name })
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

    const changeName = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ name: e.target.value })

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
          <br />
          <Input onChange={changeName} placeholder={intl.formatMessage(messages.apiTokenName)} />
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

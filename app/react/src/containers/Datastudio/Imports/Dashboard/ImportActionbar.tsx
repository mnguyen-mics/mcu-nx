import * as React from 'react';
import { Button, Icon, Menu, Modal, message, Upload, Spin } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { Dropdown } from '../../../../components/PopupContainers';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import withTranslations, {
  TranslationProps,
} from '../../../Helpers/withTranslations';
import { Import } from '../../../../models/imports/imports';
import modalMessages from '../../../../common/messages/modalMessages';
import { Actionbar } from '../../../Actionbar';
import McsIcon from '../../../../components/McsIcon';
import log from '../../../../utils/Logger';
import messages from './messages';
import { lazyInject } from '../../../../config/inversify.config';
import { TYPES } from '../../../../constants/types';
import { IImportService } from '../../../../services/ImportService';
import { UploadFile } from 'antd/lib/upload/interface';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../../Notifications/injectNotifications';

const Dragger = Upload.Dragger;

interface ImportActionbarProps {
  importObject?: Import;
  archiveObject?: any;
  isImportExecutionRunning: boolean;
  onNewExecution: () => void;
}

interface State {
  importIsRunning: boolean;
  importFile?: UploadFile[];
  isModalOpen: boolean;
  isLoading: boolean;
}

type JoinedProps = ImportActionbarProps &
  RouteComponentProps<{
    organisationId: string;
    datamartId: string;
    importId: string;
  }> &
  InjectedIntlProps &
  InjectedNotificationProps &
  TranslationProps;

class ImportsActionbar extends React.Component<JoinedProps, State> {
  @lazyInject(TYPES.IImportService)
  private _importService: IImportService;
  constructor(props: JoinedProps) {
    super(props);
    this.state = {
      importIsRunning: this.props.isImportExecutionRunning,
      isModalOpen: false,
      isLoading: false,
    };
  }

  componentWillReceiveProps(nextProps: JoinedProps) {
    const { isImportExecutionRunning } = nextProps;

    this.setState({ importIsRunning: isImportExecutionRunning });
  }

  editImport = () => {
    const {
      location,
      history,
      match: {
        params: { organisationId, datamartId, importId },
      },
    } = this.props;

    const editUrl = `/v2/o/${organisationId}/datastudio/datamart/${datamartId}/imports/${importId}/edit`;
    history.push({
      pathname: editUrl,
      state: { from: `${location.pathname}${location.search}` },
    });
  };

  checkIfSizeOK = (file: UploadFile) => {
    const {
      intl: { formatMessage },
    } = this.props;
    // 100Mo
    const isSizeOK = file.size / 1024 / 1024 < 100;
    if (!isSizeOK) {
      message.error(`${file.name} ${formatMessage(messages.uploadError)}`, 2);
    }
  };

  handleOpenClose = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen, importFile: [] });
  };

  onFileUpdate = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (fileLoadedEvent: any) => {
        const textFromFileLoaded = fileLoadedEvent.target.result;
        return resolve(textFromFileLoaded);
      };

      fileReader.readAsText(file, 'UTF-8');
    });
  };

  handleOnImportButton = async () => {
    const {
      match: {
        params: { organisationId, datamartId, importId },
      },
      history,
      importObject,
    } = this.props;
    const { importFile } = this.state;
    if (importFile && importObject) {
      this.setState({ isLoading: true });
      const formData = new FormData();

      const file = importFile[0];
      const fileContent = await this.onFileUpdate(file)
      const formattedFile = new Blob([fileContent as any], { type: importObject.mime_type === "TEXT_CSV" ? "text/csv" : "application/x-ndjson" })
      formData.append('file', formattedFile, file.name);
      if (importObject.mime_type === 'TEXT_CSV') { formData.append('type', 'text/csv') }
      if (importObject.mime_type === 'APPLICATION_X_NDJSON') { formData.append('type', 'application/x-ndjson') }

      this._importService
        .createImportExecution(datamartId, importId, formData)
        .then(item => {
          this.setState({
            isLoading: false,
            isModalOpen: false,
            importFile: [],
          });
          history.push(
            `/v2/o/${organisationId}/datastudio/datamart/${datamartId}/imports/${importId}`,
          );
        })
        .catch(err => {
          this.setState({ isLoading: false, importFile: [] });
          this.props.notifyError(err);
        });
    }
  };

  renderModal = () => {
    const {
      intl: { formatMessage },
    } = this.props;

    const { isLoading, isModalOpen, importFile } = this.state;

    const props = {
      name: 'file',
      multiple: false,
      action: '/',
      accept: '.ndjson,.csv',
      beforeUpload: (file: UploadFile, fileList: UploadFile[]) => {
        this.checkIfSizeOK(file);
        this.setState({ importFile: fileList });
        return false;
      },
      fileList: importFile,
      onRemove: (file: UploadFile) => {
        if (importFile)
          this.setState({
            importFile: importFile.filter(item => item.uid !== file.uid),
          });
      },
    };

    return (
      <Modal
        title={formatMessage(messages.uploadTitle)}
        visible={isModalOpen}
        onOk={this.handleOnImportButton}
        okText={formatMessage(messages.uploadConfirm)}
        onCancel={this.handleOpenClose}
        confirmLoading={isLoading}
      >
        <Spin spinning={isLoading}>
          <Dragger {...props}>
            <p className="ant-upload-hint">
              {formatMessage(messages.uploadMessage)}
            </p>
          </Dragger>
        </Spin>
      </Modal>
    );
  };

  render() {
    const {
      match: {
        params: { organisationId },
      },
      importObject,
    } = this.props;

    const menu = this.buildMenu();

    const breadcrumbPaths = [
      { name: 'Imports', url: `/v2/o/${organisationId}/datastudio/imports` },
      { name: importObject && importObject.name ? importObject.name : '' },
    ];

    return (
      <Actionbar path={breadcrumbPaths}>
        {this.renderModal()}
        <Button
          className="mcs-primary"
          type="primary"
          onClick={this.handleOpenClose}
        >
          {this.state.importIsRunning ? (
            <Icon type="loading" spin={true} />
          ) : (
            <McsIcon type="plus" />
          )}
          <FormattedMessage {...messages.newExecution} />
        </Button>

        <Button onClick={this.editImport}>
          <McsIcon type="pen" />
          <FormattedMessage {...messages.edit} />
        </Button>

        <Dropdown overlay={menu} trigger={['click']}>
          <Button>
            <Icon type="ellipsis" />
          </Button>
        </Dropdown>
      </Actionbar>
    );
  }

  buildMenu = () => {
    const {
      importObject,
      archiveObject,
      intl: { formatMessage },
    } = this.props;

    const handleArchiveGoal = (displayCampaignId?: string) => {
      Modal.confirm({
        title: formatMessage(modalMessages.archiveCampaignConfirm),
        content: formatMessage(modalMessages.archiveCampaignMessage),
        iconType: 'exclamation-circle',
        okText: formatMessage(modalMessages.confirm),
        cancelText: formatMessage(modalMessages.cancel),
        onOk() {
          return archiveObject(displayCampaignId);
        },
        // onCancel() {},
      });
    };

    const onClick = (event: any) => {
      switch (event.key) {
        case 'ARCHIVED':
          return handleArchiveGoal(importObject && importObject.id);
        default:
          return () => {
            log.error('onclick error');
          };
      }
    };

    return (
      <Menu onClick={onClick}>
        <Menu.Item key="ARCHIVED">
          <FormattedMessage {...messages.archive} />
        </Menu.Item>
      </Menu>
    );
  };
}

export default compose<JoinedProps, ImportActionbarProps>(
  withRouter,
  injectIntl,
  withTranslations,
  injectNotifications,
)(ImportsActionbar);

import * as React from 'react';
import { Button, Modal, Upload, message, Spin } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { compose } from 'recompose';
import { Actionbar, McsIcon } from '@mediarithmics-private/mcs-components-library';
import messages from './messages';
import { UploadFile } from 'antd/lib/upload/interface';
import { Link } from 'react-router-dom';
import { dashboardsDefinition } from '../../../routes/dashboardsRoutes';

const maxFileSize = 200 * 1024;

const Dragger = Upload.Dragger;

interface RouterProps {
  organisationId: string;
}

interface DashboardsActionbarProps {
  innerElement?: React.ReactNode;
}

interface DashboardsActionbarState {
  isModalOpen: boolean;
  fileList: UploadFile[];
  isLoading: boolean;
}

type Props = RouteComponentProps<RouterProps> & InjectedIntlProps & DashboardsActionbarProps;

class DashboardsActionbar extends React.Component<Props, DashboardsActionbarState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isModalOpen: false,
      fileList: [],
      isLoading: false,
    };
  }

  checkIfSizeOK = (file: UploadFile) => {
    const {
      intl: { formatMessage },
    } = this.props;
    const isSizeOK = file.size < maxFileSize;
    if (!isSizeOK) {
      message.error(`${file.name} ${formatMessage(messages.uploadError)}`, 2);
    }
  };

  filterFileList = (fileList: UploadFile[]) => {
    return fileList.filter(item => {
      return item.size < maxFileSize;
    });
  };

  renderModal = () => {
    const {
      intl: { formatMessage },
    } = this.props;

    const props = {
      name: 'file',
      multiple: true,
      action: '/',
      accept: '.jpg,.jpeg,.png,.gif,.svg',
      beforeUpload: (file: UploadFile, fileList: UploadFile[]) => {
        this.checkIfSizeOK(file);
        const newFileList = [...this.state.fileList, ...this.filterFileList(fileList)];
        this.setState({ fileList: newFileList });
        return false;
      },
      fileList: this.state.fileList,
      onRemove: (file: UploadFile) => {
        this.setState({
          fileList: this.state.fileList.filter(item => item.uid !== file.uid),
        });
      },
    };

    return (
      <Modal
        title={formatMessage(messages.newDashboard)}
        visible={this.state.isModalOpen}
        okText={formatMessage(messages.uploadButton)}
        confirmLoading={this.state.isLoading}
      >
        <Spin spinning={this.state.isLoading}>
          <Dragger {...props}>
            <p className='ant-upload-text'>{formatMessage(messages.uploadTitle)}</p>
            <p className='ant-upload-hint'>{formatMessage(messages.uploadMessage)}</p>
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
      intl: { formatMessage },
      innerElement,
    } = this.props;

    const breadcrumbPaths = [
      <Link key='1' to={`/v2/o/${organisationId}${dashboardsDefinition.dashboards.path}`}>
        {formatMessage(messages.dashboards)}
      </Link>,
    ];

    return (
      <Actionbar pathItems={breadcrumbPaths}>
        {this.renderModal()}
        <div className='mcs-actionbar_innerElementsPanel'>
          {innerElement}
          <Link to={`/o/${organisationId}${dashboardsDefinition.dashboardCreate.path}`}>
            <Button className='mcs-primary' type='primary'>
              <McsIcon type='plus' /> <FormattedMessage {...messages.newDashboard} />
            </Button>
          </Link>
        </div>
      </Actionbar>
    );
  }
}

export default compose<Props, DashboardsActionbarProps>(
  injectIntl,
  withRouter,
)(DashboardsActionbar);

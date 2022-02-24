import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import messages from '../messages';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import {
  ActionsColumnDefinition,
  DataColumnDefinition,
} from '@mediarithmics-private/mcs-components-library/lib/components/table-view/table-view/TableView';
import { RouteComponentProps, withRouter } from 'react-router';
import { McsIconType } from '@mediarithmics-private/mcs-components-library/lib/components/mcs-icon';
import { PAGINATION_SEARCH_SETTINGS } from '../../../utils/LocationSearchHelper';
import ItemList, { Filters } from '../../../components/ItemList';
import { Button, Drawer, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ConfigurationFileListingEntryResource } from '@mediarithmics-private/advanced-components/lib/models/plugin/Plugins';
import { IPluginService, lazyInject, TYPES } from '@mediarithmics-private/advanced-components';
import { getPaginatedApiParam } from '../../../utils/ApiHelper';

interface ConfigurationFilesContainerProps {
  pluginVersionId: string;
}

interface RouteProps {
  organisationId: string;
  pluginId: string;
}

export interface ConfigurationFileFormData {
  technicalName?: string;
  file?: string;
}

interface State {
  isDrawerVisible: boolean;
  formData: ConfigurationFileFormData;
  editionMode: boolean;
  isLoading: boolean;
}

type Props = ConfigurationFileContainerProps &
  InjectedIntlProps &
  InjectedNotificationProps &
  RouteComponentProps<RouteProps>;

interface State {
  loading: boolean;
  pluginConfigurationFiles: ConfigurationFileListingEntryResource[];
  pluginConfigurationFileTotal: number;
}

class ConfigurationFilesContainer extends React.Component<Props, State> {
  @lazyInject(TYPES.IPluginService)
  private _pluginService: IPluginService;
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      pluginConfigurationFiles: [],
      pluginConfigurationFileTotal: 0,
      isDrawerVisible: false,
      formData: {},
      editionMode: true,
      isLoading: false,
    };
  }

  saveConfigurationFile = (formData: ConfigurationFileFormData) => {
    const {
      match: {
        params: { pluginId },
      },
      intl,
      pluginVersionId,
    } = this.props;
    const { editionMode } = this.state;
    this.setState({
      isLoading: true,
    });
    const file = new Blob([formData.file || '']);
    const promise = editionMode
      ? this._pluginService.putPluginConfigurationFile(
          pluginId,
          pluginVersionId,
          formData.technicalName || '',
          file,
        )
      : this._pluginService.createPluginConfigurationFile(
          pluginId,
          pluginVersionId,
          formData.technicalName || '',
          file,
        );
    return promise
      .then(res => {
        this.setState({
          isLoading: false,
          isDrawerVisible: false,
        });
        message.success(intl.formatMessage(messages.saveSuccess), 3);
      })
      .catch(err => {
        this.setState({
          isDrawerVisible: false,
          isLoading: false,
        });
      });
  };

  editPluginConfigurationFile = (pluginConfigurationFile: PluginConfigurationFile) => {
    this.setState({
      isDrawerVisible: true,
      editionMode: true,
      formData: {
        technicalName: pluginConfigurationFile.technical_name,
        file: '', // TODO
      },
    });
  };

  openDrawer = () => {
    this.setState({
      isDrawerVisible: true,
      editionMode: false,
    });
  };

  closeDrawer = () => {
    this.setState({
      isDrawerVisible: false,
    });
  };

  fetchPluginConfigurationFiles = (pluginVersionId: string, filters: Filters) => {
    const {
      match: {
        params: { pluginId, organisationId },
      },
      notifyError,
    } = this.props;
    this.setState({
      loading: true,
    });
    const options = {
      organisation_id: organisationId,
      ...getPaginatedApiParam(filters.currentPage, filters.pageSize),
    };
    this._pluginService
      .listPluginConfigurationFiles(pluginId, pluginVersionId, options)
      .then(res => {
        this.setState({
          pluginConfigurationFiles: res.data,
          loading: false,
          pluginConfigurationFileTotal: res.total || res.count,
        });
      })
      .catch(err => {
        notifyError(err);
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    const {
      intl: { formatMessage },
      pluginConfigurationFiles,
      plugin,
    } = this.props;

    const drawerTitle = `Plugins > ${plugin?.group_id}/${plugin?.artifact_id} > Add a configuration file`;

    const { isDrawerVisible, formData, isLoading } = this.state;

    const dataColumnsDefinition: Array<DataColumnDefinition<PluginConfigurationFile>> = [
      {
        title: formatMessage(messages.name),
        key: 'technical_name',
        isHideable: false,
        render: (text: string, record: ConfigurationFileListingEntryResource) => text,
      },
    ];

    const actionColumns: Array<ActionsColumnDefinition<ConfigurationFileListingEntryResource>> = [
      {
        key: 'action',
        actions: () => [
          {
            message: formatMessage(messages.edit),
            callback: this.editPluginConfigurationFile,
            className: 'mcs-pluginConfigurationFileTable_dropDownMenu--edit',
          },
        ],
      },
    ];

    const emptyTable: {
      iconType: McsIconType;
      message: string;
    } = {
      iconType: 'library',
      message: formatMessage(messages.configurationFileEmptyTable),
    };

    return (
      <React.Fragment>
        <ItemList
          fetchList={this.fetchPluginConfigurationFiles}
          dataSource={pluginConfigurationFiles}
          actionsColumnsDefinition={actionColumns}
          loading={false}
          total={pluginConfigurationFiles.length}
          columns={dataColumnsDefinition}
          pageSettings={PAGINATION_SEARCH_SETTINGS}
          emptyTable={emptyTable}
        />
        <Button
          className='mcs-pluginConfigurationFileTable_addFileButton'
          onClick={this.openDrawer}
        >
          <PlusOutlined /> <FormattedMessage {...messages.addFileButton} />
        </Button>
        <Drawer
          className='mcs-pluginEdit-drawer'
          title={drawerTitle}
          bodyStyle={{ padding: '0' }}
          closable={true}
          onClose={this.closeDrawer}
          visible={isDrawerVisible}
          width='800'
          destroyOnClose={true}
        >
          <ConfigurationFileForm
            onSave={this.saveConfigurationFile}
            formData={formData}
            isLoading={isLoading}
          />
        </Drawer>
      </React.Fragment>
    );
  }
}

export default compose<Props, ConfigurationFilesContainerProps>(
  injectIntl,
  injectNotifications,
  withRouter,
)(ConfigurationFilesContainer);

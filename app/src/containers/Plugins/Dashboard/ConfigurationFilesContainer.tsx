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
import { getPaginatedApiParam } from '../../../utils/ApiHelper';
import {
  IPluginService,
  lazyInject,
  TYPES,
  PluginResource,
} from '@mediarithmics-private/advanced-components';
import ConfigurationFileForm from './ConfigurationFileForm';

interface ConfigurationFilesContainerProps {
  pluginVersionId: string;
  plugin?: PluginResource;
}

interface RouteProps {
  organisationId: string;
  pluginId: string;
}

export interface ConfigurationFileFormData {
  technical_name?: string;
  file?: string;
}

interface State {
  isDrawerVisible: boolean;
  isDrawerEditing?: boolean;
  formData: ConfigurationFileFormData;
  loading: boolean;
  pluginConfigurationFiles: ConfigurationFileListingEntryResource[];
  pluginConfigurationFileTotal: number;
}

type Props = ConfigurationFilesContainerProps &
  InjectedIntlProps &
  InjectedNotificationProps &
  RouteComponentProps<RouteProps>;

class ConfigurationFilesContainer extends React.Component<Props, State> {
  @lazyInject(TYPES.IPluginService)
  private _pluginService: IPluginService;
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      pluginConfigurationFiles: [],
      pluginConfigurationFileTotal: 0,
      isDrawerVisible: false,
      formData: {},
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { pluginVersionId } = this.props;
    const { pluginVersionId: prevPluginVersionId } = prevProps;
    if (prevPluginVersionId !== pluginVersionId) {
      this.fetchPluginConfigurationFiles(pluginVersionId, { currentPage: 1, pageSize: 10 });
    }
  }

  saveConfigurationFile = (formData: ConfigurationFileFormData) => {
    const {
      match: {
        params: { pluginId },
      },
      notifyError,
      intl,
      pluginVersionId,
    } = this.props;
    const file = new Blob([formData.file || '']);
    return this._pluginService
      .putPluginConfigurationFile(pluginId, pluginVersionId, formData.technical_name || '', file)

      .then(res => {
        this.setState({
          isDrawerVisible: false,
        });
        // Refresh the table
        this.fetchPluginConfigurationFiles(pluginVersionId, { currentPage: 1, pageSize: 10 });
        message.success(intl.formatMessage(messages.saveSuccess), 3);
      })
      .catch(err => {
        notifyError(err);
      });
  };

  editPluginConfigurationFile = (
    pluginConfigurationFile: ConfigurationFileListingEntryResource,
  ) => {
    const {
      match: {
        params: { pluginId },
      },
      pluginVersionId,
    } = this.props;
    this._pluginService
      .getPluginConfigurationFile(pluginId, pluginVersionId, pluginConfigurationFile.technical_name)
      .then(res => {
        return res.text().then(file => {
          this.setState({
            isDrawerVisible: true,
            isDrawerEditing: true,
            formData: {
              technical_name: pluginConfigurationFile.technical_name,
              file: file,
            },
          });
        });
      });
  };

  openConfigCreationDrawer = () => {
    this.setState({
      isDrawerVisible: true,
      isDrawerEditing: false,
      formData: {},
    });
  };

  closeDrawer = () => {
    this.setState({
      isDrawerVisible: false,
    });
  };

  fetchPluginConfigurationFiles = (organisationId: string, filters: Filters) => {
    const {
      match: {
        params: { pluginId },
      },
      notifyError,
      pluginVersionId,
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
      plugin,
    } = this.props;

    const { pluginConfigurationFiles, loading, isDrawerEditing } = this.state;

    const drawerTitle = `Plugins > ${plugin?.group_id}/${plugin?.artifact_id} > ${
      isDrawerEditing ? 'Edit' : 'Add'
    } a technical configuration`;

    const { isDrawerVisible, formData, pluginConfigurationFileTotal } = this.state;

    const dataColumnsDefinition: Array<
      DataColumnDefinition<ConfigurationFileListingEntryResource>
    > = [
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
      message: formatMessage(messages.technicalConfigurationEmptyTable),
    };

    return (
      <React.Fragment>
        <ItemList
          className='mcs-pluginTab-list'
          fetchList={this.fetchPluginConfigurationFiles}
          dataSource={pluginConfigurationFiles}
          actionsColumnsDefinition={actionColumns}
          loading={loading}
          total={pluginConfigurationFileTotal}
          columns={dataColumnsDefinition}
          pageSettings={PAGINATION_SEARCH_SETTINGS}
          emptyTable={emptyTable}
        />
        <Button className='mcs-pluginList_actionButton' onClick={this.openConfigCreationDrawer}>
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
            isEditing={isDrawerEditing}
          />
        </Drawer>
      </React.Fragment>
    );
  }
}

export default compose<Props, ConfigurationFilesContainerProps>(
  withRouter,
  injectIntl,
  injectNotifications,
)(ConfigurationFilesContainer);

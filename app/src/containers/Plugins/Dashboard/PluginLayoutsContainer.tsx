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
import {
  IPluginService,
  lazyInject,
  PluginResource,
  TYPES,
} from '@mediarithmics-private/advanced-components';
import PluginLayoutForm from './PluginLayoutForm';
import { LayoutFileListingEntryResource } from '@mediarithmics-private/advanced-components/lib/services/PluginService';
import { getPaginatedApiParam } from '../../../utils/ApiHelper';

export interface PluginLayoutFileFormData {
  locale?: string;
  file?: string;
}

interface PluginLayoutsContainerProps {
  pluginVersionId: string;
  plugin?: PluginResource;
}

interface RouteProps {
  organisationId: string;
  pluginId: string;
}

type Props = PluginLayoutsContainerProps &
  InjectedIntlProps &
  InjectedNotificationProps &
  RouteComponentProps<RouteProps>;

interface State {
  loading: boolean;
  pluginPropertyLayouts: LayoutFileListingEntryResource[];
  pluginPropertyLayoutTotal: number;
  isDrawerVisible: boolean;
  isDrawerEditing?: boolean;
  formData: PluginLayoutFileFormData;
}

class PluginLayoutsContainer extends React.Component<Props, State> {
  @lazyInject(TYPES.IPluginService)
  private _pluginService: IPluginService;
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      pluginPropertyLayouts: [],
      isDrawerVisible: false,
      formData: {},
      pluginPropertyLayoutTotal: 0,
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { pluginVersionId } = this.props;
    const { pluginVersionId: prevPluginVersionId } = prevProps;
    if (prevPluginVersionId !== pluginVersionId) {
      this.fetchPluginPropertyLayouts(pluginVersionId, { currentPage: 1, pageSize: 10 });
    }
  }

  editPluginLayoutFile = (pluginLayoutFile: LayoutFileListingEntryResource) => {
    const {
      match: {
        params: { pluginId },
      },
      pluginVersionId,
      notifyError,
    } = this.props;
    this._pluginService
      .getLocalizedPluginLayout(pluginId, pluginVersionId, pluginLayoutFile.locale)
      .then(res => {
        this.setState({
          isDrawerVisible: true,
          isDrawerEditing: true,
          formData: {
            locale: pluginLayoutFile.locale,
            file: JSON.stringify(res),
          },
        });
      })
      .catch(err => {
        notifyError(err);
      });
  };

  fetchPluginPropertyLayouts = (organisationId: string, filters: Filters) => {
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
      .listPluginLayouts(pluginId, pluginVersionId, options)
      .then(res => {
        this.setState({
          pluginPropertyLayouts: res.data,
          loading: false,
          pluginPropertyLayoutTotal: res.total || res.count,
        });
      })
      .catch(err => {
        notifyError(err);
        this.setState({
          loading: false,
        });
      });
  };

  openDrawer = () => {
    this.setState({
      isDrawerEditing: false,
      isDrawerVisible: true,
      formData: {},
    });
  };

  savePluginLayoutFile = (formData: PluginLayoutFileFormData) => {
    const {
      match: {
        params: { pluginId },
      },
      intl,
      pluginVersionId,
    } = this.props;
    const file = new Blob([formData.file || '']);
    return this._pluginService
      .putPropertiesLayout(pluginId, pluginVersionId, file)
      .then(res => {
        this.setState({
          isDrawerVisible: false,
        });
        // Refresh the table
        this.fetchPluginPropertyLayouts(pluginVersionId, { currentPage: 1, pageSize: 10 });
        message.success(intl.formatMessage(messages.saveLayoutSuccess), 3);
      })
      .catch(err => {
        this.setState({
          isDrawerVisible: false,
        });
      });
  };

  closeDrawer = () => {
    this.setState({
      isDrawerVisible: false,
    });
  };

  render() {
    const {
      intl: { formatMessage },
      plugin,
    } = this.props;

    const {
      pluginPropertyLayouts,
      isDrawerVisible,
      isDrawerEditing,
      formData,
      pluginPropertyLayoutTotal,
      loading,
    } = this.state;

    const drawerTitle = `Plugins > ${plugin?.group_id}/${plugin?.artifact_id} > Add a locale file`;

    const dataColumnsDefinition: Array<DataColumnDefinition<LayoutFileListingEntryResource>> = [
      {
        title: formatMessage(messages.name),
        key: 'locale',
        isHideable: false,
        render: (text: string, record: LayoutFileListingEntryResource) =>
          record.file_type === 'PROPERTIES' ? 'layout' : text,
      },
      {
        title: formatMessage(messages.type),
        key: 'file_type',
        isHideable: false,
        render: (text: string, record: LayoutFileListingEntryResource) => text,
      },
    ];

    const actionColumns: Array<ActionsColumnDefinition<LayoutFileListingEntryResource>> = [
      {
        key: 'action',
        actions: () => [
          {
            message: formatMessage(messages.edit),
            callback: this.editPluginLayoutFile,
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
      message: formatMessage(messages.layoutEmptyTable),
    };

    return (
      <React.Fragment>
        <ItemList
          fetchList={this.fetchPluginPropertyLayouts}
          dataSource={pluginPropertyLayouts}
          actionsColumnsDefinition={actionColumns}
          loading={loading}
          total={pluginPropertyLayoutTotal}
          columns={dataColumnsDefinition}
          pageSettings={PAGINATION_SEARCH_SETTINGS}
          emptyTable={emptyTable}
        />
        <Button
          className='mcs-pluginConfigurationFileTable_addFileButton'
          onClick={this.openDrawer}
        >
          <PlusOutlined /> <FormattedMessage {...messages.addLayoutButton} />
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
          <PluginLayoutForm
            onSave={this.savePluginLayoutFile}
            formData={formData}
            isEditing={isDrawerEditing}
          />
        </Drawer>
      </React.Fragment>
    );
  }
}

export default compose<Props, PluginLayoutsContainerProps>(
  injectIntl,
  injectNotifications,
  withRouter,
)(PluginLayoutsContainer);

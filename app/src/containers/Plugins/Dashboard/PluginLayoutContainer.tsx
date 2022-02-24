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
import ItemList from '../../../components/ItemList';
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

export interface PluginLayoutFileFormData {
  locale?: string;
  file?: string;
}

interface PluginLayoutContainerProps {
  pluginVersionId: string;
  plugin?: PluginResource;
}

interface RouteProps {
  organisationId: string;
  pluginId: string;
}

type Props = PluginLayoutContainerProps &
  InjectedIntlProps &
  InjectedNotificationProps &
  RouteComponentProps<RouteProps>;

interface State {
  loading: boolean;
  pluginPropertyLayouts: LayoutFileListingEntryResource[];
  isDrawerVisible: boolean;
  formData: PluginLayoutFileFormData;
}

class PluginLayoutContainer extends React.Component<Props, State> {
  @lazyInject(TYPES.IPluginService)
  private _pluginService: IPluginService;
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      pluginPropertyLayouts: [],
      isDrawerVisible: false,
      formData: {},
    };
  }

  componentDidMount() {
    const { pluginVersionId } = this.props;
    this.getPluginPropertyLayouts(pluginVersionId);
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

  getPluginPropertyLayouts = (pluginVersionId: string) => {
    const {
      match: {
        params: { pluginId },
      },
      notifyError,
    } = this.props;

    this._pluginService
      .listPluginLayouts(pluginId, pluginVersionId)
      .then(res => {
        this.setState({
          pluginPropertyLayouts: res.data,
          loading: false,
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
      isDrawerVisible: true,
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

  fetchPluginPropertyLayouts = (pluginVersionId: string) => {
    return Promise.resolve();
  };

  render() {
    const {
      intl: { formatMessage },
      plugin,
    } = this.props;

    const { pluginPropertyLayouts, isDrawerVisible, formData } = this.state;

    const drawerTitle = `Plugins > ${plugin?.group_id}/${plugin?.artifact_id} > Add a locale file`;

    const dataColumnsDefinition: Array<DataColumnDefinition<LayoutFileListingEntryResource>> = [
      {
        title: formatMessage(messages.name),
        key: 'technical_name',
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
          loading={false}
          total={pluginPropertyLayouts.length}
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
          <PluginLayoutForm onSave={this.savePluginLayoutFile} formData={formData} />
        </Drawer>
      </React.Fragment>
    );
  }
}

export default compose<Props, PluginLayoutContainerProps>(
  injectIntl,
  injectNotifications,
  withRouter,
)(PluginLayoutContainer);

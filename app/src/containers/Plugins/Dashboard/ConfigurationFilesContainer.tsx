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
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ConfigurationFileListingEntryResource } from '@mediarithmics-private/advanced-components/lib/models/plugin/Plugins';
import { IPluginService, lazyInject, TYPES } from '@mediarithmics-private/advanced-components';

interface ConfigurationFilesContainerProps {
  pluginVersionId: string;
}

interface RouteProps {
  organisationId: string;
  pluginId: string;
}

type Props = ConfigurationFilesContainerProps &
  InjectedIntlProps &
  InjectedNotificationProps &
  RouteComponentProps<RouteProps>;

interface State {
  loading: boolean;
  pluginConfigurationFiles: ConfigurationFileListingEntryResource[];
}

class ConfigurationFilesContainer extends React.Component<Props, State> {
  @lazyInject(TYPES.IPluginService)
  private _pluginService: IPluginService;
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      pluginConfigurationFiles: [],
    };
  }

  componentDidMount() {
    const { pluginVersionId } = this.props;
    this.getPluginConfigurationFiles(pluginVersionId);
  }

  editPluginConfigurationFile = () => {
    //
  };

  getPluginConfigurationFiles = (pluginVersionId: string) => {
    const {
      match: {
        params: { pluginId },
      },
      notifyError,
    } = this.props;

    this._pluginService
      .listPluginConfigurationFiles(pluginId, pluginVersionId)
      .then(res => {
        this.setState({
          pluginConfigurationFiles: res.data,
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

  fetchPluginConfigurationFiles = (pluginVersionId: string) => {
    // Route to fetch datafile is not paginated
    return Promise.resolve();
  };

  render() {
    const {
      intl: { formatMessage },
    } = this.props;

    const { pluginConfigurationFiles } = this.state;

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
      message: formatMessage(messages.deploymentEmptyTable),
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
        <Button className='mcs-pluginConfigurationFileTable_addFileButton'>
          <PlusOutlined /> <FormattedMessage {...messages.addFileButton} />
        </Button>
      </React.Fragment>
    );
  }
}

export default compose<Props, ConfigurationFilesContainerProps>(
  injectIntl,
  injectNotifications,
  withRouter,
)(ConfigurationFilesContainer);

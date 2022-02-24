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
import { IPluginService, lazyInject, TYPES } from '@mediarithmics-private/advanced-components';

// TODO: to get from ADV
type PluginLayoutFileType = 'PROPERTIES' | 'LOCALE';
interface LayoutFileListingEntryResource {
  fileType: PluginLayoutFileType;
  locale?: string;
}

interface PluginLayoutContainerProps {
  pluginVersionId: string;
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
}

class PluginLayoutContainer extends React.Component<Props, State> {
  @lazyInject(TYPES.IPluginService)
  private _pluginService: IPluginService;
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      pluginPropertyLayouts: [],
    };
  }

  componentDidMount() {
    const { pluginVersionId } = this.props;
    this.getPluginPropertyLayouts(pluginVersionId);
  }

  editPluginPropertyLayout = () => {
    //
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

  fetchPluginPropertyLayouts = (pluginVersionId: string) => {
    return Promise.resolve();
  };

  render() {
    const {
      intl: { formatMessage },
    } = this.props;

    const { pluginPropertyLayouts } = this.state;

    const dataColumnsDefinition: Array<DataColumnDefinition<LayoutFileListingEntryResource>> = [
      {
        title: formatMessage(messages.name),
        key: 'locale',
        isHideable: false,
        render: (text: string, record: LayoutFileListingEntryResource) => text,
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
            callback: this.editPluginPropertyLayout,
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
        <Button className='mcs-pluginConfigurationFileTable_addFileButton'>
          <PlusOutlined /> <FormattedMessage {...messages.addLayoutButton} />
        </Button>
      </React.Fragment>
    );
  }
}

export default compose<Props, PluginLayoutContainerProps>(
  injectIntl,
  injectNotifications,
  withRouter,
)(PluginLayoutContainer);

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
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { IPluginService, lazyInject, TYPES } from '@mediarithmics-private/advanced-components';
import { LayoutFileListingEntryResource } from '@mediarithmics-private/advanced-components/lib/services/PluginService';
import { getPaginatedApiParam } from '../../../utils/ApiHelper';

interface PluginLayoutsContainerProps {
  pluginVersionId: string;
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
}

class PluginLayoutsContainer extends React.Component<Props, State> {
  @lazyInject(TYPES.IPluginService)
  private _pluginService: IPluginService;
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      pluginPropertyLayouts: [],
      pluginPropertyLayoutTotal: 0,
    };
  }

  editPluginPropertyLayout = () => {
    //
  };

  fetchPluginPropertyLayouts = (pluginVersionId: string, filters: Filters) => {
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

  render() {
    const {
      intl: { formatMessage },
    } = this.props;

    const { pluginPropertyLayouts, pluginPropertyLayoutTotal } = this.state;

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
          total={pluginPropertyLayoutTotal}
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

export default compose<Props, PluginLayoutsContainerProps>(
  injectIntl,
  injectNotifications,
  withRouter,
)(PluginLayoutsContainer);

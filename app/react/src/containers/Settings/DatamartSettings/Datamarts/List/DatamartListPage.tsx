import * as React from 'react';
import { compose } from 'recompose';
import { withRouter, RouteComponentProps } from 'react-router';
import {
  injectIntl,
  InjectedIntlProps,
  FormattedMessage,
} from 'react-intl';
import { Layout } from 'antd';
import { McsIconType } from '../../../../../components/McsIcon';
import ItemList, { Filters } from '../../../../../components/ItemList';
import { PAGINATION_SEARCH_SETTINGS } from '../../../../../utils/LocationSearchHelper';
import DatamartService from '../../../../../services/DatamartService';
import { getPaginatedApiParam } from '../../../../../utils/ApiHelper';
import { DatamartResource } from '../../../../../models/datamart/DatamartResource';
import messages from './messages';
import settingsMessages from '../../../messages';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../../../Notifications/injectNotifications';
import { Link } from 'react-router-dom';
import { ActionsColumnDefinition, ActionsRenderer, ActionDefinition } from '../../../../../components/TableView/TableView';

const { Content } = Layout;

const initialState = {
  loading: false,
  data: [],
  total: 0,
};

interface DatamartsListPageState {
  loading: boolean;
  data: DatamartResource[];
  total: number;
}

interface RouterProps {
  organisationId: string;
}

class DatamartsListPage extends React.Component<
  RouteComponentProps<RouterProps> &
  InjectedIntlProps &
  InjectedNotificationProps,
  DatamartsListPageState
  > {
  state = initialState;

  archiveUser = (recommenderId: string) => {
    return Promise.resolve();
  };

  fetchDatamarts = (organisationId: string, filter: Filters) => {
    this.setState({ loading: true }, () => {
      const options = {
        allow_administrator: true,
        ...getPaginatedApiParam(filter.currentPage, filter.pageSize),
      };
      DatamartService.getDatamarts(organisationId, options)
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

  onClickEdit = (datamart: DatamartResource) => {
    const {
      history,
      match: {
        params: { organisationId },
      },
    } = this.props;

    history.push(
      `/v2/o/${organisationId}/settings/datamart/my_datamart/${
      datamart.id
      }/edit`,
    );
  };

  onClickSUR = (datamart: DatamartResource) => {
    const {
      history,
      match: {
        params: { organisationId },
      },
    } = this.props;

    history.push(
      `/v2/o/${organisationId}/settings/datamart/my_datamart/${
      datamart.id
      }/service_usage_report`,
    );
  };

  onClickSources = (datamart: DatamartResource) => {
    const {
      history,
      match: {
        params: { organisationId },
      },
    } = this.props;

    history.push(
      `/v2/o/${organisationId}/settings/datamart/my_datamart/${
      datamart.id
      }/sources`,
    );
  }

  render() {
    const { match: { params: { organisationId } } } = this.props;


    const renderActionColumnDefinition: ActionsRenderer<DatamartResource> = (record: DatamartResource) => {
      const actionsDefinitions: Array<ActionDefinition<DatamartResource>>  = [];
      actionsDefinitions.push({ translationKey: 'EDIT', callback: this.onClickEdit})
      if (record.id === '1048') {
        actionsDefinitions.push({callback: this.onClickSUR, intlMessage: messages.serviceUsageReport }) 
      }
      if (record.type === 'CROSS_DATAMART') {
        actionsDefinitions.push({
          callback: this.onClickSources, intlMessage: messages.viewDatamartSources
        })
      }
      return actionsDefinitions;
    }

    const actionsColumnsDefinition: Array<ActionsColumnDefinition<DatamartResource>> = [
      {
        key: 'action',
        actions: renderActionColumnDefinition
      },
    ];


    const dataColumnsDefinition = [
      {
        intlMessage: messages.datamartId,
        key: 'id',
        isHideable: false,
      },
      {
        intlMessage: messages.datamartName,
        key: 'name',
        isVisibleByDefault: true,
        isHideable: false,
        render: (value: string, record: DatamartResource) => <Link to={`/v2/o/${organisationId}/settings/datamart/my_datamart/${record.id}/edit`}>{value}</Link>
      },
      {
        intlMessage: messages.datamartToken,
        key: 'token',
        isVisibleByDefault: true,
        isHideable: false,
      },
      {
        intlMessage: messages.datamartType,
        key: 'type',
        isVisibleByDefault: true,
        isHideable: false,
        render: (value: string) => value === 'DATAMART' ? <FormattedMessage {...messages.typeStandard} /> : <FormattedMessage {...messages.typeXDatamart} />,
      }
    ];

    const emptyTable: {
      iconType: McsIconType;
      intlMessage: FormattedMessage.Props;
    } = {
        iconType: 'settings',
        intlMessage: messages.emptyDatamarts,
      };

    const additionnalComponent = (
      <div>
        <div className="mcs-card-header mcs-card-title">
          <span className="mcs-card-title">
            <FormattedMessage {...settingsMessages.datamarts} />
          </span>
        </div>
        <hr className="mcs-separator" />
      </div>
    );

    return (
      <div className="ant-layout">
        <Content className="mcs-content-container">
          <ItemList
            fetchList={this.fetchDatamarts}
            dataSource={this.state.data}
            loading={this.state.loading}
            total={this.state.total}
            columns={dataColumnsDefinition}
            actionsColumnsDefinition={actionsColumnsDefinition}
            pageSettings={PAGINATION_SEARCH_SETTINGS}
            emptyTable={emptyTable}
            additionnalComponent={additionnalComponent}
          />
        </Content>
      </div>
    );
  }
}

export default compose(withRouter, injectIntl, injectNotifications)(
  DatamartsListPage,
);

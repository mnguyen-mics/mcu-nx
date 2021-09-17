import * as React from 'react';
import lodash from 'lodash';
import { compose } from 'recompose';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import ItemList, { Filters } from '../../components/ItemList';
import { CustomDashboardResource } from '../../models/customDashboards/customDashboards';
import { PAGINATION_SEARCH_SETTINGS } from '../../utils/LocationSearchHelper';
import DashboardActionBar from './DashboardActionBar';
import messages from './messages';
import { lazyInject } from './../../config/inversify.config';
import { TYPES } from '../../constants/types';
import { McsIconType } from '@mediarithmics-private/mcs-components-library/lib/components/mcs-icon';
import { DataColumnDefinition } from '@mediarithmics-private/mcs-components-library/lib/components/table-view/table-view/TableView';
import { ICustomDashboardService } from '../../services/CustomDashboardService';
import { IDatamartService } from '../../services/DatamartService';
import { UserProfileResource } from '@mediarithmics-private/advanced-components/lib/models/directory/UserProfileResource';

const { Content } = Layout;

const initialState = {
  loading: false,
  data: [],
  total: 0,
};

interface DashboardListContentState {
  loading: boolean;
  data: CustomDashboardResource[];
  total: number;
}

interface RouterProps {
  organisationId: string;
}

export interface DashboardPageProps {
  userProfile: UserProfileResource;
}

class DashboardListContent extends React.Component<
  RouteComponentProps<RouterProps> & InjectedIntlProps & DashboardPageProps,
  DashboardListContentState
> {
  state = initialState;

  @lazyInject(TYPES.ICustomDashboardService)
  private _dashboardService: ICustomDashboardService;

  @lazyInject(TYPES.IDatamartService)
  private _datamartService: IDatamartService;

  getDatamartsOfSelectedOrg = (orgId: string) => {
    return this._datamartService.getDatamarts(orgId, undefined).then(x => x.data);
  };

  fetchDashboardList = (organisationId: string, filter: Filters) => {
    this.setState({ loading: true }, () => {
      const promiseDatamarts = this.getDatamartsOfSelectedOrg(organisationId);
      const promiseDashboards = promiseDatamarts.then(datamarts => {
        return Promise.all(
          datamarts.map(datamart => {
            return this._dashboardService
              .getDashboards(datamart.id, undefined)
              .then(resultDashboards => {
                if (resultDashboards) return resultDashboards.data;
                else return [];
              });
          }),
        ).then(arrayOfArraysDashboards => lodash.flattenDeep(arrayOfArraysDashboards));
      });

      promiseDashboards.then(dashboards => {
        this.setState({
          loading: false,
          data: dashboards,
          total: dashboards.length,
        });
      });
    });
  };

  render() {
    const {
      intl: { formatMessage },
    } = this.props;

    const dataColumnsDefinition: Array<DataColumnDefinition<CustomDashboardResource>> = [
      {
        title: formatMessage(messages.organisation),
        key: 'path',
        isHideable: false,
        className: 'mcs-table-image-col',
        render: (text: string, record: CustomDashboardResource) => (
          <span>{record.datamart_id}</span>
        ),
      },
      {
        title: formatMessage(messages.title),
        key: 'original_name',
        isHideable: false,
        render: (text: string, record: CustomDashboardResource) => (
          <span className='mcs-dashboards-table title_column'>{record.title}</span>
        ),
      },
      {
        title: formatMessage(messages.scopes),
        key: 'mime_type',
        isHideable: false,
        render: (text: string, record: CustomDashboardResource) => (
          <span>{record.scopes.join(', ')}</span>
        ),
      },
    ];

    const emptyTable: {
      iconType: McsIconType;
      message: string;
    } = {
      iconType: 'library',
      message: this.props.intl.formatMessage(messages.zzz),
    };

    return (
      <div className='ant-layout'>
        <DashboardActionBar onUploadDone={this.fetchDashboardList} />
        <div className='ant-layout'>
          <Content className='mcs-content-container'>
            <ItemList
              fetchList={this.fetchDashboardList}
              dataSource={this.state.data}
              loading={this.state.loading}
              total={this.state.total}
              columns={dataColumnsDefinition}
              pageSettings={PAGINATION_SEARCH_SETTINGS}
              emptyTable={emptyTable}
            />
          </Content>
        </div>
      </div>
    );
  }
}

const mapStatetoProps = (state: UserProfileResource) => ({
  userProfile: state,
});

export default compose<DashboardPageProps, {}>(
  connect(mapStatetoProps),
  withRouter,
  injectIntl,
)(DashboardListContent);

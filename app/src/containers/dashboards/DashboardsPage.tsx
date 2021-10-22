import * as React from 'react';
import lodash from 'lodash';
import { compose } from 'recompose';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { Layout, Tag, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
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
import { IOrganisationService } from '../../services/OrganisationService';
import { UserProfileResource } from '@mediarithmics-private/advanced-components/lib/models/directory/UserProfileResource';
import { InjectedNotificationProps } from '../Notifications/injectNotifications';
import { DatamartResource } from '../../models/datamart/DatamartResource';
import { getPaginatedApiParam } from '../../utils/ApiHelper';

const { Content } = Layout;

const initialState = {
  loading: false,
  data: [],
  total: 0,
  filters: {},
  scopeFilter: '',
  optionsOrg: [{ value: '' }],
};

const optionsScope = [
  {
    value: 'Segments',
  },
  {
    value: 'Builders',
  },
  {
    value: 'Home',
  },
];

interface DashboardListContentState {
  loading: boolean;
  data: CustomDashboardResource[];
  total: number;
  filters: Filters;
  optionsOrg: Array<{ value: string }>;
}

interface RouterProps {
  organisationId: string;
}

export interface DashboardPageProps {
  userProfile: UserProfileResource;
}

type Props = DashboardPageProps &
  InjectedIntlProps &
  InjectedNotificationProps &
  RouteComponentProps<RouterProps>;

class DashboardListContent extends React.Component<Props, DashboardListContentState> {
  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  @lazyInject(TYPES.ICustomDashboardService)
  private _dashboardService: ICustomDashboardService;

  @lazyInject(TYPES.IDatamartService)
  private _datamartService: IDatamartService;

  @lazyInject(TYPES.IOrganisationService)
  private _organisationService: IOrganisationService;

  getDatamartsOfSelectedOrg = (orgId: string) => {
    return this._datamartService.getDatamarts(orgId, undefined).then(x => x.data);
  };

  private organisationsMap = new Map();
  private datamartIdToOrganisationIdMap = new Map();

  fillDatamartsMap = (datamarts: DatamartResource[]) => {
    datamarts.forEach(datamart =>
      this.datamartIdToOrganisationIdMap.set(datamart.id, datamart.organisation_id),
    );
  };

  getOrgNameByDatamartId = (datamartId: string) => {
    if (this.datamartIdToOrganisationIdMap.has(datamartId)) {
      const orgId = this.datamartIdToOrganisationIdMap.get(datamartId);

      if (this.organisationsMap.has(orgId)) return `${this.organisationsMap.get(orgId)} - ${orgId}`;
      else return `${this.props.intl.formatMessage(messages.unknownOrganisation)} ${orgId}`;
    } else
      return `${this.props.intl.formatMessage(
        messages.unknownOrganisation,
      )} (datamart ${datamartId})`;
  };

  fetchDashboardList = (organisationId: string, filter: Filters) => {
    if (this.organisationsMap.size === 0)
      this._organisationService
        .getOrganisation(organisationId)
        .then(resultOrganisations => {
          if (resultOrganisations) {
            this.organisationsMap.set(resultOrganisations.data.id, resultOrganisations.data.name);
            this.setState({
              optionsOrg: [{ value: resultOrganisations.data.name }],
            });
          }
        })
        .catch(e => {
          this.props.notifyError(e);
          this.setState({
            loading: false,
          });
        });

    const options: {
      first_result: number;
      max_results: number;
      keywords?: string;
    } = {
      ...getPaginatedApiParam(filter.currentPage, filter.pageSize),
    };
    if (filter.keywords) {
      options.keywords = filter.keywords;
    }

    this.setState({ loading: true }, () => {
      const promiseDatamarts = this.getDatamartsOfSelectedOrg(organisationId);
      promiseDatamarts.then(datamarts => {
        this.fillDatamartsMap(datamarts);
        return Promise.all(
          datamarts.map(datamart => {
            return this._dashboardService
              .getDashboards(datamart.id, organisationId, options)
              .then(resultDashboards => {
                if (resultDashboards) return resultDashboards.data;
                else return [];
              });
          }),
        )
          .then(arrayOfArraysDashboards => lodash.flattenDeep(arrayOfArraysDashboards))
          .then(dashboards => {
            this.setState({
              loading: false,
              data: dashboards,
              total: dashboards.length,
            });
          })
          .catch(e => {
            this.props.notifyError(e);
            this.setState({
              loading: false,
            });
          });
      });
    });
  };

  prefixStringsList(prefix: string, keys: string[]): string[] {
    return keys.map(key => `${prefix}:${key}`);
  }

  transformScopesList(scopes: string[], segmentIds: string[], builderIds: string[]): string[] {
    const {
      intl: { formatMessage },
    } = this.props;

    return lodash.flattenDeep(
      scopes.map(scope => {
        switch (scope.toLowerCase()) {
          case 'segments':
            if (!segmentIds || segmentIds.length === 0) return [formatMessage(messages.segments)];
            else return this.prefixStringsList(formatMessage(messages.segment), segmentIds);
          case 'builders':
            if (!builderIds || builderIds.length === 0)
              return [formatMessage(messages.segmentBuilders)];
            else return this.prefixStringsList(formatMessage(messages.segmentBuilder), builderIds);
          default:
            return scope;
        }
      }),
    );
  }

  renderListToTags = (scopes: string[]) => {
    return scopes.map(scope => {
      let color: string;

      if (
        scope.toLowerCase().indexOf('segment') !== -1 &&
        scope.toLowerCase().indexOf('builder') === -1
      )
        color = 'mcs-dashboardsTable_tag mcs-dashboardsTable_tag--blue';
      else if (
        scope.toLowerCase().indexOf('segment') !== -1 &&
        scope.toLowerCase().indexOf('builder') !== -1
      )
        color = 'mcs-dashboardsTable_tag mcs-dashboardsTable_tag--green';
      else if (scope.toLowerCase().indexOf('home') !== -1)
        color = 'mcs-dashboardsTable_tag mcs-dashboardsTable_tag--purple';
      else color = '';

      return (
        <Tag key={scopes.indexOf(scope)} className={color}>
          {scope}
        </Tag>
      );
    });
  };

  clearScopeFilterAndRefreshTable = () => {
    this.setState({
      filters: { scope: '' },
    });
  };

  onSelectScope = (data: string) => {
    this.setState({
      filters: { scope: data },
    });
  };

  renderInputPlaceholder(value: string) {
    return (
      <div>
        <span className='mcs-dashboardsFilters_placeholder'>{value}</span>
        <FilterOutlined className='mcs-dashboards_filterIcon' />
      </div>
    );
  }

  renderActionBarInnerElements() {
    const { optionsOrg } = this.state;

    return (
      <div className='mcs-dashboardsFilters'>
        <Select
          showSearch={true}
          allowClear={true}
          showArrow={false}
          options={optionsScope}
          onSelect={this.onSelectScope}
          onClear={this.clearScopeFilterAndRefreshTable}
          placeholder={this.renderInputPlaceholder('Scope')}
          className='mcs-dashboardsFilters_scope mcs-dashboardsFilters_input'
        />
        <Select
          showSearch={true}
          allowClear={true}
          showArrow={false}
          options={optionsOrg}
          placeholder={this.renderInputPlaceholder('Organisation')}
          className='mcs-dashboardsFilters_organisation mcs-dashboardsFilters_input'
        />
      </div>
    );
  }

  render() {
    const {
      intl: { formatMessage },
    } = this.props;

    const dataColumnsDefinition: Array<DataColumnDefinition<CustomDashboardResource>> = [
      {
        title: formatMessage(messages.organisation),
        key: 'path',
        isHideable: false,
        render: (text: string, record: CustomDashboardResource) => (
          <span className='mcs-dashboardsTable_OrgColumn'>
            {this.getOrgNameByDatamartId(record.organisation_id ? record.organisation_id : '-')}
          </span>
        ),
      },
      {
        title: formatMessage(messages.title),
        key: 'original_name',
        isHideable: false,
        render: (text: string, record: CustomDashboardResource) => (
          <span className='mcs-dashboardsTable_TitleColumn'>{record.title}</span>
        ),
      },
      {
        title: formatMessage(messages.scopes),
        key: 'mime_type',
        isHideable: false,
        render: (text: string, record: CustomDashboardResource) => (
          <span className='mcs-dashboardsTable_ScopeColumn'>
            {this.renderListToTags(
              this.transformScopesList(record.scopes, record.segment_ids, record.builder_ids),
            )}
          </span>
        ),
      },
    ];

    const emptyTable: {
      iconType: McsIconType;
      message: string;
    } = {
      iconType: 'library',
      message: this.props.intl.formatMessage(messages.emptyTableMessage),
    };

    return (
      <div className='ant-layout'>
        <DashboardActionBar
          onUploadDone={this.fetchDashboardList}
          innerElement={this.renderActionBarInnerElements()}
        />
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
              filters={this.state.filters}
              className='mcs-dashboardsTable_Container'
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

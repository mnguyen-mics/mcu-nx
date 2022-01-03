import * as React from 'react';
import lodash from 'lodash';
import { compose } from 'recompose';
import { withRouter, RouteComponentProps } from 'react-router';
import { Layout, Tag, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import ItemList, { Filters } from '../../../components/ItemList';
import { PAGINATION_SEARCH_SETTINGS } from '../../../utils/LocationSearchHelper';
import DashboardActionBar from './DashboardActionBar';
import messages from './messages';
import { McsIconType } from '@mediarithmics-private/mcs-components-library/lib/components/mcs-icon';
import {
  ActionsColumnDefinition,
  DataColumnDefinition,
} from '@mediarithmics-private/mcs-components-library/lib/components/table-view/table-view/TableView';
import { UserProfileResource } from '@mediarithmics-private/advanced-components/lib/models/directory/UserProfileResource';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import { getPaginatedApiParam } from '../../../utils/ApiHelper';
import { Card } from '@mediarithmics-private/mcs-components-library';
import {
  lazyInject,
  TYPES,
  CustomDashboardResource,
  ICustomDashboardService,
} from '@mediarithmics-private/advanced-components';
import { IOrganisationService } from '@mediarithmics-private/advanced-components/lib/services/OrganisationService';
import { dashboardsDefinition } from '../../../routes/dashboardsRoutes';
import { Link } from 'react-router-dom';

const { Content } = Layout;

const initialState = {
  loading: false,
  data: [],
  total: 0,
  filters: {},
  scopeFilter: '',
  optionsOrg: [{ value: '' }],
  organisationsMap: new Map(),
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
  {
    value: 'Console',
  },
];

interface DashboardListContentState {
  loading: boolean;
  data: CustomDashboardResource[];
  total: number;
  filters: Filters;
  optionsOrg: Array<{ value: string }>;
  organisationsMap: Map<string, string>;
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

  @lazyInject(TYPES.IOrganisationService)
  private _organisationService: IOrganisationService;

  fetchDashboardList = (organisationId: string, filter: Filters) => {
    const { organisationsMap } = this.state;

    if (!organisationsMap.get(organisationId))
      this._organisationService
        .getOrganisation(organisationId)
        .then(resultOrganisations => {
          if (resultOrganisations) {
            organisationsMap.set(resultOrganisations.data.id, resultOrganisations.data.name);
            this.setState({
              optionsOrg: [{ value: resultOrganisations.data.name }],
              organisationsMap: organisationsMap,
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
      return this._dashboardService
        .getDashboards(organisationId, options)
        .then(dashboards => {
          this.setState({
            loading: false,
            data: dashboards.data,
            total: dashboards.total ? dashboards.total : dashboards.data.length,
          });
        })
        .catch(e => {
          this.props.notifyError(e);
          this.setState({
            loading: false,
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

  onClickDashboard = (dashboard: CustomDashboardResource) => {
    const {
      history,
      match: {
        params: { organisationId },
      },
    } = this.props;
    history.push(
      `/o/${organisationId}${dashboardsDefinition.dashboardEdit.path.replace(
        ':dashboardId',
        dashboard.id,
      )}`,
    );
  };

  renderInputPlaceholder(value: string) {
    return (
      <div>
        <span className='mcs-actionBar_placeholderFilter'>{value}</span>
        <FilterOutlined className='mcs-actionBar_iconFilter' />
      </div>
    );
  }

  renderActionBarInnerElements() {
    const { optionsOrg } = this.state;

    return (
      <div className='mcs-actionBar_filters'>
        <Select
          showSearch={true}
          allowClear={true}
          showArrow={false}
          options={optionsScope}
          onSelect={this.onSelectScope}
          onClear={this.clearScopeFilterAndRefreshTable}
          placeholder={this.renderInputPlaceholder('Scope')}
          className='mcs-actionBar_filterInput'
        />
        <Select
          showSearch={true}
          allowClear={true}
          showArrow={false}
          options={optionsOrg}
          placeholder={this.renderInputPlaceholder('Organisation')}
          className='mcs-actionBar_filterInput'
        />
      </div>
    );
  }

  render() {
    const {
      intl: { formatMessage },
    } = this.props;

    const { data, loading, total, organisationsMap } = this.state;

    const actionsColumnsDefinition: Array<ActionsColumnDefinition<CustomDashboardResource>> = [
      {
        key: 'action',
        actions: () => [
          {
            message: formatMessage(messages.modifyDashboard),
            callback: this.onClickDashboard,
          },
        ],
      },
    ];

    const dataColumnsDefinition: Array<DataColumnDefinition<CustomDashboardResource>> = [
      {
        title: formatMessage(messages.organisation),
        key: 'path',
        isHideable: false,
        render: (text: string, record: CustomDashboardResource) => (
          <span className='mcs-dashboardsTable_OrgColumn'>
            {record.organisation_id ? organisationsMap.get(record.organisation_id) : '-'}
          </span>
        ),
      },
      {
        title: formatMessage(messages.title),
        key: 'original_name',
        isHideable: false,
        render: (text: string, record: CustomDashboardResource) => (
          <Link
            to={`/o/${record.organisation_id}${dashboardsDefinition.dashboardEdit.path.replace(
              ':dashboardId',
              record.id,
            )}`}
          >
            <span className='mcs-dashboardsTable_TitleColumn'>{record.title}</span>
          </Link>
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
        <DashboardActionBar innerElement={this.renderActionBarInnerElements()} />
        <div className='ant-layout'>
          <Content className='mcs-content-container'>
            <Card>
              <ItemList
                fetchList={this.fetchDashboardList}
                dataSource={data}
                loading={loading}
                total={total}
                columns={dataColumnsDefinition}
                pageSettings={PAGINATION_SEARCH_SETTINGS}
                emptyTable={emptyTable}
                className='mcs-dashboardsTable_Container'
                actionsColumnsDefinition={actionsColumnsDefinition}
              />
            </Card>
          </Content>
        </div>
      </div>
    );
  }
}

export default compose(withRouter, injectIntl, injectNotifications)(DashboardListContent);

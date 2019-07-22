import * as React from 'react';
import { compose } from 'recompose';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Row, Button, Layout, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import { getPaginatedApiParam } from '../../../../../utils/ApiHelper';
import settingsMessages from '../../../messages';
import messages from './messages';
import { UserWorkspaceResource } from '../../../../../models/directory/UserProfileResource';
import SitesTable from './SitesTable';
import { injectDatamart, InjectedDatamartProps } from '../../../../Datamart';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../../../Notifications/injectNotifications';
import { Filter } from '../../Common/domain';
import { ChannelResource } from '../../../../../models/settings/settings';
import {
  updateSearch,
  DATAMART_SEARCH_SETTINGS,
  KEYWORD_SEARCH_SETTINGS,
  parseSearch,
  compareSearches,
} from '../../../../../utils/LocationSearchHelper';
import { Index } from '../../../../../utils';
import { MultiSelectProps } from '../../../../../components/MultiSelect';
import { getWorkspace } from '../../../../../state/Session/selectors';
import { connect } from 'react-redux';
import { lazyInject } from '../../../../../config/inversify.config';
import { IChannelService } from '../../../../../services/ChannelService';
import { TYPES } from '../../../../../constants/types';

const { Content } = Layout;

export interface SitesListPageProps {
  datamartId?: string;
}

interface SiteListState {
  sites: ChannelResource[];
  totalSites: number;
  isFetchingSites: boolean;
  noSiteYet: boolean;
  filter: Filter;
}
interface MapStateToProps {
  workspace: (organisationId: string) => UserWorkspaceResource;
}

type Props = SitesListPageProps &
  RouteComponentProps<{ organisationId: string }> &
  InjectedDatamartProps &
  MapStateToProps &
  InjectedNotificationProps;

class SitesListPage extends React.Component<Props, SiteListState> {

  @lazyInject(TYPES.IChannelService)
  private _channelService: IChannelService;

  constructor(props: Props) {
    super(props);
    this.state = {
      sites: [],
      totalSites: 0,
      isFetchingSites: true,
      noSiteYet: false,
      filter: {
        currentPage: 1,
        pageSize: 10,
        keywords: '',
      },
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { organisationId },
      },
      location: { search },
      datamart,
      datamartId,
    } = this.props;
    const filter = parseSearch(search, this.getSearchSetting(organisationId));
    const calculatedDatamartId = datamartId ? datamartId : (filter.datamartId ? filter.datamartId : datamart.id);
    this.setState({
      isFetchingSites: true,
    });
    this.fetchSites(organisationId, calculatedDatamartId, this.state.filter).then(() => {
      this.setState({
        isFetchingSites: false,
      });
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    const {
      location: { search },
      match: {
        params: { organisationId },
      },
      datamartId,
    } = this.props;

    const {
      location: { search: nextSearch },
      match: {
        params: { organisationId: nextOrganisationId },
      },
      datamartId: nextDatamartId,
    } = nextProps;

    if (
      nextOrganisationId !== organisationId ||
      !compareSearches(search, nextSearch) ||
      datamartId !== nextDatamartId
    ) {
      const nextFilter = parseSearch(
        nextSearch,
        this.getSearchSetting(nextOrganisationId),
      );
      const calculatedDatamartId = datamartId ? datamartId : nextFilter.datamartId;
      this.setState({
        isFetchingSites: true,
      });
      this.fetchSites(organisationId, calculatedDatamartId, this.state.filter).then(
        () => {
          this.setState({
            isFetchingSites: false,
          });
        },
      );
    }
  }

  handleArchiveSite = () => {
    // to do
  };

  handleEditSite = (site: ChannelResource) => {
    const {
      match: {
        params: { organisationId },
      },
      location,
      history,
    } = this.props;

    history.push({
      pathname: `/v2/o/${organisationId}/settings/datamart/${site.datamart_id}/sites/${site.id}/edit`,
      state: { from: `${location.pathname}${location.search}`}
    });
  };

  handleFilterChange = (newFilter: Filter) => {
    const {
      match: {
        params: { organisationId },
      },
      datamart,
      datamartId,
      location: {
        search
      }
    } = this.props;
    this.setState({ filter: newFilter });
    const filters = parseSearch(search, this.getSearchSetting(organisationId));
    this.fetchSites(
      organisationId,
      filters.datamartId ? filters.datamartId : datamart.id,
      newFilter,
    );
    const calculatedDatamartId = datamartId ? datamartId : (filters.datamartId ? filters.datamartId : datamart.id);
    this.fetchSites(organisationId, calculatedDatamartId, newFilter);
  };

  fetchSites = (organisationId: string, datamartId: string, filter: Filter) => {
    const buildGetSitesOptions = () => {
      const options = {
        ...getPaginatedApiParam(filter.currentPage, filter.pageSize),
        channel_type: 'SITE',
      };

      if (filter.keywords) {
        return {
          ...options,
          keywords: filter.keywords,
        };
      }
      return options;
    };

    return this._channelService.getChannels(
      organisationId,
      datamartId,
      buildGetSitesOptions(),
    )
      .then(response => {
        this.setState({
          isFetchingSites: false,
          noSiteYet: response && response.count === 0 && !filter.keywords,
          sites: response.data,
          totalSites: response.total ? response.total : response.count,
        });
      })
      .catch(error => {
        this.setState({ isFetchingSites: false });
        this.props.notifyError(error);
      });
  };

  buildNewActionElement = (organisationId: string, datamartId: string) => {
    return (
      <Link
        key={messages.newSite.id}
        to={`/v2/o/${organisationId}/settings/datamart/sites/create`}
      >
        <Button key={messages.newSite.id} type="primary" htmlType="submit">
          <FormattedMessage {...messages.newSite} />
        </Button>
      </Link>
    );
  };

  getSearchSetting(organisationId: string) {
    return [...KEYWORD_SEARCH_SETTINGS, ...DATAMART_SEARCH_SETTINGS];
  }

  updateLocationSearch = (params: Index<any>) => {
    const {
      history,
      match: {
        params: { organisationId },
      },
      location: { search: currentSearch, pathname },
    } = this.props;

    const nextLocation = {
      pathname,
      search: updateSearch(
        currentSearch,
        params,
        this.getSearchSetting(organisationId),
      ),
    };

    history.push(nextLocation);
  };

  render() {
    const {
      match: {
        params: { organisationId },
      },
      location: { search },
      datamart,
      datamartId,
      workspace,
    } = this.props;

    const {
      isFetchingSites,
      totalSites,
      sites,
      noSiteYet,
      filter,
    } = this.state;

    const newButton = this.buildNewActionElement(organisationId, datamart.id);
    const buttons = [newButton];

    const datamartItems = workspace(organisationId).datamarts.map(d => ({
      key: d.id,
      value: d.name || d.token,
    }));

    const filtersOptions: Array<MultiSelectProps<any>> = [];

    if (workspace(organisationId).datamarts.length > 1) {
      const filterData = parseSearch(
        search,
        this.getSearchSetting(organisationId),
      );
      const datamartFilter = {
        displayElement: (
          <div>
            <FormattedMessage id="settings.datamart.site.list.datamartFilter" defaultMessage="Datamart" />{' '}
            <Icon type="down" />
          </div>
        ),
        selectedItems: filterData.datamartId
          ? [datamartItems.find(di => di.key === filterData.datamartId)]
          : [datamartItems[0]],
        items: datamartItems,
        singleSelectOnly: true,
        getKey: (item: any) => (item && item.key ? item.key : ''),
        display: (item: any) => item.value,
        handleItemClick: (datamartItem: { key: string; value: string }) => {
          this.updateLocationSearch({
            datamartId:
              datamartItem && datamartItem.key ? datamartItem.key : undefined,
            currentPage: 1,
          });
        },
      };
      if (!datamartId) {
        filtersOptions.push(datamartFilter);
      }
    }

    return (
      <div className="ant-layout">
        <Content className="mcs-content-container">
          <Row className="mcs-table-container">
            <div>
              <div className="mcs-card-header mcs-card-title">
                <span className="mcs-card-title">
                  <FormattedMessage {...settingsMessages.sites} />
                </span>
                <span className="mcs-card-button">{buttons}</span>
              </div>
              <hr className="mcs-separator" />
              <SitesTable
                dataSource={sites}
                totalSites={totalSites}
                isFetchingSites={isFetchingSites}
                noSiteYet={noSiteYet}
                filter={filter}
                onFilterChange={this.handleFilterChange}
                onArchiveSite={this.handleArchiveSite}
                onEditSite={this.handleEditSite}
                filtersOptions={filtersOptions}
              />
            </div>
          </Row>
        </Content>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  workspace: getWorkspace(state),
});

export default compose<Props, SitesListPageProps>(
  withRouter,
  injectDatamart,
  injectNotifications,
  connect(mapStateToProps),
)(SitesListPage);

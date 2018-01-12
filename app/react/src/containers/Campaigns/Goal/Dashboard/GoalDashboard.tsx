import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { withRouter, RouteComponentProps } from 'react-router';
import { Layout } from 'antd';
import { compose } from 'recompose';
import GoalHeader from './GoalHeader';
import Card from '../../../../components/Card/Card';
import {
  GoalResource,
  AttributionSelectionResource,
} from '../../../../models/goal';
import GoalService from '../../../../services/GoalService';
import GoalActionbar from './GoalActionbar';
import {
  DATE_SEARCH_SETTINGS,
  buildDefaultSearch,
  compareSearches,
  isSearchValid,
  parseSearch,
  updateSearch,
} from '../../../../utils/LocationSearchHelper';
import messages from './messages';
import McsDateRangePicker, {
  McsDateRangeValue,
} from '../../../../components/McsDateRangePicker';
import McsTabs from '../../../../components/McsTabs';
import McsMoment from '../../../../utils/McsMoment';
import GoalStackedAreaChart from './GoalChart';
import GoalAttribution from './GoalAttribution';

const { Content } = Layout;

export interface Filters {
  from?: McsMoment;
  to?: McsMoment;
}

interface GoalItem {
  item: GoalResource | undefined;
  isLoading: boolean;
}

interface AttributionModels {
  items: AttributionSelectionResource[];
  isLoading: boolean;
}

interface GoalDashboardProps {}

interface GoalDashboardState {
  goalObject: GoalItem;
  attributionModels: AttributionModels;
}

interface GoalRouteParams {
  organisationId: string;
  goalId: string;
}

type JoinedProps = GoalDashboardProps &
  RouteComponentProps<GoalRouteParams> &
  InjectedIntlProps;

class GoalDashboard extends React.Component<JoinedProps, GoalDashboardState> {
  constructor(props: JoinedProps) {
    super(props);
    this.state = {
      goalObject: {
        item: undefined,
        isLoading: true,
      },
      attributionModels: {
        items: [],
        isLoading: true,
      },
    };
  }

  componentDidMount() {
    const {
      match: { params: { goalId } },
      location: { search, pathname },
      history,
    } = this.props;

    if (!isSearchValid(search, DATE_SEARCH_SETTINGS)) {
      history.replace({
        pathname: pathname,
        search: buildDefaultSearch(search, DATE_SEARCH_SETTINGS),
        state: { reloadDataSource: true },
      });
    } else {
      const filter = parseSearch(search, DATE_SEARCH_SETTINGS);

      this.fetchGoal(goalId, filter);
    }
  }

  componentWillReceiveProps(nextProps: JoinedProps) {
    const {
      history,
      location: { search },
      match: { params: { organisationId } },
    } = this.props;

    const {
      location: { pathname: nextPathname, search: nextSearch },
      match: {
        params: { organisationId: nextOrganisationId, goalId: nextGoalId },
      },
    } = nextProps;

    if (
      !compareSearches(search, nextSearch) ||
      organisationId !== nextOrganisationId
    ) {
      if (!isSearchValid(nextSearch, DATE_SEARCH_SETTINGS)) {
        history.replace({
          pathname: nextPathname,
          search: buildDefaultSearch(nextSearch, DATE_SEARCH_SETTINGS),
          state: { reloadDataSource: organisationId !== nextOrganisationId },
        });
      } else {
        const filter = parseSearch(nextSearch, DATE_SEARCH_SETTINGS);
        this.fetchGoal(nextGoalId, filter);
      }
    }
  }

  fetchGoal = (goalId: string, options: object) => {
    return GoalService.getGoal(goalId, options)
      .then(res => res.data)
      .then(res => {
        this.setState({ goalObject: { isLoading: false, item: res } });
        return GoalService.getAttributionModel(res.id);
      })
      .then(res => res.data)
      .then(res =>
        this.setState({ attributionModels: { isLoading: false, items: res } }),
      );
  };

  updateLocationSearch = (params: Filters) => {
    const {
      history,
      location: { search: currentSearch, pathname },
    } = this.props;

    const nextLocation = {
      pathname,
      search: updateSearch(currentSearch, params, DATE_SEARCH_SETTINGS),
    };

    history.push(nextLocation);
  };

  renderDatePicker() {
    const { history: { location: { search } } } = this.props;

    const filter = parseSearch(search, DATE_SEARCH_SETTINGS);

    const values = {
      from: filter.from,
      to: filter.to,
    };

    const onChange = (newValues: McsDateRangeValue) =>
      this.updateLocationSearch({
        from: newValues.from,
        to: newValues.to,
      });

    return (
      <div style={{ marginBottom: 5 }}>
        <McsDateRangePicker values={values} onChange={onChange} />
      </div>
    );
  }

  renderItems = () => {
    return this.state.attributionModels.items.map(am => {
      const title =
        am.attribution_type === 'DIRECT' ? 'Direct' : am.attribution_model_name;
      return {
        title: title,
        display: <GoalAttribution attributionModelId={am.id} />,
      };
    });
  };

  render() {
    const {
      intl: {
        formatMessage,
      }
    } = this.props;
    const archiveObject = (id: string) => {
      // TODO
    };
    return (
      <div className="ant-layout">
        <GoalActionbar
          object={this.state.goalObject.item}
          archiveObject={archiveObject}
        />
        <div className="ant-layout">
          <Content className="mcs-content-container">
            <GoalHeader object={this.state.goalObject.item} />
            <Card title={formatMessage(messages.conversions)} buttons={this.renderDatePicker()}>
              <GoalStackedAreaChart />
            </Card>
            <Card>
              {this.state.attributionModels.items.length ? (
                <McsTabs items={this.renderItems()} />
              ) : null}
            </Card>
          </Content>
        </div>
      </div>
    );
  }
}

export default compose(injectIntl, withRouter)(GoalDashboard);

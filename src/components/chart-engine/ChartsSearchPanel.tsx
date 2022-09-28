import * as React from 'react';
import { Loading } from '@mediarithmics-private/mcs-components-library';
import { TYPES } from '../../constants/types';
import { IChartService } from '../../services/ChartsService';
import { ChartResource } from '../../models/chart/Chart';
import Search from 'antd/lib/input/Search';
import { List } from 'antd';
import { compose } from 'recompose';
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl';
import {
  AreaChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  RadarChartOutlined,
  SmallDashOutlined,
  TableOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import UserResource from '../../models/directory/UserResource';
import injectNotifications, {
  InjectedNotificationProps,
} from '../notifications/injectNotifications';
import { lazyInject } from '../../inversify/inversify.config';
import { IUsersService } from '../../services/UsersService';
import { ChartType } from '../../services/ChartDatasetService';

const messages = defineMessages({
  modifiedBy: {
    id: 'components.chartsSearchPanel.modifiedBy',
    defaultMessage: 'Modified by',
  },
  daysAgo: {
    id: 'components.chartsSearchPanel.daysAgo',
    defaultMessage: 'days ago',
  },
});

export interface ChartsSearchPanelProps {
  organisationId: string;
  title?: string;
  onItemClick?: (item: ChartResource) => void;
  chartItem?: ChartResource | string;
}

export function isChartResource(
  chartResource: ChartResource | string,
): chartResource is ChartResource {
  return (chartResource as ChartResource).id !== undefined;
}

export interface State {
  isLoading: boolean;
  charts: ChartResource[];
  selectedChart?: ChartResource | string;
  usersMap: Map<string, UserResource>;
}

type Props = ChartsSearchPanelProps & InjectedIntlProps & InjectedNotificationProps;

class ChartsSearchPanel extends React.Component<Props, State> {
  @lazyInject(TYPES.IChartService)
  private _chartService: IChartService;

  @lazyInject(TYPES.IUsersService)
  private _usersService: IUsersService;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      charts: [],
      usersMap: new Map(),
      selectedChart: props.chartItem,
    };
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    const { chartItem } = this.props;
    const { chartItem: prevChartItem } = prevProps;
    if (!_.isEqual(chartItem, prevChartItem)) {
      if (chartItem)
        this.setState({
          selectedChart: chartItem,
        });
      else this.fetchData();
    }
  }

  daysBetween = (startDate: Date, endDate: Date) => {
    const oneDay = 1000 * 60 * 60 * 24;

    return Math.round((endDate.getTime() - startDate.getTime()) / oneDay);
  };

  getIconByType = (type: ChartType | undefined, className?: string) => {
    if (type) {
      switch (type) {
        case 'pie':
          return <PieChartOutlined className={className} />;
        case 'bars':
          return <BarChartOutlined className={className} />;
        case 'radar':
          return <RadarChartOutlined className={className} />;
        case 'area':
          return <AreaChartOutlined className={className} />;
        default:
          return <TableOutlined className={className} />;
      }
    } else return <TableOutlined className={className} />;
  };

  fetchData = async (searchValue?: string) => {
    const { organisationId } = this.props;
    const { usersMap } = this.state;
    const filters = searchValue && searchValue.length > 0 ? { title: searchValue } : undefined;
    const charts = await this.fetchCharts(organisationId, { ...filters, max_results: 500 });

    this.setState({
      isLoading: false,
      charts: charts,
    });

    const userIds =
      charts !== undefined
        ? charts.map(chart => chart.last_modified_by).filter(userId => userId !== undefined)
        : [];

    const uniqueUserIds: string[] = Array.from(new Set(userIds)).filter((id): id is string => !!id);

    this.fetchUsers(uniqueUserIds).then(users => {
      const updatedUsersMap = new Map(usersMap);
      users.forEach(user => {
        updatedUsersMap.set(user.id, user);
      });
      this.setState({
        usersMap: updatedUsersMap,
      });
    });
  };

  fetchCharts = async (organisationId: string, filters?: object): Promise<ChartResource[]> => {
    const { notifyError } = this.props;
    return this._chartService
      .getCharts(organisationId, { ...filters, order_by: '-last_modified_ts' })
      .then(result => result.data)
      .catch(err => {
        notifyError(err);
        return [];
      });
  };

  fetchUsers = async (userIds: string[]): Promise<UserResource[]> => {
    const { notifyError } = this.props;
    const { usersMap } = this.state;

    const usersToFetch = userIds.filter(userId => !usersMap.has(userId));

    if (usersToFetch.length > 1)
      return this._usersService
        .getUsers({ max_results: 5000 })
        .then(res => {
          return res.data.filter(user => !!userIds.find(userId => userId === user.id));
        })
        .catch(e => {
          notifyError(e);
          return [];
        });
    else return Promise.resolve([]);
  };

  onSearch = (value: string) => {
    this.setState({
      isLoading: true,
    });
    this.fetchData(value);
  };

  renderItem = (item: ChartResource) => {
    const { onItemClick, intl } = this.props;
    const { usersMap, selectedChart } = this.state;

    let userName: string | undefined;
    if (item.last_modified_by) {
      if (usersMap.has(item.last_modified_by)) {
        const user = usersMap.get(item.last_modified_by);
        if (user) userName = `${user.first_name} ${user.last_name}`;
      } else userName = undefined;
    }

    const onClick = () => {
      this.setState({ selectedChart: item });
      if (onItemClick) onItemClick(item);
    };

    let isSelectedItem = false;
    if (selectedChart !== undefined) {
      if (isChartResource(selectedChart)) isSelectedItem = selectedChart === item;
      else isSelectedItem = selectedChart === item.id;
    }

    return (
      <div
        className={
          'mcs-charts-list-item' + (isSelectedItem ? ' mcs-charts-list-item_selected' : '')
        }
        onClick={onClick}
      >
        <span className='mcs-charts-list_title'>{item.title}</span>
        <span>
          <span className='mcs-charts-list-item_author'>
            {userName && `${intl.formatMessage(messages.modifiedBy)} ${userName}`}
            {!userName && (
              <span>
                {`${intl.formatMessage(messages.modifiedBy)} `}
                <SmallDashOutlined className='mcs-charts-list-item_placeholder' />
              </span>
            )}
          </span>
          <span className='mcs-charts-list-item_date'>
            {item.last_modified_ts
              ? `${this.daysBetween(
                  new Date(item.last_modified_ts),
                  new Date(),
                )} ${intl.formatMessage(messages.daysAgo)}`
              : ''}
          </span>
        </span>
        {this.getIconByType(item.type, 'mcs-charts-list-item_icon')}
      </div>
    );
  };

  render() {
    const { title } = this.props;
    const { isLoading, charts } = this.state;

    return (
      <div className='mcs-charts-search-panel'>
        {title ? <div className='mcs-charts-search-panel_title'>{title}</div> : <div />}
        <Search
          className='mcs-charts-search-panel_search-bar'
          placeholder='Search'
          onSearch={this.onSearch}
        />
        {isLoading && <Loading isFullScreen={true} />}
        {!isLoading && (
          <List itemLayout='horizontal' dataSource={charts} renderItem={this.renderItem} />
        )}
      </div>
    );
  }
}

export default compose<ChartsSearchPanelProps, ChartsSearchPanelProps>(
  injectNotifications,
  injectIntl,
)(ChartsSearchPanel);

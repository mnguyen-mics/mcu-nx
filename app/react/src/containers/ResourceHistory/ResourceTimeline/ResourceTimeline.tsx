import * as React from 'react';
import { Col, Spin, Timeline, Icon } from 'antd';
import lodash from 'lodash';
import moment from 'moment';
import { InjectedIntlProps, FormattedMessage, injectIntl } from "react-intl";

import { ResourceType, HistoryEventShape } from "../../../models/resourceHistory/ResourceHistory";
import ResourceHistoryService from "../../../services/ResourceHistoryService";
import messages from './messages';
import { McsIcon } from '../../../components';
import { compose } from 'recompose';
import { withRouter, RouteComponentProps } from 'react-router';
import HistoryEventCard from './HistoryEventCard';
import { FormatProperty } from './domain';

export interface Events {
  isLoading: boolean;
  hasItems: boolean;
  items: HistoryEventShape[];
  byDay: {
    [date: string]: HistoryEventShape[];
  };
  byTime: {
    [time: string]: HistoryEventShape[];
  }
}

export interface ResourceTimelineProps {
  resourceType: ResourceType;
  resourceId: string;
  formatProperty: FormatProperty;
}

interface State {
  events: Events;
  nextTime?: string;
  eventCountOnOldestTime: number;
}

type Props = ResourceTimelineProps &
  RouteComponentProps<{ organisationId: string}> &
  InjectedIntlProps;

class ResourceTimeline extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      events: {
        isLoading: false,
        hasItems: false,
        items: [],
        byDay: {},
        byTime: {},
      },
      eventCountOnOldestTime: 0,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { organisationId },
      },
      resourceType,
      resourceId,
    } = this.props;

    this.fetchEvents(
      organisationId,
      resourceType,
      resourceId);
  }

  groupByDate = (array: any[], key: any) => {
    return lodash.groupBy(array, value => {
      return moment(value[key]).format('YYYY-MM-DD');
    });
  };

  groupByTime = (array: any[], key: any) => {
    return lodash.groupBy(array, value => {
      return moment(value[key]).format('YYYY-MM-DD HH:mm:ss');
    });
  }

  fetchEvents = (
    organisationId: string,
    resourceType: ResourceType,
    resourceId: string,
  ) => {
    const { nextTime, eventCountOnOldestTime } = this.state;
    const params = nextTime
      ? { resource_type: resourceType, resource_id: resourceId, max_results: 10 + eventCountOnOldestTime, to: nextTime }
      : { resource_type: resourceType, resource_id: resourceId, max_results: 10 };
    this.setState(
      (prevState: any) => {
        const nextState = {
          events: {
            ...prevState.events,
            isLoading: true,
          },
        };
        return nextState;
      },
      () =>
        ResourceHistoryService.getResourceHistory(
          organisationId,
          params,
        )
        .then(response => {
          response.count === 0
            ? this.setState(
              {
                events: {
                  isLoading: false,
                  hasItems: false,
                  items: [],
                  byDay: {},
                  byTime: {},
                },
                eventCountOnOldestTime: 0,
              }
            )
            : ResourceHistoryService.getResourceHistory(
                organisationId,
                {...params, max_results: params.max_results + 1},
              )
                .then(extendedResponse => {
                  this.setState(prevState => {
                    const newData = prevState.events.items.concat(response.data.slice(eventCountOnOldestTime).map(rhr => {
                      return rhr.events
                    }).reduce((x,y) => x.concat(y), []));
                    const nextState = {
                      events: {
                        ...prevState.events,
                        isLoading: false,
                        hasItems: response.count !== extendedResponse.count,
                        items: newData,
                        byDay: this.groupByDate(newData, 'timestamp'),
                        byTime:  this.groupByTime(newData, 'timestamp')
                      },
                      nextTime:
                        response.count !== extendedResponse.count &&
                        response.data &&
                        response.data[response.data.length - 1]
                          ? moment(
                              response.data[response.data.length - 1].events[response.data[response.data.length - 1].events.length - 1].timestamp,
                            ).format('x')
                          : undefined,
                      eventCountOnOldestTime: 0,
                    };
                    nextState.eventCountOnOldestTime = nextState.events.byTime[Object.keys(nextState.events.byTime)[Object.keys(nextState.events.byTime).length - 1]].length;
                    return nextState;
                  });
                })
          })
          .catch(err => {
            this.setState(prevState => {
              const nextState = {
                events: {
                  hasItems: false,
                  isLoading: false,
                  items: [],
                  byDay: {},
                  byTime: {},
                },
                eventCountOnOldestTime: 0,
              };
              return nextState;
            });
          }),
    );
  };

  fetchNewEvents = (e: any) => {
    const {
      match: {
        params: { organisationId },
      },
      resourceType,
      resourceId,
    } = this.props;
    e.preventDefault();
    this.fetchEvents(
      organisationId,
      resourceType,
      resourceId,
    );
  };

  renderPendingTimeline = (events: Events) => {
    if (events.hasItems) {
      return events.isLoading ? (
        <Spin size="small" />
      ) : (
        <button
          className="mcs-card-inner-action"
          onClick={this.fetchNewEvents}
        >
          <FormattedMessage {...messages.seeMore} />
        </button>
      );
    } else {
      return (
        <div className="mcs-title">
          {events.hasItems ? (
            <FormattedMessage {...messages.noEvents} />
          ) : (
            <FormattedMessage {...messages.noEventsLeft} />
          )}
        </div>
      );
    }
  }

  renderDate = (day: string) => {
    const {
      intl: { formatMessage },
    } = this.props;
    switch (day) {
      case moment().format('YYYY-MM-DD'):
        return formatMessage(messages.today);
      case moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD'):
        return formatMessage(messages.yesterday);
      default:
        return day;
    }
  };

  render() {
    const { events } = this.state;

    const { formatProperty } = this.props;

    const keys = Object.keys(events.byDay);
    return events.isLoading && !events.hasItems ? (
      <Col span={24} className="text-center">
        <Spin />
      </Col>
    ) : (
      <Timeline
        pending={this.renderPendingTimeline(events)}
        pendingDot={<McsIcon type="status" className="mcs-timeline-last-dot" />}
      >
        {keys.map(day => {
          const eventsOnDay = events.byDay[day];
          const eventsOnTime = this.groupByTime(eventsOnDay, 'timestamp');

          const dayToFormattedMessage = this.renderDate(day);
          return (
            <div className="mcs-timeline" key={day}>
              <Timeline.Item
                dot={<Icon type="flag" className="mcs-timeline-dot" />}
              >
                <div className="mcs-title">{dayToFormattedMessage}</div>
              </Timeline.Item>
              {eventsOnDay.length !== 0 &&
                Object.keys(eventsOnTime).map(time => {
                  return (
                    <Timeline.Item
                      key={`${day}_${time}`}
                      dot={
                        <McsIcon
                          type="status"
                          className={
                            // eventsOnTime[time][0].type === 'ALERT_EVENT'
                            //   ? 'mcs-timeline-dot alert' // todo
                            //   : 'mcs-timeline-dot'
                            'mcs-timeline-dot'
                          }
                        />
                      }
                    >
                      <HistoryEventCard
                        events={eventsOnTime[time]}
                        formatProperty={formatProperty}
                      />
                    </Timeline.Item>
                  );
                })
              }
            </div>
          );
        })}
      </Timeline>
    );
  }
}

export default compose<Props, ResourceTimelineProps>(
  withRouter,
  injectIntl,
)(ResourceTimeline);
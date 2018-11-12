import * as React from 'react';
import { compose } from 'recompose';
import lodash from 'lodash';
import moment from 'moment';
import { HistoryEventShape, isHistoryUpdateEvent, isHistoryCreateEvent, isHistoryDeleteEvent } from '../../../models/resourceHistory/ResourceHistory';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { Row, Icon } from 'antd';
import { Card } from '../../../components/Card';
import { ButtonStyleless } from '../../../components';
import messages from './messages';
import { FormatProperty } from './domain';

interface HistoryEventCardProps {
  events: HistoryEventShape[];
  formatProperty: FormatProperty;
}

type Props = HistoryEventCardProps &
  InjectedIntlProps;

  interface State {
    showMore: boolean;
  }

class HistoryEventCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showMore: false,
    };
  }
  
  renderField = (field: string) => {
    const { formatProperty } = this.props;
    const fieldToSnakeCase = lodash.snakeCase(field);
    return <span className="name"> {
      formatProperty(fieldToSnakeCase).message
        ? <FormattedMessage {...formatProperty(fieldToSnakeCase).message} />
        : field
      } </span>;
  }

  renderValue = (field: string, value: string) => {
    const { formatProperty } = this.props;
    const fieldToSnakeCase = lodash.snakeCase(field);

    return value
      ? <span className="value"> {formatProperty(fieldToSnakeCase, value).formattedValue || value} </span>
      : <span className="empty-value"><FormattedMessage {...messages.noValue} /></span>;
  }

  renderMultiEdit = (events: HistoryEventShape[], isCreationCard: boolean) => {
    return events.map(event => {
      return isHistoryUpdateEvent(event) &&
        <div className="mcs-fields-list-item">
          { isCreationCard
            ? <FormattedMessage {...{...messages.initialFieldValue, values: {
              field: this.renderField(event.field_changed),
              newValue: this.renderValue(event.field_changed, event.new_value),
            }}}/>
            : <FormattedMessage {...{...messages.fieldInMultiEditList, values: {
                field: this.renderField(event.field_changed),
                oldValue: this.renderValue(event.field_changed, event.old_value),
                newValue: this.renderValue(event.field_changed, event.new_value),
              }}}/>
          }
        </div>
    });
  }

  findCreateEventIndex = (events: HistoryEventShape[]) => {
    return events.findIndex(event => event.type === 'CREATE_EVENT')
  }

  render() {
    const { events, formatProperty } = this.props;
    const { showMore } = this.state;

    const toggleDetails = () => {
      this.setState({
        showMore: !this.state.showMore
      });
    };

    return (
      <Card>
        <Row className="section">
          {events.length > 1
            ? <Row>
                <div style={{float: 'left'}} className="mcs-fields-list-item">
                    { this.findCreateEventIndex(events) > -1
                      ? <FormattedMessage {...{...messages.resourceCreated, values: {
                        userName: events[0].user_identification.user_name,
                        resourceType: <span className="name"><FormattedMessage {...formatProperty('history_resource_type').message || messages.defaultResourceType} /></span>,
                      }}} />
                      : <FormattedMessage {...{...messages.severalFieldsEdited, values: {
                        userName: events[0].user_identification.user_name
                      }}} />
                    }
                </div>
                <div className="section-cta">
                  <ButtonStyleless
                    onClick={toggleDetails}
                    className="mcs-card-inner-action"
                  >
                    {!showMore
                      ? <FormattedMessage {...messages.expandEvents} />
                      : <FormattedMessage {...messages.reduceEvents} />
                    }
                  </ButtonStyleless>
                </div>
                {showMore && (
                  <div className="mcs-fields-list">
                    {this.renderMultiEdit(events, this.findCreateEventIndex(events) > -1)}
                  </div>
                )}
              </Row>
            : <div>
                {events.map(event => {
                  return isHistoryCreateEvent(event)
                    ? <div className="mcs-fields-list-item">
                        <FormattedMessage
                          {...{...messages.resourceCreated, values: {
                            userName: event.user_identification.user_name,
                            resourceType: <span className="name"><FormattedMessage {...formatProperty('history_resource_type').message || messages.defaultResourceType} /></span>,
                          }}}
                        />
                      </div>
                    : isHistoryUpdateEvent(event)
                      ? <div className="mcs-fields-list-item">
                          <FormattedMessage
                            {...{...messages.singleFieldEdited, values: {
                              userName: event.user_identification.user_name,
                              field: this.renderField(event.field_changed),
                              oldValue: this.renderValue(event.field_changed, event.old_value),
                              newValue: this.renderValue(event.field_changed, event.new_value),
                            }}}
                          />
                        </div>
                      : isHistoryDeleteEvent(event) &&
                        <div className="mcs-fields-list-item">
                          <FormattedMessage
                            {...{...messages.resourceDeleted, values: {
                              userName: event.user_identification.user_name,
                              resourceType: <span className="name"><FormattedMessage {...formatProperty('history_resource_type').message || messages.defaultResourceType} /></span>,
                            }}}
                          />
                        </div>
                })}
              </div>
          }
        </Row>
        <Row style={{padding: '15px 0px 0px', fontWeight: 'bold',}} className="timed-footer text-left">
          <span>
            <Icon type="clock-circle-o" style={{paddingRight: '5px'}}/> 
            <FormattedMessage
              {...{...messages.date, values: {
                day: moment(events[0].timestamp).format("Do"),
                month: moment(events[0].timestamp).format("MMMM"),
                time: moment(events[0].timestamp).format("HH:mm:ss"),
              }}}
            />
          </span>
        </Row>
      </Card>
    );
  }
}

export default compose<Props, HistoryEventCardProps>(
  injectIntl,
  withRouter
)(HistoryEventCard);

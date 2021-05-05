import * as React from 'react';
import { Row } from 'antd';
import * as _moment from 'moment';
import { compose } from 'recompose';
import { injectIntl, InjectedIntlProps, FormattedMessage, defineMessages } from 'react-intl';
import { Activity, UserScenarioActivityCardProps } from '../../../../models/timeline/timeline';
import Card from '../../../card';

const moment = _moment;

const messages = defineMessages({
  userScenarioStartContent: {
    id: 'audience.monitoring.timeline.activity.scenario.start.content',
    defaultMessage: 'Entered {scenarioName}',
  },
  userScenarioStopContent: {
    id: 'audience.monitoring.timeline.activity.scenario.stop.content',
    defaultMessage: 'Exited {scenarioName}',
  },
  userScenarioNodeEnterContent: {
    id: 'audience.monitoring.timeline.activity.scenario.node.enter.content',
    defaultMessage: 'Entered {scenarioNodeName} node within {scenarioName}',
  },
  userScenarioNodeExitContent: {
    id: 'audience.monitoring.timeline.activity.scenario.node.exit.content',
    defaultMessage: 'Exited {scenarioNodeName} node within {scenarioName}',
  },
  userScenarioNodeMovementContent: {
    id: 'audience.monitoring.timeline.activity.scenario.node.movement.content',
    defaultMessage: 'Moved from {scenarioOldNodeName} to {scenarioNodeName} within {scenarioName}',
  },
});

type Props = UserScenarioActivityCardProps & InjectedIntlProps;

interface CardElements {
  title: string;
  intlMsg: React.ReactNode;
}

class UserScenarioActivityCard extends React.Component<Props> {
  generateCardElements(activity: Activity): CardElements {
    switch (activity.$type) {
      case 'USER_SCENARIO_START':
        return {
          title: 'SCENARIO START',
          intlMsg: (
            <FormattedMessage
              {...messages.userScenarioStartContent}
              values={{ scenarioName: <b>{activity.$scenario_name}</b> }}
            />
          ),
        };
      case 'USER_SCENARIO_STOP':
        return {
          title: 'SCENARIO STOP',
          intlMsg: (
            <FormattedMessage
              {...messages.userScenarioStopContent}
              values={{ scenarioName: <b>{activity.$scenario_name}</b> }}
            />
          ),
        };
      case 'USER_SCENARIO_NODE_ENTER':
        return {
          title: 'SCENARIO NODE ENTER',
          intlMsg: (
            <FormattedMessage
              {...messages.userScenarioNodeEnterContent}
              values={{
                scenarioName: <b>{activity.$scenario_name}</b>,
                scenarioNodeName: <b>{activity.$node_name}</b>,
              }}
            />
          ),
        };
      case 'USER_SCENARIO_NODE_EXIT':
        return {
          title: 'SCENARIO NODE EXIT',
          intlMsg: (
            <FormattedMessage
              {...messages.userScenarioNodeExitContent}
              values={{
                scenarioName: <b>{activity.$scenario_name}</b>,
                scenarioNodeName: <b>{activity.$node_name}</b>,
              }}
            />
          ),
        };
      case 'USER_SCENARIO_NODE_MOVEMENT':
        return {
          title: 'SCENARIO NODE MOVEMENT',
          intlMsg: (
            <FormattedMessage
              {...messages.userScenarioNodeMovementContent}
              values={{
                scenarioName: <b>{activity.$scenario_name}</b>,
                scenarioNodeName: <b>{activity.$node_name}</b>,
                scenarioOldNodeName: <b>{activity.$previous_node_name}</b>,
              }}
            />
          ),
        };
      default:
        return {
          title: 'Scenario item not found',
          intlMsg: '',
        };
    }
  }

  render() {
    const activity = this.props.activity;
    const cardContent = this.generateCardElements(activity);
    return (
      <Card title={cardContent.title} className='mcs-user-scenario-activity-card'>
        <Row>
          <div className='mcs-card-content-text'>{cardContent.intlMsg}</div>
        </Row>
        <Row className='border-top sm-footer timed-footer text-right'>
          {moment(activity.$ts).format('H:mm:ss')}
        </Row>
      </Card>
    );
  }
}

export default compose<Props, UserScenarioActivityCardProps>(injectIntl)(UserScenarioActivityCard);

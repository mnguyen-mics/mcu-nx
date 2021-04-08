import * as React from 'react';
import UserScenarioActivityCard from '../UserScenarioActivityCard';
import { UserScenarioActivityCardProps } from '../../../../../models/timeline/timeline';
import { IntlProvider } from 'react-intl';

const props: UserScenarioActivityCardProps = {
  activity: {
    $email_hash: 'string',
    $events: [
      {
        $ts: 4896467488967,
        $event_name: 'event name',
        $properties: 'property',
      },
    ],
    $location: {
      $latlon: ['lat,lon'],
    },
    $origin: {},
    $session_duration: 125646,
    $session_status: 'IN_SESSION',
    $site_id: 'google.com',
    $topics: {},
    $ts: 115165156,
    $ttl: 1212,
    $type: 'type',
    $user_account_id: 'user_account_id',
    $user_agent_id: 'user_agent_id',
    $app_id: 'app_id',
    $node_id: 121555,
    $node_name: 'the node',
    $scenario_name: 'the scenario',
    $scenario_id: 22,
    $previous_node_id: 648787,
    $previous_node_name: 'the prev node',
  },
};

const component = (_props: UserScenarioActivityCardProps) => (
  <IntlProvider locale="en">
    <UserScenarioActivityCard {..._props} />
  </IntlProvider>
);

component.displayName = "UserScenarioActivityCard";

export default {
  component,
  props,
};

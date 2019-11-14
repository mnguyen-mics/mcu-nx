import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import UserScenarioActivityCard from '../UserScenarioActivityCard';
import { UserScenarioActivityCardProps } from '../../../../../models/timeline/timeline';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router';

// Return a fixed timestamp when moment().format() is called
jest.mock('moment', () => () => ({format: () => '2019–11–13T12:34:56+00:00'}));

it('renders the UserScenarioActivityCard', () => {
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
  const component = TestRenderer.create(
    <IntlProvider locale="en">
      <MemoryRouter>
        <UserScenarioActivityCard {...props} />
      </MemoryRouter>
    </IntlProvider>,
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

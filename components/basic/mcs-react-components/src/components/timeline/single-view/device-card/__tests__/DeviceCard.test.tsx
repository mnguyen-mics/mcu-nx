import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import DeviceCard, { DeviceCardProps } from '../DeviceCard';

it('renders the DeviceCard', () => {
  const props: DeviceCardProps = {
    messages: {
      deviceTitle: 'User Device',
      emptyDevice: 'This user has no Devices',
      viewMore: 'View More',
      viewLess: 'View Less',
    },
    dataSource: [
      {
        type: 'USER_AGENT',
        vector_id: 'vec:123456789',
        device: {
          form_factor: 'PERSONAL_COMPUTER',
          os_family: 'LINUX',
          browser_family: 'CHROME',
          browser_version: null,
          brand: null,
          model: null,
          os_version: null,
          carrier: null,
          raw_value: null,
          agent_type: 'WEB_BROWSER',
        },
        creation_ts: 1574446507918,
        last_activity_ts: 1574446507918,
        providers: [],
        mappings: [
          {
            user_agent_id: 'tech:goo:CAESENj9ndnBd1KqeLsUlHRoUfA',
            realm_name: 'GOOGLE_OPERATOR',
            last_activity_ts: 1595254545225,
          },
          {
            user_agent_id: 'tech:apx:5385085270576266781',
            realm_name: 'APP_NEXUS_OPERATOR',
            last_activity_ts: 1595254545225,
          },
        ],
      },
    ],
    isLoading: false,
  };
  const component = TestRenderer.create(<DeviceCard {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

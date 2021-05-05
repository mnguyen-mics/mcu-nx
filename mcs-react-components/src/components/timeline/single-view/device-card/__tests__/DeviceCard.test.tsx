import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import DeviceCard, { DeviceCardProps } from '../DeviceCard';
import { IntlProvider, defineMessages } from 'react-intl';

it('renders the DeviceCard', () => {
  const props: DeviceCardProps = {
    messages: defineMessages({
      deviceTitle: {
        id: 'id1',
        defaultMessage: 'User Device',
      },
      emtyDevice: {
        id: 'id2',
        defaultMessage: 'This user has no Devices',
      },
      viewMore: {
        id: 'id3',
        defaultMessage: 'View More',
      },
      viewLess: {
        id: 'id4',
        defaultMessage: 'View Less',
      },
    }),
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
  const component = TestRenderer.create(
    <IntlProvider locale='en'>
      <DeviceCard {...props} />
    </IntlProvider>,
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

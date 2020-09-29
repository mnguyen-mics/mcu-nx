import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import CounterDashboard, { CounterDashboardProps } from '../CounterDashboard';
import { IntlProvider } from 'react-intl';

it('renders the Counter', () => {
  const props: CounterDashboardProps = {
    counters: [
      {
        iconType: 'users',
        title: 'Users',
        value: 424242,
        loading: false,
        trend: {
          value: 20,
          type: 'up',
        },
        unit: 'Users'
      },
      {
        iconType: 'library',
        title: 'Library',
        value: 434343,
        loading: true,
      },
      {
        iconType: 'settings',
        title: 'Settings',
        value: 464646,
        loading: false,
      },
      {
        iconType: 'display',
        title: 'Display',
        value: 474747,
        loading: true,
      },
    ],
  };
  const component = TestRenderer.create(
    <IntlProvider locale="en">
      <CounterDashboard {...props} />
    </IntlProvider>,
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

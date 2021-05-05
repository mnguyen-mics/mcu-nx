import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import Counter, { CounterProps } from '../Counter';
import { IntlProvider } from 'react-intl';

it('renders the Counter', () => {
  const props: CounterProps = {
    iconType: 'users',
    title: 'Users',
    value: 424242,
    loading: false,
    trend: {
      value: 20,
      type: 'up',
    },
    unit: 'Users',
  };
  const component = TestRenderer.create(
    <IntlProvider locale='en'>
      <Counter {...props} />
    </IntlProvider>,
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

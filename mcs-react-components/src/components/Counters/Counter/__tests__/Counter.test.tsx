import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import Counter, { CounterProps } from '../Counter';

it('renders the Counter', () => {
  const props: CounterProps = {
    iconType: 'users',
    title: 'Users',
    value: 424242,
    loading: false,
  };
  const component = TestRenderer.create(<Counter {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

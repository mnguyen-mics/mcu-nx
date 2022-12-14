import 'jest';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import Counter, { CounterProps } from '../Counter';

jest.mock('numeral', () => () => ({
  format: (value: number) => value,
}));
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
  const component = TestRenderer.create(<Counter {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

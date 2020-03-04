import * as React from 'react';
import Counter, { CounterProps } from '../Counter';
import { IntlProvider } from 'react-intl';

const props: CounterProps = {
  iconType: 'users',
  title: 'Users',
  value: 424242,
  loading: false,
};

const component = (_props: CounterProps) => (
  <IntlProvider locale="en">
    <Counter {..._props} />
  </IntlProvider>
);
component.displayName = "Counter";

export default {
  component,
  props,
};

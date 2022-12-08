import * as React from 'react';
import Counter, { CounterProps } from '../Counter';

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

export default <Counter {...props} />;

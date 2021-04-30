import * as React from 'react';
import EmptyChart, { EmptyChartProps } from '../EmptyChart';

const props: EmptyChartProps = {
  title: 'There is no automation to display.',
  icon: 'automation',
};

export default <EmptyChart {...props} />;

import * as React from 'react';
import EmptyChart, { EmptyChartProps } from '../EmptyChart';

const props: EmptyChartProps = {
  title: 'There is no automation to display.',
  icon: 'automation',
};

const component = (_props: EmptyChartProps) => <EmptyChart {..._props} />;

component.displayName = "EmptyChart";

export default {
  component,
  props,
};

import * as React from 'react';
import EmptyCharts, { EmptyChartsProps } from '../EmptyCharts';

const props: EmptyChartsProps = {
  title: 'There is no automation to display.',
  icon: 'automation',
};

const component = (_props: EmptyChartsProps) => <EmptyCharts {..._props} />;

component.displayName = "EmptyCharts";

export default {
  component,
  props,
};

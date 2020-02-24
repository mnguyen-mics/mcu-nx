import * as React from 'react';
import LoadingChart, { LoadingChartProps } from '../LoadingCharts';

const props: LoadingChartProps = {
  className: 'test',
};

const component = (_props: LoadingChartProps) => <LoadingChart {..._props} />;

export default {
  component,
  props,
};

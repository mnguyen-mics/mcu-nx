import * as React from 'react';
import LoadingChart, { LoadingChartProps } from './../LoadingChart';

const props: LoadingChartProps = {
  className: 'test',
};

const component = (_props: LoadingChartProps) => <LoadingChart {..._props} />;

component.displayName = "LoadingChart";

export default {
  component,
  props,
};

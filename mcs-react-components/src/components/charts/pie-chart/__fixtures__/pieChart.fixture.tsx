import * as React from 'react';
import PieChart, { PieChartProps } from '../PieChart';

const data = [
  {
    key: '65+',
    value: 11799090,
    buckets: [
      {
        key: '71+',
        value: 980980,
      },
    ],
  },
  { key: '18-24', value: 11402007 },
  { key: '50-64', value: 8762606 },
  { key: '35-49', value: 8518201 },
  { key: '25-34', value: 7883306 },
  { key: '35-44', value: 1 },
] as any;

const propsForDefault: PieChartProps = {
  dataset: data,
  innerRadius: true,
  dataLabels: {
    filter: {
      property: 'percentage',
      operator: '>',
      value: 1,
    },
  },
  tooltip: {
    format: 'CUSTOM {point.name} {point.percentage:.2f}%',
  },
};

const propsForHalfMode: PieChartProps = {
  dataset: data,
  innerRadius: true,
  isHalf: true,
  dataLabels: {
    enabled: true,
    distance: 10,
    filter: {
      property: 'percentage',
      operator: '>',
      value: 1,
    },
  },
};

const propsForInnerRadius: PieChartProps = {
  dataset: data,
  innerRadius: false,
  dataLabels: {
    enabled: true,
    filter: {
      property: 'percentage',
      operator: '>',
      value: 1,
    },
  },
};

const propsForCountFormat: PieChartProps = {
  dataset: data,
  innerRadius: true,
  format: 'count',
  dataLabels: {
    enabled: true,
    filter: {
      property: 'percentage',
      operator: '>',
      value: 1,
    },
  },
};

const propsForDrilldown: PieChartProps = {
  dataset: data,
  innerRadius: true,
  drilldown: true,
  dataLabels: {
    enabled: true,
    filter: {
      property: 'percentage',
      operator: '>',
      value: 1,
    },
  },
};

const propsForLegendOnBottom: PieChartProps = {
  dataset: data,
  legend: {
    enabled: true,
    position: 'bottom',
  },
  innerRadius: true,
  dataLabels: {
    enabled: true,
    filter: {
      property: 'percentage',
      operator: '>',
      value: 1,
    },
  },
};

const propsForLegendOnRight: PieChartProps = {
  dataset: data,
  legend: {
    enabled: true,
    position: 'right',
  },
  innerRadius: true,
  dataLabels: {
    enabled: true,
    filter: {
      property: 'percentage',
      operator: '>',
      value: 1,
    },
  },
};
export default {
  default: <PieChart {...propsForDefault} />,
  'half mode': <PieChart {...propsForHalfMode} />,
  'no inner radius': <PieChart {...propsForInnerRadius} />,
  'with count format': <PieChart {...propsForCountFormat} />,
  'with drilldown': <PieChart {...propsForDrilldown} />,
  'with legend on bottom': <PieChart {...propsForLegendOnBottom} />,
  'with legend on right': <PieChart {...propsForLegendOnRight} />,
};

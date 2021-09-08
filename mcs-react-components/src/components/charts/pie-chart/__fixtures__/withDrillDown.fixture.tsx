import * as React from 'react';
import PieChart, { PieChartProps } from '../PieChart';

const props: PieChartProps = {
  dataset: [
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
    {
      key: '18-24',
      value: 11402007,
      buckets: [
        {
          key: '71+',
          value: 980980,
        },
      ],
    },
    {
      key: '50-64',
      value: 8762606,
      buckets: [
        {
          key: '71+',
          value: 980980,
        },
      ],
    },
    {
      key: '35-49',
      value: 8518201,
      buckets: [
        {
          key: '71+',
          value: 980980,
        },
      ],
    },
    {
      key: '25-34',
      value: 7883306,
      buckets: [
        {
          key: '71+',
          value: 980980,
        },
      ],
    },
    {
      key: '35-44',
      value: 1,
      buckets: [
        {
          key: '71+',
          value: 980980,
        },
      ],
    },
  ] as any,
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

export default <PieChart {...props} />;

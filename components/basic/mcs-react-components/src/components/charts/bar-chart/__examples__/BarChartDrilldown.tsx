import { BarChartProps } from '../BarChart';
import { defaultColors } from '../../utils';

const dataset: any = [
  {
    day: '2020-02-27',
    data_1: 456,
    buckets: [
      {
        day: 'Paris',
        data_1: 10,
      },
      {
        day: 'Tokyo',
        data_1: 20,
      },
      {
        day: 'Moscow',
        data_1: 30,
      },
    ],
  },
  {
    day: '2020-02-28',
    data_1: 3451,
    buckets: [
      {
        day: 'Paris',
        data_1: 20,
      },
      {
        day: 'Tokyo',
        data_1: 70,
      },
      {
        day: 'Moscow',
        data_1: 10,
      },
    ],
  },
  {
    day: '2020-02-29',
    data_1: 3000,
    buckets: [
      {
        day: 'Paris',
        data_1: 50,
      },
      {
        day: 'Tokyo',
        data_1: 60,
      },
      {
        day: 'Moscow',
        data_1: 70,
      },
    ],
  },
  {
    day: '2020-03-01',
    data_1: 2132,
    buckets: [
      {
        day: 'Paris',
        data_1: 40,
      },
      {
        day: 'Tokyo',
        data_1: 20,
      },
      {
        day: 'Moscow',
        data_1: 30,
      },
    ],
  },
];

const props: BarChartProps = {
  dataset: dataset,
  colors: defaultColors,
  yKeys: [
    {
      key: 'data_1',
      message: 'Data 1',
    },
  ],
  format: 'count',
  xKey: 'day',
  bigBars: true,
  stacking: false,
  drilldown: true,
  height: 380,
};

export default props;

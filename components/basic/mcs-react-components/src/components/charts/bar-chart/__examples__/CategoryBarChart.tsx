import { BarChartProps } from '../BarChart';
import { defaultColors } from '../../utils';

const dataset: any = [
  {
    xKey: '2020-02-27',
    buckets: [
      { xKey: 'data_1', count: 456 },
      { xKey: 'data_2', count: 65 },
      { xKey: 'data_3', count: 56 },
      { xKey: 'data_4', count: 906 },
    ],
  },
  {
    xKey: '2020-02-28',
    buckets: [
      { xKey: 'data_1', count: 3451 },
      { xKey: 'data_2', count: 561 },
      { xKey: 'data_3', count: 516 },
      { xKey: 'data_4', count: 596 },
    ],
  },
  {
    xKey: '2020-02-30',
    buckets: [
      { xKey: 'data_1', count: 3000 },
      { xKey: 'data_2', count: 651 },
      { xKey: 'data_3', count: 615 },
      { xKey: 'data_4', count: 905 },
    ],
  },
  {
    xKey: '2020-03-01',
    buckets: [
      { xKey: 'data_1', count: 2132 },
      { xKey: 'data_2', count: 261 },
      { xKey: 'data_3', count: 216 },
      { xKey: 'data_4', count: 296 },
    ],
  },
];

const props: BarChartProps = {
  dataset: dataset,
  legend: {
    enabled: false,
  },
  colors: defaultColors,
  yKeys: [
    {
      key: 'count',
      message: '',
    },
  ],
  xKey: 'xKey',
  format: 'count',
  bigBars: false,
  stacking: false,
  height: 380,
};

export default props;

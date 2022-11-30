import { BarChartProps } from '../BarChart';
import { defaultColors } from '../../utils';

const data = [
  {
    day: '2020-02-27',
    'data_1-count': 456,
    'data_2-count': 65,
    'data_3-count': 56,
    'data_4-count': 906,
  },
  {
    day: '2020-02-28',
    'data_1-count': 3451,
    'data_2-count': 561,
    'data_3-count': 516,
    'data_4-count': 596,
  },
  {
    day: '2020-02-29',
    'data_1-count': 3000,
    'data_2-count': 651,
    'data_3-count': 615,
    'data_4-count': 905,
  },
  {
    day: '2020-03-01',
    'data_1-count': 2132,
    'data_2-count': 261,
    'data_3-count': 216,
    'data_4-count': 296,
  },
];
const totals = data.map(
  x => x['data_1-count'] + x['data_2-count'] + x['data_3-count'] + x['data_4-count'],
);
const dataWithPercentages = data.map((x, i) => {
  return {
    ...x,
    data_1: (x['data_1-count'] / totals[i]) * 100,
    data_2: (x['data_2-count'] / totals[i]) * 100,
    data_3: (x['data_3-count'] / totals[i]) * 100,
    data_4: (x['data_4-count'] / totals[i]) * 100,
  };
});

const props: BarChartProps = {
  dataset: dataWithPercentages,
  legend: {
    enabled: true,
    position: 'bottom',
  },
  colors: defaultColors,
  yKeys: [
    {
      key: 'data_1',
      message: 'Data 1',
    },
    {
      key: 'data_2',
      message: 'Data 2',
    },
    {
      key: 'data_3',
      message: 'Data 3',
    },
    {
      key: 'data_4',
      message: 'Data 4',
    },
  ],
  xKey: 'day',
  format: 'percentage',
  bigBars: true,
  stacking: true,
  height: 380,
  type: 'bars',
};

export default props;

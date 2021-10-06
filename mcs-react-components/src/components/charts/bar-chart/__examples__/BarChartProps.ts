import { BarChartProps } from '../BarChart';
import { defaultColors } from '../../utils';

const props: BarChartProps = {
  type: 'bar',
  dataset: [
    { day: '2020-02-27', data_1: 4, 'data_1-count': 46, 'data_1-percentage': 12 },
    { day: '2020-02-28', data_1: 31, 'data_1-count': 351, 'data_1-percentage': 30 },
    { day: '2020-02-29', data_1: 3, 'data_1-count': 30, 'data_1-percentage': 9 },
    { day: '2020-03-01', data_1: 22, 'data_1-count': 232, 'data_1-percentage': 50 },
  ],
  legend: {
    position: 'bottom',
    enabled: true,
  },
  colors: defaultColors,
  yKeys: [
    {
      key: 'data_1',
      message: 'Data 1',
    },
  ],
  xKey: 'day',
  format: 'index',
  bigBars: true,
  stacking: false,
  plotLineValue: 100,
};

export default props;

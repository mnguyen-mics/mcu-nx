import { BarChartProps } from '../BarChart';
import { defaultColors } from '../../utils';

const props: BarChartProps = {
  dataset: [
    { day: '2020-02-27', data_1: 46, data_2: 86 },
    { day: '2020-02-28', data_1: 351, data_2: 31 },
    { day: '2020-02-29', data_1: 30, data_2: 480 },
    { day: '2020-03-01', data_1: 232, data_2: 282 },
  ],
  legend: {
    position: 'right',
    enabled: true,
  },
  colors: defaultColors,
  yKeys: [
    {
      key: 'data_1',
      message: 'Segment',
    },
    {
      key: 'data_2',
      message: 'Datamart',
    },
  ],
  xKey: 'day',
  format: 'count',
  bigBars: false,
  stacking: false,
  height: 380,
  plotLineValue: 100,
};

export default props;

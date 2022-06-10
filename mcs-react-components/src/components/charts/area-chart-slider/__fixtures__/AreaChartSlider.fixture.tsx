import * as React from 'react';
import AreaChartSlider, { AreaChartSliderProps, DataPoint } from '../AreaChartSlider';

function generateData(i: number, accu: DataPoint[] = []): DataPoint[] {
  if (accu.length === i) return accu;
  return generateData(
    i,
    accu.concat({
      id: accu.length + 1,
      overlap: 90 * Math.exp(-accu.length / 200),
      extension: accu.length,
    }),
  );
}

const data = generateData(1024);

const props: AreaChartSliderProps = {
  data,
  xAxis: {
    key: 'extension',
    labelFormat: '{value}%',
    title: 'Extension factor',
    subtitle: 'Used to determine which cohorts will be selected to populate this lookalike segment',
  },
  yAxis: {
    key: 'overlap',
    labelFormat: '{value}%',
    title: 'Overlap',
    subtitle: '% of similarities between seed segment and cohorts',
  },
  color: '#00a1df',
  initialValue: 100,
  disabled: false,
};

export default <AreaChartSlider {...props} />;

import * as React from 'react';
import AreaChartSlider, { AreaChartSliderProps, DataPoint } from '../AreaChartSlider';
import _ from 'lodash';

function generateData(
  maxSimilarity: number,
  initialValue: number,
  lastValueTarget: number,
): DataPoint[] {
  const firstXForGraph = +(Math.ceil(maxSimilarity * 10) / 10).toFixed(1);

  return _.range(firstXForGraph, 0.9, -0.1)
    .map(x => {
      return +(Math.round(x * 10) / 10).toFixed(1);
    })
    .reduce((acc: DataPoint[], x: number): DataPoint[] => {
      if (x === firstXForGraph) {
        // First point of graph
        return acc.concat([{ x: x, y: initialValue }]);
      } else if (x === 1) {
        // Last point of graph (to avoid the division by 0 of the last case)
        return acc.concat([{ x: x, y: acc[acc.length - 1].y }]);
      } else {
        // All other points
        // 50 % of the time, we add 0
        // 50 % of the time, we add a value that tends to lead to the target at the end of the graph
        // even if we can go over the target value in practice
        const lastValue = acc[acc.length - 1].y;
        const nbStepsToEndOfGraph = Math.round(10 * (x - 1));
        const addedValue =
          Math.random() > 0.5
            ? 0
            : Math.abs(
                Math.round(
                  (2 * Math.random() * (lastValueTarget - lastValue)) / (nbStepsToEndOfGraph / 2),
                ),
              );
        return acc.concat([{ x: x, y: lastValue + addedValue }]);
      }
    }, []);
}

const data = generateData(10, 200000, 5000000);

const props: AreaChartSliderProps = {
  data,
  xAxis: {
    key: 'x',
    labelFormat: '{value}',
    title: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div>More similar</div>
        <div>Less similar</div>
      </div>
    ),
    subtitle: 'Similarity index between seed segment and selected cohorts',
    reversed: true,
  },
  yAxis: {
    key: 'y',
    labelFormat: '{value}',
    title: 'Userpoints',
    subtitle: '# of userpoints expected in this segment',
  },
  color: '#00a1df',
  fillOpacity: 0.25,
  value: Math.round(data.length / 2),
  disabled: false,
};

export default <AreaChartSlider {...props} />;

import * as React from 'react';
import barChartProps from '../__examples__/BarChartProps';
import barChartWithDrilldownProps from '../__examples__/BarChartDrilldown';
import barChartLegendRightProps from '../__examples__/BarChartLegendRight';
import barChartCategory from '../__examples__/CategoryBarChart';
import barChartStacked from '../__examples__/StackedBarChart';
import BarChart from '../BarChart';
import barChartCustomTooltipProps from '../__examples__/BarChartPropsCustomTooltip';
import barChartInvisibleXAndYAxisProps from '../__examples__/BarChartInvisibleXAndYAxis';

export default {
  'bars with index': <BarChart {...barChartProps} />,
  'columns with drilldown': <BarChart {...barChartWithDrilldownProps} />,
  'multi series with legend': <BarChart {...barChartLegendRightProps} />,
  'multi series with buckets': <BarChart {...barChartCategory} />,
  'stacked with bottom legend': <BarChart {...barChartStacked} />,
  'custom tooltip bar chart': <BarChart {...barChartCustomTooltipProps} />,
  'invisible xAxis and yAxis': <BarChart {...barChartInvisibleXAndYAxisProps} />,
};

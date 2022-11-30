import * as React from 'react';
import { BASE_CHART_HEIGHT } from '../../utils';
import RadarChart, { RadarChartProps } from '../RadarChart';

const simpleSeriesProps: RadarChartProps = {
  dataset: [
    { xKey: 'Dimension 1', value: 1 },
    { xKey: 'Dimension 2', value: 2 },
    { xKey: 'Dimension 3', value: 3 },
    { xKey: 'Dimension 4', value: 4 },
    { xKey: 'Dimension 5', value: 5 },
    { xKey: 'Dimension 6', value: 6 },
  ],
  height: BASE_CHART_HEIGHT,
  xKey: 'xKey',
  yKeys: [
    {
      key: 'value',
      message: 'count',
    },
  ],
};

const simpleSeriesPercentageProps: RadarChartProps = {
  dataset: [
    { xKey: 'Dimension 1', value: 5, 'value-count': 5 },
    { xKey: 'Dimension 2', value: 10, 'value-count': 10 },
    { xKey: 'Dimension 3', value: 20, 'value-count': 20 },
    { xKey: 'Dimension 4', value: 15, 'value-count': 15 },
    { xKey: 'Dimension 5', value: 40, 'value-count': 40 },
    { xKey: 'Dimension 6', value: 10, 'value-count': 10 },
  ],
  height: BASE_CHART_HEIGHT,
  xKey: 'xKey',
  yKeys: [
    {
      key: 'value',
      message: 'count',
    },
  ],
  format: 'percentage',
};

const multipleSeriesProps: RadarChartProps = {
  dataset: [
    { xKey: 'Dimension 1', value: 1, datamart: 2 },
    { xKey: 'Dimension 2', value: 2, datamart: 4 },
    { xKey: 'Dimension 3', value: 3, datamart: 6 },
    { xKey: 'Dimension 4', value: 4, datamart: 8 },
    { xKey: 'Dimension 5', value: 5, datamart: 10 },
    { xKey: 'Dimension 6', value: 6, datamart: 12 },
  ],
  height: BASE_CHART_HEIGHT,
  xKey: 'xKey',
  yKeys: [
    {
      key: 'value',
      message: 'segment',
    },
    {
      key: 'datamart',
      message: 'datamart',
    },
  ],
  legend: {
    enabled: true,
    position: 'bottom',
  },
};

const multiplePercentageSeriesProps: RadarChartProps = {
  format: 'percentage',
  dataset: [
    { xKey: 'Dimension 1', value: 5, 'value-count': 5, datamart: 10, 'datamart-count': 5 },
    { xKey: 'Dimension 2', value: 10, 'value-count': 10, datamart: 5, 'datamart-count': 10 },
    { xKey: 'Dimension 3', value: 20, 'value-count': 20, datamart: 30, 'datamart-count': 20 },
    { xKey: 'Dimension 4', value: 15, 'value-count': 15, datamart: 20, 'datamart-count': 15 },
    { xKey: 'Dimension 5', value: 40, 'value-count': 40, datamart: 30, 'datamart-count': 40 },
    { xKey: 'Dimension 6', value: 10, 'value-count': 10, datamart: 20, 'datamart-count': 10 },
  ],
  height: BASE_CHART_HEIGHT,
  xKey: 'xKey',
  yKeys: [
    {
      key: 'value',
      message: 'segment',
    },
    {
      key: 'datamart',
      message: 'datamart',
    },
  ],
  legend: {
    enabled: true,
    position: 'right',
  },
};

const customTooltipProps: RadarChartProps = {
  format: 'percentage',
  dataset: [
    { xKey: 'Dimension 1', value: 5, 'value-count': 5, datamart: 10, 'datamart-count': 5 },
    { xKey: 'Dimension 2', value: 10, 'value-count': 10, datamart: 5, 'datamart-count': 10 },
    { xKey: 'Dimension 3', value: 20, 'value-count': 20, datamart: 30, 'datamart-count': 20 },
    { xKey: 'Dimension 4', value: 15, 'value-count': 15, datamart: 20, 'datamart-count': 15 },
    { xKey: 'Dimension 5', value: 40, 'value-count': 40, datamart: 30, 'datamart-count': 40 },
    { xKey: 'Dimension 6', value: 10, 'value-count': 10, datamart: 20, 'datamart-count': 10 },
  ],
  height: BASE_CHART_HEIGHT,
  xKey: 'xKey',
  yKeys: [
    {
      key: 'value',
      message: 'segment',
    },
    {
      key: 'datamart',
      message: 'datamart',
    },
  ],
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    format: 'Custom tooltip : {point.y}% / {point.count}',
  },
};

const customDatalabelProps: RadarChartProps = {
  format: 'percentage',
  dataset: [
    { xKey: 'Dimension 1', value: 5, 'value-count': 5, datamart: 10, 'datamart-count': 5 },
    { xKey: 'Dimension 2', value: 10, 'value-count': 10, datamart: 5, 'datamart-count': 10 },
    { xKey: 'Dimension 3', value: 20, 'value-count': 20, datamart: 30, 'datamart-count': 20 },
    { xKey: 'Dimension 4', value: 15, 'value-count': 15, datamart: 20, 'datamart-count': 15 },
    { xKey: 'Dimension 5', value: 40, 'value-count': 40, datamart: 30, 'datamart-count': 40 },
    { xKey: 'Dimension 6', value: 10, 'value-count': 10, datamart: 20, 'datamart-count': 10 },
  ],
  height: BASE_CHART_HEIGHT,
  xKey: 'xKey',
  yKeys: [
    {
      key: 'value',
      message: 'segment',
    },
    {
      key: 'datamart',
      message: 'datamart',
    },
  ],
  dataLabels: {
    enabled: true,
    format: 'Custom Label : {point.y}%',
    filter: {
      operator: '>',
      value: 10,
      property: 'y',
    },
  },
};

export default {
  'Simple Series Props': <RadarChart {...simpleSeriesProps} />,
  'Simple Series Percentage Props': <RadarChart {...simpleSeriesPercentageProps} />,
  'Multiple Series Props': <RadarChart {...multipleSeriesProps} />,
  'Multiple Percentage Series Props': <RadarChart {...multiplePercentageSeriesProps} />,
  'Custom Tooltip Props': <RadarChart {...customTooltipProps} />,
  'Custom DataLabel Props': <RadarChart {...customDatalabelProps} />,
};

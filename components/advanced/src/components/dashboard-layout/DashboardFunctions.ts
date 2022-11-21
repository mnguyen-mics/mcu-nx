import { CSSProperties } from 'react';
import {
  DashboardContentCard,
  DashboardContentSchema,
  DashboardContentSection,
} from '../../models/customDashboards/customDashboards';
import { ChartConfig, ChartType } from '../../services/ChartDatasetService';
import { VerticalDirection } from './wysiwig/SectionTitleEditionPanel';

export const BASE_FRAMEWORK_HEIGHT = 96;

export function findSectionNode(
  nodeId: string,
  content: DashboardContentSchema,
): DashboardContentSection | undefined {
  return content.sections.find(section => section.id === nodeId);
}

export function findCardNode(
  nodeId: string,
  content: DashboardContentSchema,
): DashboardContentCard | undefined {
  let res;
  content.sections.forEach(section => {
    section.cards.forEach(card => {
      if (card.id === nodeId) res = card;
    });
  });
  return res;
}

export function findChartNode(
  nodeId: string,
  content: DashboardContentSchema,
): ChartConfig | undefined {
  let res;
  content.sections.forEach(section => {
    section.cards.forEach(card => {
      card.charts.forEach(chart => {
        if (chart.id === nodeId) res = chart;
      });
    });
  });
  return res;
}

export function swapCharts(chartsList: ChartConfig[], index1: number, index2: number) {
  const tmp = chartsList[index1];
  chartsList[index1] = chartsList[index2];
  chartsList[index2] = tmp;
}

export function swapSections(
  sectionsList: DashboardContentSection[],
  index1: number,
  index2: number,
) {
  const tmp = sectionsList[index1];
  sectionsList[index1] = sectionsList[index2];
  sectionsList[index2] = tmp;
}

export function moveChartNode(
  direction: VerticalDirection,
  chartIndex: number,
  card: DashboardContentCard,
): boolean {
  let neighborIndex: number | undefined;
  if (direction === 'up' && chartIndex > 0) neighborIndex = chartIndex - 1;
  else if (direction === 'down' && chartIndex < card.charts.length - 1)
    neighborIndex = chartIndex + 1;

  if (neighborIndex !== undefined) {
    swapCharts(card.charts, chartIndex, neighborIndex);
    return true;
  }

  return false;
}

export function mergeChartConfigs(to: ChartConfig, from: ChartConfig) {
  const newChart: any = from;
  const existingChart: any = to;
  const keys = Object.keys(newChart).filter(key => key !== 'id');
  keys.forEach(key => {
    existingChart[key] = newChart[key];
  });
}

export function moveSectionNode(
  direction: VerticalDirection,
  sectionIndex: number,
  schema: DashboardContentSchema,
): boolean {
  let neighborIndex: number | undefined;
  if (direction === 'up' && sectionIndex > 0) neighborIndex = sectionIndex - 1;
  else if (direction === 'down' && sectionIndex < schema.sections.length - 1)
    neighborIndex = sectionIndex + 1;

  if (neighborIndex !== undefined) {
    swapSections(schema.sections, sectionIndex, neighborIndex);
    return true;
  }

  return false;
}

export function computeCSSProperties(
  charts: ChartConfig[],
  chartType: ChartType,
  cardHeight: number,
  editable: boolean,
  layout: string = 'horizontal',
): CSSProperties {
  const isMetricChartType = chartType.toLowerCase() === 'metric';
  const metricChartsList = charts.filter(chart => chart.type.toLowerCase() === 'metric');
  const metricHeigthInPx = 63;
  const cardPadding = 15;
  const vSpaceBetweenRows = 10;
  const metricHeightInPxWithPadding = 83;
  const cardEditMenuHeight = 18;
  const cardHeightInPixel =
    cardHeight * BASE_FRAMEWORK_HEIGHT + (cardHeight - 1) * vSpaceBetweenRows;
  const chartPadding = 20;
  // We add this correction to avoid charts exceeding the bottom limits in some cases
  const heightCorrectionForHorizontalCase = 12;

  const horizontalChartHeight =
    cardHeightInPixel -
    2 * cardPadding -
    (editable ? cardEditMenuHeight : 0) -
    heightCorrectionForHorizontalCase;

  const horizontalCssProperties = {
    float: 'left' as any,
    height: `${horizontalChartHeight}px`,
  };

  const nonMetricChartsCount =
    charts.length - metricChartsList.length > 0 ? charts.length - metricChartsList.length : 1;

  const otherThanMetricChartHeigth =
    (cardHeightInPixel -
      2 * cardPadding -
      (editable ? cardEditMenuHeight : 0) -
      metricChartsList.length * metricHeightInPxWithPadding) /
      nonMetricChartsCount -
    chartPadding;

  const metricChartWidthSize = 30;
  const otherThanMetricChartWidth =
    (100 - metricChartsList.length * metricChartWidthSize) /
    (charts.length - metricChartsList.length);

  if (layout === 'horizontal') {
    if (isMetricChartType && charts.length > 1) {
      return {
        ...horizontalCssProperties,
        width: `${metricChartWidthSize}%`,
      };
    }
    return {
      ...horizontalCssProperties,
      width:
        !isMetricChartType && metricChartsList
          ? `${otherThanMetricChartWidth}%`
          : `${100 / charts.length}%`,
    };
  } else {
    if (isMetricChartType && charts.length > 1) {
      return { height: `${metricHeigthInPx}px` };
    }
    return {
      height: `${otherThanMetricChartHeigth}px`,
    };
  }
}

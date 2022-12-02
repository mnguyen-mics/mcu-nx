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

export function swapElements(
  array: ChartConfig[] | DashboardContentSection[],
  index1: number,
  index2: number,
) {
  const tmp = array[index1];
  array[index1] = array[index2];
  array[index2] = tmp;
}

export function moveElement(
  direction: VerticalDirection,
  index: number,
  array: ChartConfig[] | DashboardContentSection[],
): boolean {
  let neighborIndex: number | undefined;
  if (direction === 'up' && index > 0) neighborIndex = index - 1;
  else if (direction === 'down' && index < array.length - 1) neighborIndex = index + 1;

  if (neighborIndex !== undefined) {
    swapElements(array, index, neighborIndex);
    return true;
  } else return false;
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

export function transformSchemaForComparaison(
  content: DashboardContentSchema,
): DashboardContentSchema {
  const arrangeCardsVertically = (cards: DashboardContentCard[]): DashboardContentCard[] => {
    let y = 0;
    return cards.map(card => {
      const height =
        card.layout && card.layout === 'horizontal' ? card.h * card.charts.length : card.h;

      const transformedCard: DashboardContentCard = {
        ...JSON.parse(JSON.stringify(card)),
        x: 0,
        y: y,
        w: 12,
        h: height,
        layout: 'vertical',
      };

      y = y + height;

      return transformedCard;
    });
  };

  return {
    ...content,
    sections: content.sections.map(section => {
      return {
        ...section,
        cards: arrangeCardsVertically(section.cards),
      };
    }),
  };
}

export function injectFirstSectionTitle(
  content: DashboardContentSchema,
  title: string,
): DashboardContentSchema {
  const contentClone: DashboardContentSchema = JSON.parse(JSON.stringify(content));

  if (contentClone.sections.length > 0) contentClone.sections[0].title = title;

  return contentClone;
}

export function limitTextLength(text: string, maxLength: number) {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export function getDashboardChartsTitles(content: DashboardContentSchema) {
  const titles: string[] = [];
  content.sections.forEach(section => {
    section.cards.forEach(card => {
      card.charts.forEach(chart => {
        titles.push(chart.title);
      });
    });
  });
  return titles;
}

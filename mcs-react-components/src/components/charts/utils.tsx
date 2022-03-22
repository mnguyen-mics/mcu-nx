import * as Highcharts from 'highcharts';
import { uniqueId } from 'lodash';
import moment from 'moment';

export const GRAY_COLOR = '#8ca0b3';

export const LINE_COLOR = (Highcharts as any).Color(GRAY_COLOR).setOpacity(0.4).get('rgba');

export const CROSSHAIR_COLOR = (Highcharts as any).Color(GRAY_COLOR).setOpacity(0.6).get('rgba');

export const AREA_OPACITY = 0.15;

export const BASE_CHART_HEIGHT = 400;

const HOUR_MILLIS = 3600 * 1000;

const DAY_MILLIS = 24 * HOUR_MILLIS;

export type OnDragEnd = (a: [string, string]) => void;

// LINEAR CHART
export const generateXAxisGridLine = (): Partial<Highcharts.XAxisOptions> => {
  return {
    gridLineWidth: 1,
    gridLineColor: LINE_COLOR,
    gridLineDashStyle: 'ShortDash',
    crosshair: {
      color: CROSSHAIR_COLOR,
      width: 1,
      dashStyle: 'ShortDash',
    },
  };
};

export const generateYAxisGridLine = (): Partial<Highcharts.YAxisOptions> => {
  return {
    gridLineWidth: 1,
    gridLineColor: LINE_COLOR,
    gridLineDashStyle: 'ShortDash',
  };
};

export const generateDragEvents = (
  onDragEnd?: OnDragEnd,
): Highcharts.ChartSelectionCallbackFunction => {
  const a = (b: Highcharts.Chart) => {
    const startDragDate = moment(b.xAxis[0].min as number);
    const endDragDate = moment(b.xAxis[0].max as number);
    const min = startDragDate;
    const duration: number = endDragDate.diff(min, 'milliseconds');
    const max = duration > DAY_MILLIS ? endDragDate : endDragDate.add(1, 'days');

    if (onDragEnd) {
      onDragEnd([min as any, max as any]);
    }

    return false;
  };
  return a as any;
};

export const generateDraggable = (onDragEnd?: OnDragEnd): Partial<Highcharts.ChartOptions> => {
  return {
    zoomType: 'x',
    events: {
      selection: generateDragEvents(onDragEnd),
    },
  };
};

// PIE CHARTS

// COMMON
export const generateLegend = (): Partial<Highcharts.LegendOptions> => {
  return {};
};

export type Format = 'percentage' | 'index' | 'count';

export type PieChartFormat = 'percentage' | 'count';

export type Tooltip = {
  format?: string;
};

function formatTooltip(format: Format) {
  switch (format) {
    case 'count':
      return '{point.y}';
    case 'percentage':
      return '{point.y}% ({point.count})';
    case 'index':
      return '{point.y} ({point.percentage}% - {point.count})';
  }
}

export const generateTooltip = (
  showTooltip: boolean = true,
  format: Format = 'count',
  customFormat?: string,
): Partial<Highcharts.TooltipOptions> => {
  const printedPoint = customFormat ? customFormat : formatTooltip(format);
  return showTooltip
    ? {
        useHTML: false,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#e8e8e8',
        padding: 15,
        outside: false,
        shadow: false,
        hideDelay: 0,
        headerFormat: `<span style="font-size: 12px; font-weight: bold; margin-bottom: 13px;">{point.key}</span><br/><br/>`,
        pointFormat: `<span style="color:{point.color}; font-size: 20px; margin-right: 20px;">\u25CF</span> {series.name}: <b>${printedPoint}</b><br/>`,
      }
    : { enabled: false };
};

export type Datapoint = {
  [key: string]: string | number | Date | undefined | boolean;
} & WithDrilldownId &
  WithSubBuckets;
export type Dataset = Datapoint[];

interface WithDrilldownId {
  drilldown?: string;
}

export interface WithSubBuckets {
  buckets?: Datapoint[];
}

interface DrilldownAccumulator<T> {
  drilldownNodes: Array<DrilldownView<T>>;
  buckets: Datapoint[];
}

interface DrilldownView<T> {
  name: string;
  id: string;
  data: DrilldownNode[];
  type: T;
  innerSize?: string;
}

interface DrilldownNode {
  name: string;
  y: number;
  drilldown?: string;
}

export const defaultColors = [
  '#00a1df',
  '#fd7c12',
  '#00ab67',
  '#513fab',
  '#eb5c5d',
  '#003056',
  '#d9d9d9',
];

type LegendPosition = 'bottom' | 'right';
export interface Legend {
  position?: LegendPosition;
  layout?: Highcharts.OptionsLayoutValue;
  enabled: boolean;
}

export function buildLegendOptions(legend?: Legend): Highcharts.LegendOptions {
  const align =
    legend?.position === 'right'
      ? {
          layout: 'vertical' as Highcharts.OptionsLayoutValue,
          align: 'right' as Highcharts.AlignValue,
          verticalAlign: 'middle' as Highcharts.VerticalAlignValue,
        }
      : legend?.position === 'bottom'
      ? {
          layout: legend.layout || ('vertical' as Highcharts.OptionsLayoutValue),
          align: 'center' as Highcharts.AlignValue,
          verticalAlign: 'bottom' as Highcharts.VerticalAlignValue,
        }
      : {};
  return legend?.enabled
    ? {
        ...align,
        enabled: true,
      }
    : { enabled: false };
}

export function buildDrilldownTree<T>(
  chartType: T,
  buckets: Datapoint[],
  currentState: Array<DrilldownView<T>>,
  xKey: string,
  yKey: string,
  additionalSeriesOptions?: Highcharts.SeriesOptionsType,
): Array<DrilldownView<T>> {
  if (!buckets || buckets.length === 0) {
    return currentState;
  } else {
    const initialAcc = {
      drilldownNodes: currentState,
      buckets: [],
    };
    const nextLevelBuckets: DrilldownAccumulator<T> = buckets.reduce(
      (acc: DrilldownAccumulator<T>, buck: Datapoint) => {
        const subBuckets: Dataset = ((buck.buckets as Datapoint[]) || []).map(b => {
          const nextDrilldownId = b.buckets ? uniqueId() : undefined;
          return {
            ...b,
            drilldown: nextDrilldownId,
          };
        }) as Dataset;
        const drilldownNode: DrilldownView<T> = {
          ...(additionalSeriesOptions as any),
          id: buck.drilldown as string,
          name: buck[xKey] as string,
          type: chartType,
          data: subBuckets.map((sub: Datapoint) => {
            return {
              name: sub[xKey] as string,
              drilldown: sub.drilldown,
              y: sub[yKey] as number,
              count: sub[`${yKey}-count`],
              percentage: sub[`${yKey}-percentage`],
            };
          }),
        };
        const nextDrilldownNodes = acc.drilldownNodes.concat([drilldownNode]);
        const nextBuckets = acc.buckets.concat(subBuckets);
        return {
          drilldownNodes: nextDrilldownNodes,
          buckets: nextBuckets,
        };
      },
      initialAcc,
    );
    return buildDrilldownTree(
      chartType,
      nextLevelBuckets.buckets,
      nextLevelBuckets.drilldownNodes,
      xKey,
      yKey,
      additionalSeriesOptions,
    );
  }
}

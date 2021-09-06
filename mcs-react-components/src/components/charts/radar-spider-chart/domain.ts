import * as Highcharts from 'highcharts';
import moment from 'moment';
import { TooltipChart } from '../../../utils/DashboardsInterfaces';

export type SerieSortType = 'A-Z' | 'Z-A';

export const BASE_CHART_HEIGHT = 400;

export const generateTooltip = (
  showTooltip: boolean = true,
  useTimeFormatter: boolean = false,
  tooltip?: TooltipChart,
  withCount: boolean = false,
): Partial<Highcharts.TooltipOptions> => {
  const pointFormat = withCount ? `{point.y}% count:{point.count}` : `{point.y}`;
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
        pointFormat: `<span style="color:{point.color}; font-size: 20px; margin-right: 20px;">\u25CF</span> {series.name}: <b>${
          tooltip ? tooltip.formatter : pointFormat
        }</b><br/>`,
        pointFormatter: useTimeFormatter
          ? function callback() {
              return `<span style="color:${
                // tslint:disable-next-line
                this.color
              }; font-size: 20px; margin-right: 20px;">\u25CF</span> ${
                // tslint:disable-next-line
                this.series.name
              }: <b>${moment
                // tslint:disable-next-line
                .duration(this.y as number, 'second')
                .format('h[hr] m[min] s[s]')}</b><br/>`;
            }
          : undefined,
      }
    : { enabled: false };
};

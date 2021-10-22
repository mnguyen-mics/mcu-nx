import { Index } from '@mediarithmics-private/mcs-components-library/lib/utils';
import numeral from 'numeral';
import { ReportView } from '../models/report/ReportView';
export function formatMetric(
  value: any,
  numeralFormat: string,
  prefix: string = '',
  suffix: string = '',
) {
  if (value !== undefined && !isNaN(value)) {
    return `${prefix}${numeral(value).format(numeralFormat)}${suffix}`;
  }
  return '-';
}

/**
 * Normalize a reportView to an object like the following :
 *
 * {
 *  columns_headers:["campaign_id","impressions","clicks"]
 *  rows: [["1812",4,0],["1814",38258,86]]
 * }
 *
 * TO
 *
 * [
 *  {
 *    campaign_id: "1812",
 *    impressions: 4
 *  },
 *  ...
 * ]
 *
 * @param {Object} reportView an object comming from performance api
 * @return {Object} normalized object
 */
export function normalizeReportView<T = Index<any>>(reportView: ReportView): T[] {
  const headers = reportView.columns_headers;
  const rows = reportView.rows;
  return rows.map(row => {
    return headers.reduce(
      (acc, header, index) => ({
        ...acc,
        [header]: row[index],
      }),
      {},
    );
  }) as T[];
}

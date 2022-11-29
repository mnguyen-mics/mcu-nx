import {
  QueryExecutionSource,
  QueryExecutionSubSource,
} from '../models/platformMetrics/QueryExecutionSource';

export function getOTQLSourceHeader(
  source: QueryExecutionSource,
  subSource: QueryExecutionSubSource,
): string {
  return `${source}:${subSource}`;
}

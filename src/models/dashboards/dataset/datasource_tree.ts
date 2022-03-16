import { QueryPrecisionMode } from '../../datamart/graphdb/OTQLResult';
import { ReportRequestBody } from '../../report/ReportRequestBody';
import { DateOptions, DecoratorsOptions, IndexOptions, SourceType } from './common';

export interface AbstractSource {
  type: SourceType;
  series_title?: string;
}

export interface AbstractParentSource extends AbstractSource {
  sources: AbstractSource[];
}

export interface AnalyticsSource<M, D> extends AbstractSource {
  query_json: ReportRequestBody<M, D>;
  adapt_to_scope?: boolean;
  datamart_id?: string;
}
export interface OTQLSource extends AbstractSource {
  query_text?: string;
  query_id?: string;
  precision?: QueryPrecisionMode;
  adapt_to_scope?: boolean;
  datamart_id?: string;
}

export interface AggregationSource extends AbstractParentSource {}

export interface IndexSource extends AbstractParentSource {
  options: IndexOptions;
}

export interface RatioSource extends AbstractParentSource {}

export interface DateFormatSource extends AbstractParentSource {
  date_options: DateOptions;
}

export interface GetDecoratorsSource extends AbstractParentSource {
  decorators_options: DecoratorsOptions;
}

export interface DataFileSource extends AbstractSource {
  uri: string;
  JSON_path: string;
}

export interface DataSource {
  dataset: AbstractSource;
}

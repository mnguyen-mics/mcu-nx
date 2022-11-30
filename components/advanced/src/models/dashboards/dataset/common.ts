export type AnalyticsSourceType =
  | 'activities_analytics'
  | 'collection_volumes'
  | 'resources_usage'
  | 'data_ingestion';

export type SourceType =
  | 'otql'
  | 'join'
  | 'to-list'
  | 'index'
  | 'to-percentages'
  | 'ratio'
  | 'format-dates'
  | 'data_file'
  | 'reduce'
  | AnalyticsSourceType;

export type Order = `descending` | `ascending`;

export interface IndexOptions {
  minimum_percentage?: number;
  sort?: Order;
  limit?: number;
}

export interface DateOptions {
  format?: string;
  buckets?: DateOptions;
}

export interface DecoratorsOptions {
  model_type?: ModelType;
  buckets?: DecoratorsOptions;
}

export declare type ModelType = 'CHANNELS' | 'SEGMENTS' | 'COMPARTMENTS';

export declare type ReduceType = 'max' | 'min' | 'sum' | 'avg' | 'count' | 'first' | 'last';
export interface ReduceOptions {
  type: ReduceType;
}

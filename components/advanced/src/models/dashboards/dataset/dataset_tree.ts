import { Dataset } from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import { DateOptions, DecoratorsOptions, IndexOptions, ReduceOptions, SourceType } from './common';
import { OTQLDataResult } from '../../datamart/graphdb/OTQLResult';

export interface AbstractDatasetTree {
  type: SourceType;
  series_title?: string;
}

export interface AbstractParentDataset extends AbstractDatasetTree {
  children: AbstractDatasetTree[];
}

export interface AnalyticsDataset extends AbstractDatasetTree {
  dataset: AbstractDataset;
}
export interface OTQLDataset extends AbstractDatasetTree {
  dataset: AbstractDataset;
}

export interface AggregationDataset extends AbstractParentDataset {}

export interface IndexDataset extends AbstractParentDataset {
  options: IndexOptions;
}

export interface RatioDataset extends AbstractParentDataset {}

export interface ReduceDataset extends AbstractParentDataset {
  reduce_options: ReduceOptions;
}

export interface DateFormatDataset extends AbstractParentDataset {
  date_options: DateOptions;
}

export interface GetDecoratorsDataset extends AbstractParentDataset {
  decorators_options: DecoratorsOptions;
}

export type DatasetShape =
  | OTQLDataset
  | AnalyticsDataset
  | DatafileDataset
  | AggregateDataset
  | IndexDataset
  | RatioDataset
  | DateFormatDataset
  | ReduceDataset
  | GetDecoratorsDataset;

export type DatasetType = 'aggregate' | 'count' | 'json';

export abstract class AbstractDataset {
  type: DatasetType;
}

interface DatasetMetadata {
  seriesTitles: string[];
}

export interface AggregateDataset extends AbstractDataset {
  metadata: DatasetMetadata;
  dataset: Dataset;
}

export interface CountDataset extends AbstractDataset {
  value: number;
}

export interface JsonDataset extends AbstractDataset {
  rows: OTQLDataResult[];
}

export interface DatafileDataset extends AbstractDatasetTree {
  dataset: AbstractDataset;
}

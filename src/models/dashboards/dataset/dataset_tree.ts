import { Dataset } from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import { DateOptions, DecoratorsOptions, IndexOptions, SourceType } from './common';

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

export interface DateFormatDataset extends AbstractParentDataset {
  date_options: DateOptions;
}

export interface GetDecoratorsDataset extends AbstractParentDataset {
  decorators_options: DecoratorsOptions;
}

export type DatasetType = 'aggregate' | 'count';

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

export interface DatafileDataset extends AbstractDatasetTree {
  dataset: AbstractDataset;
}

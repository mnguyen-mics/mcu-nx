import { ChartConfig, SourceType } from '../../services/ChartDatasetService';
import { DimensionFilter } from '../report/ReportRequestBody';

export interface CustomDashboardResource {
  id: string;
  title: string;
  scopes: string[]; // Where to show the dashboard
  segment_ids: string[]; // If scope contains segments, the IDs of the segments where you want to see the dashboard
  builder_ids: string[]; // If scope contains builders, the IDs of the builders where you want to see the dashboard
  archived: boolean;
  dashboard_content_id?: string;
  organisation_id: string;
  community_id: string;
  created_ts: Date;
  created_by: string;
  last_modified_ts?: Date;
  last_modified_by?: string;
}

export interface CustomDashboardContentResource {
  id: string;
  content: DashboardContentSchema;
  organisation_id: string;
  created_ts: Date;
  created_by: string;
}

export interface DashboardContentSchema {
  sections: DashboardContentSection[];
  available_filters?: DashboardAvailableFilters[];
}

interface DashboardContentSection {
  title: string;
  cards: DashboardContentCard[];
}

export interface DashboardContentCard {
  x: number;
  y: number;
  w: number;
  h: number;
  layout?: string;
  charts: ChartConfig[];
}

export interface DashboardAvailableFilters {
  technical_name: DashboardAvailableFilterType;
  title: string;
  values_retrieve_method: DashboardValuesRetrieveMethodType;
  values_query: string;
  multi_select: boolean;
  query_fragments: DashboardFilterQueryFragments[];
}

type DashboardAvailableFilterType = 'compartments';
type DashboardValuesRetrieveMethodType = 'query';

export interface DashboardFilterQueryFragments {
  type: SourceType;
  starting_object_type: string;
  fragment: string | DimensionFilter[];
}

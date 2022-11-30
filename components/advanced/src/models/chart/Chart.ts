import { ChartConfig, ChartType } from '../../services/ChartDatasetService';

export interface ChartResource {
  archived: boolean;
  content: ChartConfig;
  created_by: string;
  created_ts: number;
  id: string;
  last_modified_ts?: number;
  last_modified_by?: string;
  organisation_id: string;
  title: string;
  type: ChartType;
}

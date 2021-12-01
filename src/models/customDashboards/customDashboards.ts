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
  content: string;
  organisation_id: string;
  created_ts: Date;
  created_by: string;
}

export interface CustomDashboardResource {
  id: string;
  title: string;
  scopes: string[]; // Where to show the dashboard
  segments_id: string[]; // If scope contains segments, the IDs of the segments where you want to see the dashboard
  builders_id: string[]; // If scope contains builders, the IDs of the builders where you want to see the dashboard
  archived: boolean;
  dashboard_content_id?: string;
  datamart_id: string;
  creation_ts: Date;
  created_by: string;
  last_modified_ts?: Date;
  last_modified_by?: string;
}

export interface CustomDashboardContentResource {
  id: string;
  content: string;
  datamart_id: string;
  creation_ts: Date;
  created_by: string;
}

export type DatamartType = 'DATAMART' | 'CROSS_DATAMART';
export interface DatamartResource {
  id: string;
  name: string;
  organisation_id: string;
  token: string;
  creation_date: number;
  time_zone: string;
  type: DatamartType;
  datafarm: string;
  region: string;
  storage_model_version: string;
  archived: boolean;
}

export interface AudienceSegmentMetricResource {
  id: string;
  datafarmKey: string;
  datamartId: string;
  queryId: string;
  technical_name:
    | 'user_accounts'
    | 'emails'
    | 'desktop_cookie_ids'
    | 'mobile_ad_ids'
    | 'mobile_cookie_ids';
  display_name: string;
  icon: string;
  status: 'DRAFT' | 'LIVE' | 'ARCHIVED';
  creationDate: number;
  lastModifiedDate: number;
  lastPublishedDate: number;
}
export interface DatamartWithMetricResource extends DatamartResource {
  audience_segment_metrics: AudienceSegmentMetricResource[];
}

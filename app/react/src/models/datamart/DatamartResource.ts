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
}

type DatamartType = 'DATAMART' | 'CROSS_DATAMART';

export type QueryLanguage = 'SELECTORQL' | 'OTQL' | 'JSON_OTQL';

export interface QueryCreateRequest {
  datamart_id: string;
  major_version?: string;
  minor_version?: string;
  query_language: QueryLanguage;
  query_text: string;
}

export interface QueryResource extends QueryCreateRequest {
  id: string;
}

export interface UserAccountCompartmentResource {
  id: string;
  organisation_id: string;
  token: string;
  name: string;
  archived: boolean;
}

export interface UserAccountCompartmentDatamartSelectionResource {
  id: string;
  datamart_id: string;
  compartment_id: string;
  default: boolean;
  token: string;
  name: string;
}

export interface AutoCompleteResource {
  type: string;
  object_type_name: string;
  field_name: string;
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

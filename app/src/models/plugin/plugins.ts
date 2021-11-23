export interface PluginResource {
  id: string;
  name?: string;
  organisation_id: string;
  plugin_type?: PluginType;
  group_id: string;
  artifact_id: string;
  current_version_id?: string;
}
export interface PluginVersionResource {
  id: string;
  plugin_id: string;
  organisation_id: string;
  plugin_type: PluginType;
  group_id: string;
  artifact_id: string;
  version_id: string;
  max_qps: number;
  archived: boolean;
}

export interface PluginInstance {
  id: string;
  artifact_id: string;
  group_id: string;
  version_id: string;
  version_value: string;
  organisation_id: string;
}

export interface IntegrationBatchResource extends PluginInstance {
  name?: string;
  creation_ts: number;
  last_modified_ts?: number;
  created_by: string;
  last_modified_by?: string;
  cron?: string;
  cron_status?: CronStatus;
  archived: boolean;
}

export type CronStatus = 'ACTIVE ' | 'PAUSED';

export type PluginType =
  | 'DISPLAY_CAMPAIGN_EDITOR'
  | 'DISPLAY_CAMPAIGN_USER_SCENARIO'
  | 'EMAIL_CAMPAIGN_EDITOR'
  | 'EMAIL_TEMPLATE_EDITOR'
  | 'EMAIL_TEMPLATE_RENDERER'
  | 'EMAIL_ROUTER'
  | 'DISPLAY_AD_EDITOR'
  | 'DISPLAY_AD_RENDERER'
  | 'RECOMMENDER'
  | 'VIDEO_AD_EDITOR'
  | 'VIDEO_AD_RENDERER'
  | 'STYLE_SHEET'
  | 'AUDIENCE_SEGMENT_EXTERNAL_FEED'
  | 'AUDIENCE_SEGMENT_TAG_FEED'
  | 'BID_OPTIMIZATION_ENGINE'
  | 'ATTRIBUTION_PROCESSOR'
  | 'ACTIVITY_ANALYZER'
  | 'DATA_CONNECTOR'
  | 'SCENARIO_NODE_PROCESSOR'
  | 'ML_FUNCTION'
  | 'SCENARIO_CUSTOM_ACTION'
  | 'INTEGRATION_BATCH';

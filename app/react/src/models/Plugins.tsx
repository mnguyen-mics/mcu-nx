import { PluginLayout } from "./plugin/PluginLayout";

export interface PluginResource {
  id: string;
  organisation_id: string;
  plugin_type?: PluginType;
  group_id: string;
  artifact_id: string;
  current_version_id?: string;
}

export interface LayoutablePlugin extends PluginResource {
  plugin_layout?: PluginLayout;
}

export interface PluginProperty {
  deletable: boolean;
  origin: string;
  property_type: string;
  technical_name: string;
  value: any;
  writable: boolean;
}

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
 | 'ML_FUNCTION';

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
  id?: string;
  artifact_id: string;
  group_id: string;
  version_id: string;
  version_value: string;
  organisation_id: string;
}

export interface AttributionModelCreateRequest extends PluginInstance {
  artifact_id: string;
  group_id: string;
  mode?: 'STRICT' | 'DISCOVERY';
  name: string;
}

export interface AttributionModel extends AttributionModelCreateRequest {
  attribution_processor_id: string;
  id: string;
  organisation_id: string;
}

export interface BidOptimizer extends PluginInstance {
  engine_artifact_id: string;
  engine_group_id: string;
  engine_version_id: string;
  id: string;
  name: string;
  organisation_id: string;
}
export interface EmailRouter extends PluginInstance {
  id: string;
  name: string;
  organisation_id: string;
  group_id: string;
  artifact_id: string;
  version_value: string;
  version_id: string;
}

export interface VisitAnalyzer extends PluginInstance {
  id: string;
  artifact_id: string;
  name: string;
  group_id: string;
  version_id: string;
  version_value: string;
  visit_analyzer_plugin_id: string;
  organisation_id: string;
}

export interface Recommender extends PluginInstance {
  id: string;
  artifact_id: string;
  name: string;
  group_id: string;
  version_id: string;
  version_value: string;
  recommenders_plugin_id: string;
  organisation_id: string;
}

export type Status = 'INITIAL' | 'PAUSED' | 'ACTIVE' | 'PUBLISHED';
export interface AudienceExternalFeed extends PluginInstance  {
  artifact_id: string;
  audience_segment_id: string;
  group_id: string;
  id: string;
  organisation_id: string;
  status: Status;
  version_id: string;
}

export interface AudienceTagFeed extends PluginInstance {
  artifact_id: string;
  audience_segment_id: string;
  group_id: string;
  id: string;
  status: Status;
  organisation_id: string;
  version_id: string;
}

export interface Adlayout {
  id: string;
  name: string;
  optimal_formats: string;
  organisation_id: string;
  renderer_id: string;
  render_version_id: string;
}

export interface StylesheetVersionResource {
  artifact_id: string;
  creation_date: number;
  description: string;
  group_id: string;
  id: string;
  organisation_id: string;
  plugin_version_id: string;
  status: string;
  style_sheet_id: string;
  version_id: string;
}

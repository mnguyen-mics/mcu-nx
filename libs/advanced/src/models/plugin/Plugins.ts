import { PropertyResourceShape } from '.';
import { BaseExecutionResource } from '../job/jobs';
import { PluginLayout } from './PluginLayout';

export interface PluginResource {
  id: string;
  name?: string;
  organisation_id: string;
  plugin_type?: PluginType;
  group_id: string;
  artifact_id: string;
  current_version_id?: string;
}

export interface LayoutablePlugin extends PluginResource {
  plugin_layout?: PluginLayout;
  plugin_preset?: PluginPresetResource;
}

export interface StrictlyLayoutablePlugin extends PluginResource {
  plugin_layout: PluginLayout;
  plugin_preset?: PluginPresetResource;
  plugin_version_properties: PropertyResourceShape[];
  plugin_type: PluginType;
  disabled?: boolean;
}

export interface PluginProperty {
  deletable: boolean;
  origin: string;
  property_type: string;
  technical_name: string;
  value: any;
  writable: boolean;
}

export interface PluginPresetResource {
  archived: boolean;
  id: string;
  plugin_id: string;
  plugin_version_id: string;
  organisation_id: string;
  plugin_type?: PluginType;
  name: string;
  description?: string;
  properties: PluginPresetProperty[];
}

export interface PluginPresetProperty {
  property_type: string;
  technical_name: string;
  value: any;
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
  | 'ML_FUNCTION'
  | 'SCENARIO_CUSTOM_ACTION'
  | 'INTEGRATION_BATCH';

export type ErrorRecoveryStrategy =
  | 'STORE_WITH_ERROR_ID'
  | 'DROP'
  | 'STORE_WITH_ERROR_ID_AND_SKIP_UPCOMING_ANALYZERS';
export interface PluginVersionResource {
  id: string;
  plugin_id: string;
  organisation_id: string;
  plugin_type: PluginType;
  group_id: string;
  artifact_id: string;
  version_id: string;
  build_tag?: string;
  image_name?: string;
  max_qps: number;
  archived: boolean;
}

export interface PluginManagerResource {
  name: string;
  running_containers: RunningContainerResource[];
}

export interface RunningContainerResource {
  container: string;
}

export interface PluginActionResource {
  action: PluginAction;
  args: PluginActionArgsResource;
}

export enum PluginActionEnum {
  'DEPLOY_PLUGIN',
  'UPGRADE_ALL_CONTAINERS',
  'UPDATE_MAINTAINER',
  'DECLARE_IMAGE_NAME',
}

export type PluginAction = keyof typeof PluginActionEnum;

export interface PluginActionArgsResource {
  target_build_tag?: string;
  maintainer_id?: string;
  target_image_name?: string;
}

export interface PluginInstance {
  id?: string;
  artifact_id: string;
  group_id: string;
  version_id: string;
  version_value: string;
  organisation_id: string;
}

export interface CustomActionResource extends PluginInstance {
  id: string;
  name: string;
  creation_ts: string;
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
  error_recovery_strategy: string;
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

export enum StatusEnum {
  'INITIAL',
  'PAUSED',
  'ACTIVE',
  'PUBLISHED',
}
export type Status = keyof typeof StatusEnum;

export type AudienceSegmentFeedSourceType = 'SEGMENT' | 'AUTOMATION';

export interface AudienceExternalFeed extends PluginInstance {
  artifact_id: string;
  audience_segment_id: string;
  group_id: string;
  id: string;
  organisation_id: string;
  status: Status;
  version_id: string;
  name?: string;
  created_from: AudienceSegmentFeedSourceType;
  scenario_id?: string;
}

export interface AudienceTagFeed extends PluginInstance {
  artifact_id: string;
  audience_segment_id: string;
  group_id: string;
  id: string;
  status: Status;
  organisation_id: string;
  version_id: string;
  name?: string;
  created_from: AudienceSegmentFeedSourceType;
  scenario_id?: string;
}

export type AudienceFeed = AudienceTagFeed | AudienceExternalFeed;

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

type AdLayoutStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface AdLayoutVersionResource {
  id: string;
  version_id: string;
  creation_date: number;
  filename: string;
  template: string;
  ad_layout_id: string;
  status: AdLayoutStatus;
}

export type CronStatus = 'ACTIVE' | 'PAUSED';

export type ExecutionContainerResourceSize = 'LOW' | 'MEDIUM' | 'LARGE' | 'XL';

export interface IntegrationBatchResource extends PluginInstance {
  name?: string;
  creation_ts: number;
  last_modified_ts?: number;
  created_by: string;
  last_modified_by?: string;
  cron?: string | null;
  cron_status?: CronStatus | null;
  execution_container_cpu_size: ExecutionContainerResourceSize;
  execution_container_ram_size: ExecutionContainerResourceSize;
  execution_container_disk_size: ExecutionContainerResourceSize;
  archived: boolean;
}

export type ExecutionType = 'MANUAL' | 'CRON';

export interface IntegrationBatchJobInputParameter {
  execution_type?: ExecutionType;
  expected_start_date?: number;
}

export interface IntegrationBatchJobResource
  extends BaseExecutionResource<IntegrationBatchJobInputParameter, any> {
  job_type: 'INTEGRATION_BATCH';
  external_model_name: 'PUBLIC_INTEGRATION_BATCH';
}

export interface ConfigurationFileListingEntryResource {
  technical_name: string;
}

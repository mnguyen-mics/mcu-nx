import {
  DisplayCampaignFormData,
  ABNFormData,
  EmailCampaignAutomationFormData,
} from '../../containers/Automations/Builder/AutomationNode/Edit/domain';

import { QueryResource } from './../datamart/DatamartResource';
import { AutomationSimpleFormData } from './../../containers/Automations/Builder/ActionBar/AutomationSimpleForm';
export interface AutomationResource {
  id: string;
  name: string;
  datamart_id: string;
  organisation_id: string;
  status: AutomationStatus;
  technical_name?: string;
}

export function isAutomationResource(
  automation: AutomationSimpleFormData,
): automation is AutomationResource {
  return (automation as AutomationResource).id !== undefined;
}

export type AutomationStatus = 'NEW' | 'ACTIVE' | 'PAUSED';
export const automationStatuses: AutomationStatus[] = [
  'NEW',
  'ACTIVE',
  'PAUSED',
];

export interface AutomationCreateResource {
  name: string;
  datamart_id: string;
  technical_name?: string;
}

export interface StorylineResource {
  begin_node_id: string;
}

export interface ScenarioNodeResource {
  id: string;
  name: string;
  scenario_id: string;
  x?: number;
  y?: number;
}

export interface DisplayCampaignNodeResource extends ScenarioNodeResource {
  type: 'DISPLAY_CAMPAIGN';
  campaign_id: string;
  ad_group_id: string;
  formData?: DisplayCampaignFormData;
}

export interface EmailCampaignNodeResource extends ScenarioNodeResource {
  type: 'EMAIL_CAMPAIGN';
  campaign_id: string;
  formData?: EmailCampaignAutomationFormData;
}

export interface QueryInputNodeResource extends ScenarioNodeResource {
  type: 'QUERY_INPUT';
  formData: Partial<QueryResource>;
  query_id: string;
  evaluation_mode?: string;
  evaluation_period?: string;
  evaluation_period_unit?: string;
}

export interface ABNNodeResource extends ScenarioNodeResource {
  type: 'ABN_NODE';
  edges_selection: { [nodeId: string]: { min: number; max: number } };
  formData?: ABNFormData;
}

export interface PluginNodeResource extends ScenarioNodeResource {
  type: 'PLUGIN_NODE';
  artifact_id: string;
  group_id: string;
  id: string;
  name: string;
  scenario_id: string;
  scenario_node_processor_id: string;
}

export interface EndNodeResource extends ScenarioNodeResource {
  type: 'FAILURE' | 'GOAL';
}

export interface StartNodeResource extends ScenarioNodeResource {
  type: 'START';
  query_id?: string;
  formData: Partial<QueryResource>;
}

export interface WaitNodeResource extends ScenarioNodeResource {
  type: 'WAIT';
}

export type ScenarioNodeShape =
  | DisplayCampaignNodeResource
  | EmailCampaignNodeResource
  | QueryInputNodeResource
  | ABNNodeResource
  | PluginNodeResource
  | EndNodeResource
  | StartNodeResource
  | WaitNodeResource;

export interface ScenarioEdgeResource {
  id: string;
  source_id: string;
  target_id: string;
  handler: EdgeHandler;
  scenario_id: string;
}

export type EdgeHandler = 'ON_VISIT' | 'ON_GOAL' | 'GOAL';

export interface StorylineNodeResource {
  node: ScenarioNodeShape;
  in_edge?: ScenarioEdgeResource;
  out_edges: StorylineNodeResource[];
}

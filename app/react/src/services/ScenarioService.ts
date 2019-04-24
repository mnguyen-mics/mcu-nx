import { injectable } from 'inversify';
import {
  ScenarioNodeShape,
  StorylineResource,
  ScenarioEdgeResource,
} from './../models/automations/automations';
import ApiService, { DataListResponse, DataResponse } from './ApiService';
import {
  AutomationResource,
  AutomationCreateResource,
  AutomationStatus,
} from '../models/automations/automations';
import { PaginatedApiParam } from '../utils/ApiHelper';
import {
  PAGINATION_SEARCH_SETTINGS,
  FILTERS_SEARCH_SETTINGS,
  KEYWORD_SEARCH_SETTINGS,
} from '../utils/LocationSearchHelper';

export interface GetAutomationsOptions extends PaginatedApiParam {
  organisation_id?: string;
  keywords?: string;
  status?: AutomationStatus[];
  order_by?: string[];
  first_result?: number;
  max_results?: number;
}

export const SCENARIOS_SEARCH_SETTINGS = [
  ...PAGINATION_SEARCH_SETTINGS,
  ...FILTERS_SEARCH_SETTINGS,
  ...KEYWORD_SEARCH_SETTINGS,
];

export interface IScenarioService {
  /*****   AUTOMATION RESOURCE   *****/
  getScenarios: (
    organisationId: string,
    options: GetAutomationsOptions,
  ) => Promise<DataListResponse<AutomationResource>>;
  getScenario: (
    scenarioId: string,
    options?: GetAutomationsOptions,
  ) => Promise<DataResponse<AutomationResource>>;
  createScenario: (
    organisationId: string,
    scenario: AutomationCreateResource,
  ) => Promise<DataResponse<AutomationResource>>;
  updateScenario: (
    scenarioId: string,
    scenario: AutomationResource,
  ) => Promise<DataResponse<AutomationResource>>;
  deleteScenario: (
    scenarioId: string,
  ) => Promise<DataResponse<AutomationResource>>;
  /*****   STORYLINE RESOURCE   *****/
  getScenarioStoryline: (
    scenarioId: string,
  ) => Promise<DataResponse<StorylineResource>>;
  updateScenarioStoryline: (
    scenarioId: string,
    storyline: StorylineResource,
  ) => Promise<DataResponse<StorylineResource>>;
  /*****   BEGIN NODE RESOURCE   *****/
  getScenarioBeginNode: (
    scenarioId: string,
  ) => Promise<DataResponse<StorylineResource>>;
  createScenarioBeginNode: (
    scenarioId: string,
    storyline: any,
  ) => Promise<DataResponse<StorylineResource>>;
  /*****   SCENARIO NODE RESOURCE   *****/
  getScenarioNodes: (
    scenarioId: string,
  ) => Promise<DataListResponse<ScenarioNodeShape>>;
  createScenarioNode: (
    scenarioId: string,
    scenarioNode: any,
  ) => Promise<DataResponse<ScenarioNodeShape>>;
  deleteScenarioNode: (
    scenarioId: string,
    scenarioNode: ScenarioNodeShape,
  ) => Promise<DataResponse<ScenarioNodeShape>>;
  updateScenarioNode: (
    scenarioId: string,
    nodeId: string,
    scenarioNode: any,
  ) => Promise<DataResponse<ScenarioNodeShape>>;
  /*****   SCENARION EDGE RESOURCE   *****/
  getScenarioEdges: (
    scenarioId: string,
  ) => Promise<DataListResponse<ScenarioEdgeResource>>;
  createScenarioEdge: (
    scenarioId: string,
    scenarioEdge: ScenarioEdgeResource,
  ) => Promise<DataResponse<ScenarioEdgeResource>>;
  deleteScenarioEdge: (
    scenarioId: string,
    edgeId: string,
  ) => Promise<DataResponse<ScenarioEdgeResource>>;
  updateScenarioEdge: (
    scenarioId: string,
    edgeId: string,
    scenarioEdge: ScenarioEdgeResource,
  ) => Promise<DataResponse<ScenarioEdgeResource>>;
}

@injectable()
export class ScenarioService implements IScenarioService {
  getScenarios(
    organisationId: string,
    options: object = {},
  ): Promise<DataListResponse<AutomationResource>> {
    const endpoint = 'scenarios';
    const params = {
      organisation_id: organisationId,
      ...options,
    };
    return ApiService.getRequest(endpoint, params);
  }
  getScenario(
    scenarioId: string,
    options: object = {},
  ): Promise<DataResponse<AutomationResource>> {
    const endpoint = `scenarios/${scenarioId}`;
    return ApiService.getRequest(endpoint, options);
  }
  deleteScenario(
    scenarioId: string,
  ): Promise<DataResponse<AutomationResource>> {
    const endpoint = `scenarios/${scenarioId}`;
    return ApiService.deleteRequest(endpoint);
  }
  createScenario(
    organisationId: string,
    scenario: AutomationCreateResource,
  ): Promise<DataResponse<AutomationResource>> {
    const endpoint = `scenarios?organisation_id=${organisationId}`;
    return ApiService.postRequest(endpoint, scenario);
  }
  updateScenario(
    scenarioId: string,
    scenario: AutomationResource,
  ): Promise<DataResponse<AutomationResource>> {
    const endpoint = `scenarios/${scenarioId}`;
    return ApiService.putRequest(endpoint, scenario);
  }
  // Storyline
  getScenarioStoryline(
    scenarioId: string,
  ): Promise<DataResponse<StorylineResource>> {
    const endpoint = `scenarios/${scenarioId}/storyline`;
    return ApiService.getRequest(endpoint);
  }
  updateScenarioStoryline(
    scenarioId: string,
    storyline: StorylineResource,
  ): Promise<DataResponse<StorylineResource>> {
    const endpoint = `scenarios/${scenarioId}/storyline`;
    return ApiService.putRequest(endpoint, storyline);
  }
  getScenarioBeginNode(
    scenarioId: string,
  ): Promise<DataResponse<StorylineResource>> {
    const endpoint = `scenarios/${scenarioId}/storyline/begin`;
    return ApiService.getRequest(endpoint);
  }
  createScenarioBeginNode(
    scenarioId: string,
    storyline: any,
  ): Promise<DataResponse<StorylineResource>> {
    const endpoint = `scenarios/${scenarioId}/storyline/begin`;
    return ApiService.postRequest(endpoint, storyline);
  }
  // Storyline Nodes
  getScenarioNodes(
    scenarioId: string,
  ): Promise<DataListResponse<ScenarioNodeShape>> {
    const endpoint = `scenarios/${scenarioId}/storyline/nodes`;
    return ApiService.getRequest(endpoint);
  }
  createScenarioNode(
    scenarioId: string,
    scenarioNode: ScenarioNodeShape,
  ): Promise<DataResponse<ScenarioNodeShape>> {
    const endpoint = `scenarios/${scenarioId}/storyline/nodes`;
    return ApiService.postRequest(endpoint, scenarioNode);
  }
  deleteScenarioNode(
    scenarioId: string,
  ): Promise<DataResponse<ScenarioNodeShape>> {
    const endpoint = `scenarios/${scenarioId}/storyline/nodes`;
    return ApiService.deleteRequest(endpoint);
  }
  updateScenarioNode(
    scenarioId: string,
    nodeId: string,
    scenarioNode: ScenarioNodeShape,
  ): Promise<DataResponse<ScenarioNodeShape>> {
    const endpoint = `scenarios/${scenarioId}/storyline/nodes/${nodeId}`;
    return ApiService.putRequest(endpoint, scenarioNode);
  }
  // Storyline Edges
  getScenarioEdges(
    scenarioId: string,
  ): Promise<DataListResponse<ScenarioEdgeResource>> {
    const endpoint = `scenarios/${scenarioId}/storyline/edges`;
    return ApiService.getRequest(endpoint);
  }
  createScenarioEdge(
    scenarioId: string,
    scenarioEdge: ScenarioEdgeResource,
  ): Promise<DataResponse<ScenarioEdgeResource>> {
    const endpoint = `scenarios/${scenarioId}/storyline/edges`;
    return ApiService.postRequest(endpoint, scenarioEdge);
  }
  deleteScenarioEdge(
    scenarioId: string,
    edgeId: string,
  ): Promise<DataResponse<ScenarioEdgeResource>> {
    const endpoint = `scenarios/${scenarioId}/storyline/edges/${edgeId}`;
    return ApiService.deleteRequest(endpoint);
  }
  updateScenarioEdge(
    scenarioId: string,
    edgeId: string,
    scenarioEdge: ScenarioEdgeResource,
  ): Promise<DataResponse<ScenarioEdgeResource>> {
    const endpoint = `scenarios/${scenarioId}/storyline/edges/${edgeId}`;
    return ApiService.putRequest(endpoint, scenarioEdge);
  }
}

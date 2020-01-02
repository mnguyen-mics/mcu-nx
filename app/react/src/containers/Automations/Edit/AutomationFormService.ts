import { IDisplayCampaignService } from './../../../services/DisplayCampaignService';
import _ from 'lodash';
import {
  AutomationResource,
  ScenarioNodeShape,
  ScenarioEdgeResource,
  QueryInputNodeResource,
} from './../../../models/automations/automations';
import { IScenarioService } from './../../../services/ScenarioService';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../constants/types';
import { AutomationFormData } from './domain';
import { buildAutomationTreeData, StorylineNodeModel } from '../Builder/domain';
import { DataResponse } from '../../../services/ApiService';
import {
  isQueryInputNode,
  isDisplayCampaignNode,
  isScenarioNodeShape,
  DisplayCampaignAutomationFormData,
  INITIAL_DISPLAY_CAMPAIGN_NODE_FORM_DATA,
  isEmailCampaignNode,
  INITIAL_EMAIL_CAMPAIGN_NODE_FORM_DATA,
  EmailCampaignAutomationFormData,
  isAbnNode,
  isEndNode,
  isWaitNode,
  ABNFormData,
  WaitFormData,
  isIfNode,
} from '../Builder/AutomationNode/Edit/domain';
import { INITIAL_AUTOMATION_DATA } from '../Edit/domain';
import { IQueryService } from '../../../services/QueryService';
import { Task, executeTasksInSequence } from '../../../utils/FormHelper';
import EmailCampaignService from '../../../services/EmailCampaignService';
import EmailCampaignFormService, {
  getBlastTasks,
  getRouterTasks,
} from '../../Campaigns/Email/Edit/EmailCampaignFormService';
import { isFakeId } from '../../../utils/FakeIdHelper';
import { IDisplayCampaignFormService } from '../../Campaigns/Display/Edit/DisplayCampaignFormService';
import { defineMessages } from 'react-intl';

interface CustomEdgeResource {
  source_id: string;
  target_id: string;
  edgeResource?: ScenarioEdgeResource;
}

export interface IAutomationFormService {
  loadInitialAutomationValues: (
    automationId: string,
    storageModelVersionId: string,
  ) => Promise<AutomationFormData>;
  saveOrCreateAutomation: (
    organisationId: string,
    storageModelVersionId: string,
    formData: AutomationFormData,
    initialFormData: AutomationFormData,
  ) => Promise<DataResponse<AutomationResource>>;
  validateAutomation:(
    storylineNode: StorylineNodeModel
  ) => Promise<void>;
}

const messages = defineMessages({
  emptyQuery: {
    id: 'automation.builder.emptyQuery',
    defaultMessage: 'Please define the queries for all nodes who need it.',
  }
});

@injectable()
export class AutomationFormService implements IAutomationFormService {
  @inject(TYPES.IScenarioService)
  private _scenarioService: IScenarioService;

  @inject(TYPES.IQueryService)
  private _queryService: IQueryService;

  @inject(TYPES.IDisplayCampaignFormService)
  private _displayCampaignFormService: IDisplayCampaignFormService;

  @inject(TYPES.IDisplayCampaignService)
  private _displayCampaignService: IDisplayCampaignService;

  private ids: string[] = [];

  loadInitialAutomationValues(
    automationId: string,
    storageModelVersion: string,
  ): Promise<AutomationFormData> {
    const automationPromise = this._scenarioService.getScenario(automationId);
    const storylinePromise = this._scenarioService.getScenarioStoryline(
      automationId,
    );

    const nodePromise = (datamartId: string) =>
      this.loadScenarioNode(automationId, datamartId);

    const edgePromise = this._scenarioService.getScenarioEdges(automationId);

    if (storageModelVersion !== 'v201506') {
      return this._scenarioService.getScenario(automationId).then(r => {
        return Promise.all([
          automationPromise,
          storylinePromise,
          nodePromise(r.data.datamart_id),
          edgePromise,
        ]).then(res => {
          return buildAutomationTreeData(
            res[1].data,
            res[2],
            res[3].data,
            this._queryService,
            res[0].data.datamart_id,
          ).then(storylineNodeModelRes => {
            return {
              automation: res[0].data,
              automationTreeData: storylineNodeModelRes,
            };
          });
        });
      });
    } else {
      return Promise.all([automationPromise]).then(res => {
        return {
          automation: res[0].data,
          automationTreeData: INITIAL_AUTOMATION_DATA.automationTreeData,
        };
      });
    }
  }

  loadScenarioNode(
    automationId: string,
    datamartId: string,
  ): Promise<ScenarioNodeShape[]> {
    return this._scenarioService
      .getScenarioNodes(automationId)
      .then(r => {
        r.data.map(n => {
          this.addNodeId(n.id);
        });
        return r;
      })
      .then(r => {
        return Promise.all(
          r.data.map(n => {
            let getPromise: Promise<ScenarioNodeShape> = Promise.resolve().then(
              () => ({ ...n }),
            );
            switch (n.type) {
              case 'DISPLAY_CAMPAIGN':
                getPromise = this._displayCampaignFormService
                  .loadCampaign(n.campaign_id)
                  .then(resp => {
                    const initialValues = {
                      campaign: resp.campaign,
                      name: resp.campaign.name!,
                      goalFields: resp.goalFields,
                      adGroupFields: resp.adGroupFields,
                    };
                    return {
                      ...n,
                      formData: initialValues,
                      initialFormData: initialValues,
                    };
                  });
                break;
              case 'EMAIL_CAMPAIGN':
                getPromise = EmailCampaignFormService.loadCampaign(
                  n.campaign_id,
                ).then(campaignResp => {
                  const initialValues = {
                    name: n.name,
                    campaign: campaignResp.campaign,
                    blastFields: campaignResp.blastFields,
                    routerFields: campaignResp.routerFields,
                  };
                  return {
                    ...n,
                    formData: initialValues,
                    initialValuesForm: initialValues,
                  };
                });
                break;

              case 'ABN_NODE':
                const abnFormData: ABNFormData = {
                  branch_number: n.branch_number ? n.branch_number : 2,
                  edges_selection: n.edges_selection,
                  name: 'Split',
                };
                getPromise = Promise.resolve().then(() => ({
                  ...n,
                  formData: abnFormData,
                }));
                break;
              case 'WAIT_NODE':
                const waitFormData: WaitFormData = {
                  timeout: n.timeout,
                  name: 'Wait',
                };
                getPromise = Promise.resolve().then(() => ({
                  ...n,
                  formData: waitFormData,
                }));
                break;
              case 'QUERY_INPUT':
                getPromise = this._queryService
                  .getQuery(datamartId, n.query_id)
                  .then(q => ({
                    ...n,
                    formData: {
                      ...q.data,
                      name: name,
                    },
                  }));
                break;
              case 'IF_NODE':
                getPromise = this._queryService
                  .getQuery(datamartId, n.query_id)
                  .then(q => ({
                    ...n,
                    name: "If",
                    formData: {
                      ...q.data,
                    },
                  }));
                break;
              case 'END_NODE':
              case 'PLUGIN_NODE':
                getPromise = Promise.resolve().then(() => ({ ...n }));
                break;
            }
            return getPromise;
          }),
        );
      });
  }

  removeNodeId = (id: string) =>
    (this.ids = this.ids.filter(n => n !== `n-${id}`));
  removeEdgeId = (id: string) =>
    (this.ids = this.ids.filter(n => n !== `e-${id}`));
  addNodeId = (id: string) => this.ids.push(`n-${id}`);
  addEdgeId = (id: string) => this.ids.push(`e-${id}`);

  saveOrCreateAutomation(
    organisationId: string,
    storageModelVersion: string,
    formData: AutomationFormData,
    initialFormData: AutomationFormData,
  ): Promise<DataResponse<AutomationResource>> {
    const automationId = formData.automation.id;

    const traverse = (s: StorylineNodeModel) => {
      if (s.node.id && !isFakeId(s.node.id)) this.addNodeId(s.node.id);
      if (s.in_edge) {
        if (s.in_edge.id && !isFakeId(s.in_edge.id))
          this.addEdgeId(s.in_edge.id);
      }
      s.out_edges.forEach(e => {
        traverse(e);
      });
    };

    traverse(initialFormData.automationTreeData);

    const saveOrCreatePromise = () =>
      automationId
        ? this._scenarioService.updateScenario(
            automationId,
            formData.automation as AutomationResource,
          )
        : this._scenarioService.createScenario(
            organisationId,
            formData.automation as AutomationResource,
          );

    if (storageModelVersion === 'v201506') {
      return saveOrCreatePromise();
    } else {
      return saveOrCreatePromise().then(createdAutomation => {
        const savedAutomationId = createdAutomation.data.id;
        const datamartId = formData.automation.datamart_id;

        const treeData = formData.automationTreeData;

        if (datamartId) {
          return this.saveFirstNode(datamartId, savedAutomationId, treeData)
            .then(firstNodeId => {
              return this.iterate(
                organisationId,
                datamartId,
                savedAutomationId,
                treeData.out_edges,
                firstNodeId,
              );
            })
            .then(() => {
              return this.ids.reduce(
                (acc, id) => {
                  const formattedId = id.substr(2);
                  if (id.startsWith('e-')) {
                    return acc.then(() =>
                      this._scenarioService.deleteScenarioEdge(
                        createdAutomation.data.id,
                        formattedId,
                      ),
                    );
                  }
                  return acc.then(() =>
                    this._scenarioService.deleteScenarioNode(
                      createdAutomation.data.id,
                      formattedId,
                    ),
                  );
                },
                Promise.resolve() as Promise<any>,
              );
            })
            .then(() => createdAutomation);
        }
        return Promise.resolve(createdAutomation);
      });
    };
  }

  saveFirstNode = (
    datamartId: string,
    automationId: string,
    storylineNode: StorylineNodeModel,
  ) => {
    // make it more modular to add new first node
    const node = storylineNode.node as QueryInputNodeResource;
    const saveOrCreateQueryPromise = !isFakeId(node.query_id)
      ? this._queryService
          .updateQuery(datamartId, node.query_id, node.formData)
          .then(res => {
            this.removeNodeId(res.data.id);
            return res;
          })
      : this._queryService.createQuery(datamartId, node.formData);
    return saveOrCreateQueryPromise.then(queryRes => {
      return this.saveOrCreateNode(
        automationId,
        storylineNode,
        undefined,
        queryRes.data.id,
        true,
      ).then(res => {
        return res.data.id;
      });
    });
  };

  iterate = (
    organisationId: string,
    datamartId: string,
    automationId: string,
    storylineNodes: StorylineNodeModel[],
    parentNodeId: string,
  ): Promise<any> => {
    return storylineNodes.reduce((prev, storylineNode) => {
      const node = storylineNode.node;
      if (isScenarioNodeShape(node)) {
        if (isDisplayCampaignNode(node)) {
          const saveOrCreateCampaignPromise = this.saveSubDisplayCampaign(
            organisationId,
            node.formData,
            node.initialFormData,
            node.campaign_id,
          );
          return prev.then(() =>
            saveOrCreateCampaignPromise.then(campaignIds => {
              return this.saveOrCreateNode(
                automationId,
                storylineNode,
                campaignIds,
              ).then(res => {
                return this.saveOrCreateEdges(automationId, {
                  source_id: parentNodeId,
                  target_id: res.data.id,
                  edgeResource: storylineNode.in_edge,
                }).then(() => {
                  return this.iterate(
                    organisationId,
                    datamartId,
                    automationId,
                    storylineNode.out_edges,
                    res.data.id,
                  );
                });
              });
            }),
          );
        } else if (isEmailCampaignNode(node)) {
          const saveOrCreateCampaignPromise = this.saveSubEmailCampaign(
            organisationId,
            node.formData,
            node.initialFormData,
            node.campaign_id,
          );
          return prev.then(() =>
            saveOrCreateCampaignPromise.then(campaignId => {
              return this.saveOrCreateNode(automationId, storylineNode, {
                campaign_id: campaignId,
              }).then(res => {
                return this.saveOrCreateEdges(automationId, {
                  source_id: parentNodeId,
                  target_id: res.data.id,
                  edgeResource: storylineNode.in_edge,
                }).then(() => {
                  return this.iterate(
                    organisationId,
                    datamartId,
                    automationId,
                    storylineNode.out_edges,
                    res.data.id,
                  );
                });
              });
            }),
          );
        } else if (isQueryInputNode(node) || isIfNode(node)) {
          const saveOrCreateQueryPromise = node.query_id
            ? this._queryService.updateQuery(
                datamartId,
                node.query_id,
                node.formData,
              )
            : this._queryService.createQuery(datamartId, node.formData);
          return prev.then(() =>
            saveOrCreateQueryPromise.then(queryRes => {
              return this.saveOrCreateNode(
                automationId,
                storylineNode,
                undefined,
                queryRes.data.id,
              ).then(res => {
                return this.saveOrCreateEdges(automationId, {
                  source_id: parentNodeId,
                  target_id: res.data.id,
                  edgeResource: storylineNode.in_edge,
                }).then(() => {
                  return this.iterate(
                    organisationId,
                    datamartId,
                    automationId,
                    storylineNode.out_edges,
                    res.data.id,
                  );
                });
              });
            }),
          );
        } else if (isAbnNode(node) || isEndNode(node) || isWaitNode(node)) {
          return prev.then(() =>
            this.saveOrCreateNode(automationId, storylineNode).then(res => {
              return this.saveOrCreateEdges(automationId, {
                source_id: parentNodeId,
                target_id: res.data.id,
                edgeResource: storylineNode.in_edge,
              }).then(() => {
                return this.iterate(
                  organisationId,
                  datamartId,
                  automationId,
                  storylineNode.out_edges,
                  res.data.id,
                );
              });
            }),
          );
        }
      }
      return prev.then(() => Promise.resolve());
    }, Promise.resolve());
  };

  
  validateAutomationRec(
    storylineNodes: StorylineNodeModel[]
  ): Promise<void> {
    return storylineNodes.reduce((prev, storylineNode) => {
      return prev.then(() => this.validateNode(storylineNode).then(() => this.validateAutomationRec(storylineNode.out_edges)));
    }, Promise.resolve())
  }

  validateAutomation(
    storylineNode: StorylineNodeModel
  ): Promise<void> {
    return this.validateNode(storylineNode).then(() => this.validateAutomationRec(storylineNode.out_edges))
  }

  validateNode(
    storylineNode: StorylineNodeModel
  ): Promise<void> {
    const node = storylineNode.node
    if (isQueryInputNode(node) || isIfNode(node)) {
      if (! node.formData.query_language) {
        return Promise.reject(messages.emptyQuery)
      }
    }
    return Promise.resolve();
  }

  saveOrCreateNode = (
    automationId: string,
    storylineNode: StorylineNodeModel,
    campaignIds?: {
      ad_group_id?: string;
      campaign_id: string;
    },
    queryId?: string,
    isStartNode?: boolean,
  ) => {
    const node = storylineNode.node as ScenarioNodeShape;
    let saveOrCreateScenarioNode: Promise<DataResponse<ScenarioNodeShape>>;
    let scenarioNodeResource = {};
    let resourceId: string | undefined;
    if (isDisplayCampaignNode(node)) {
      scenarioNodeResource = {
        id: node.id && !isFakeId(node.id) ? node.id : undefined,
        name: node.name,
        scenario_id: automationId,
        x: node.x,
        y: node.y,
        type: node.type,
        ad_group_id: campaignIds ? campaignIds.ad_group_id : undefined,
        campaign_id: campaignIds ? campaignIds.campaign_id : undefined,
      };
      resourceId =
        node.campaign_id && !isFakeId(node.campaign_id)
          ? node.campaign_id
          : undefined;
    } else if (isEmailCampaignNode(node)) {
      scenarioNodeResource = {
        id: node.id && !isFakeId(node.id) ? node.id : undefined,
        name: node.name,
        scenario_id: automationId,
        x: node.x,
        y: node.y,
        type: node.type,
        campaign_id: campaignIds ? campaignIds.campaign_id : undefined,
      };
      resourceId =
        node.campaign_id && !isFakeId(node.campaign_id)
          ? node.campaign_id
          : undefined;
    } else if (isQueryInputNode(node)) {
      scenarioNodeResource = {
        id: node.id && !isFakeId(node.id) ? node.id : undefined,
        name: node.name,
        scenario_id: automationId,
        x: node.x,
        y: node.y,
        type: 'QUERY_INPUT',
        query_id: queryId,
        evaluation_mode: node.evaluation_mode,
        evaluation_period: node.evaluation_period,
        evaluation_period_unit: node.evaluation_period_unit,
      };
      resourceId =
        node.query_id && !isFakeId(node.query_id) ? node.query_id : undefined;
    } else if (isIfNode(node)) {
      scenarioNodeResource = {
        id: node.id && !isFakeId(node.id) ? node.id : undefined,
        name: node.name,
        scenario_id: automationId,
        x: node.x,
        y: node.y,
        query_id: queryId,
        type: 'IF_NODE',
      };
      resourceId = node.id && !isFakeId(node.id) ? node.id : undefined;
    } else if (isAbnNode(node)) {
      scenarioNodeResource = {
        id: node.id && !isFakeId(node.id) ? node.id : undefined,
        name: node.name,
        scenario_id: automationId,
        x: node.x,
        y: node.y,
        type: 'ABN_NODE',
      };
      resourceId = node.id && !isFakeId(node.id) ? node.id : undefined;
    } else if (isEndNode(node)) {
      scenarioNodeResource = {
        id: node.id && !isFakeId(node.id) ? node.id : undefined,
        name: node.name,
        scenario_id: automationId,
        x: node.x,
        y: node.y,
        type: 'END_NODE',
      };
      resourceId = node.id && !isFakeId(node.id) ? node.id : undefined;
    } else if (isWaitNode(node)) {
      scenarioNodeResource = {
        id: node.id && !isFakeId(node.id) ? node.id : undefined,
        name: node.name,
        scenario_id: automationId,
        x: node.x,
        y: node.y,
        timeout: node.formData
          ? node.formData.timeout
          : 24 * 1000 * 60 * 60 * 2, // 2 days
        type: 'WAIT_NODE',
      };
      resourceId = node.id && !isFakeId(node.id) ? node.id : undefined;
    }
    saveOrCreateScenarioNode = resourceId
      ? this._scenarioService
          .updateScenarioNode(automationId, node.id, scenarioNodeResource)
          .then(e => {
            this.removeNodeId(e.data.id);
            return e;
          })
      : this._scenarioService.createScenarioNode(automationId, {
          ...scenarioNodeResource,
          id: undefined,
        });
    return saveOrCreateScenarioNode.then(res => {
      if (isStartNode && !resourceId) {
        this._scenarioService.createScenarioBeginNode(automationId, res.data);
      }
      return res;
    });
  };

  saveOrCreateEdges = (
    automationId: string,
    customEdgeData: CustomEdgeResource,
  ): Promise<any> => {
    const resource = customEdgeData.edgeResource;
    return resource && resource.id && !isFakeId(resource.id)
      ? // update does not work therefore we are deleting the old one and creating a new one
        this._scenarioService
          .deleteScenarioEdge(automationId, resource.id)
          .then(() =>
            this._scenarioService.createScenarioEdge(automationId, {
              ..._.omit(customEdgeData.edgeResource, ['id']),
            }),
          )
          .then(() => {
            this.removeEdgeId(resource.id);
            return resource;
          })
      : this._scenarioService
          .createScenarioEdge(automationId, {
            ..._.omit(customEdgeData.edgeResource, ['id']),
            scenario_id: automationId,
            source_id: customEdgeData.source_id,
            target_id: customEdgeData.target_id,
          })
          .then(e => {
            this.removeEdgeId(e.data.id);
            return e;
          });
  };

  saveSubDisplayCampaign = (
    organisationId: string,
    formData: DisplayCampaignAutomationFormData,
    initialFormData: DisplayCampaignAutomationFormData = INITIAL_DISPLAY_CAMPAIGN_NODE_FORM_DATA,
    campaignId?: string,
  ): Promise<{ ad_group_id?: string; campaign_id: string }> => {
    formData.campaign.technical_name = undefined
    initialFormData.campaign.technical_name = undefined

    return this._displayCampaignFormService
      .saveCampaign(
        organisationId,
        formData ? formData : initialFormData,
        initialFormData,
      )
      .then(res =>
        this._displayCampaignService.getAdGroups(res).then(r => ({
          campaign_id: res,
          ad_group_id: r && r.data.length ? r.data[0].id : undefined,
        })),
      );
  };

  saveSubEmailCampaign = (
    organisationId: string,
    formData: EmailCampaignAutomationFormData,
    initialFormData: EmailCampaignAutomationFormData = INITIAL_EMAIL_CAMPAIGN_NODE_FORM_DATA,
    campaignId?: string,
  ) => {
    let createOrUpdateCampaignPromise;
    if (campaignId) {
      createOrUpdateCampaignPromise = EmailCampaignService.updateEmailCampaign(
        campaignId,
        _.omit(formData.campaign, ['technical_name']),
      );
    } else {
      createOrUpdateCampaignPromise = EmailCampaignService.createEmailCampaign(
        organisationId,
        _.omit(formData.campaign, ['technical_name']),
      );
    }

    return createOrUpdateCampaignPromise.then(savedCampaignRes => {
      const savedCampaignId = savedCampaignRes.data.id;

      const tasks: Task[] = [];

      tasks.push(
        ...getRouterTasks(
          savedCampaignId,
          formData.routerFields,
          initialFormData.routerFields,
        ),
        ...getBlastTasks(
          savedCampaignId,
          formData.blastFields,
          initialFormData.blastFields,
        ),
      );

      return executeTasksInSequence(tasks)
        .then(() =>
          EmailCampaignService.updateEmailCampaign(savedCampaignId, {
            id: savedCampaignId,
            status: 'ACTIVE',
          }),
        )
        .then(() => EmailCampaignService.getBlasts(savedCampaignId))
        .then(blastData =>
          Promise.all(
            blastData.data.map(blast =>
              EmailCampaignService.updateBlast(savedCampaignId, blast.id, {
                id: blast.id,
                status: 'SCENARIO_ACTIVATED',
              }),
            ),
          ),
        )
        .then(() => {
          return savedCampaignId;
        });
    });
  };
}

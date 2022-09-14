'use strict';

import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { compose } from 'recompose';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import AceEditor from 'react-ace';
import { Ace } from 'ace-builds';
import { Layout, Select, Checkbox, Form, Input, Button } from 'antd';
import EditDashboardActionBar from './EditDashboardActionBar';
import messages from './messages';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import { EmptyChart, Loading, McsTabs } from '@mediarithmics-private/mcs-components-library';
import {
  CustomDashboardResource,
  CustomDashboardContentResource,
  DashboardContentSchema,
  DashboardContentSchemaCID,
  DashboardContentSectionCID,
  DashboardContentCardCID,
} from '@mediarithmics-private/advanced-components/lib/models/customDashboards/customDashboards';
import { IAudienceSegmentService } from '@mediarithmics-private/advanced-components/lib/services/AudienceSegmentService';
import { IStandardSegmentBuilderService } from '@mediarithmics-private/advanced-components/lib/services/StandardSegmentBuilderService';
import { IDatamartService } from '@mediarithmics-private/advanced-components/lib/services/DatamartService';
import {
  EditableDashboardLayout,
  ICustomDashboardService,
  injectDrawer,
  InjectedWorkspaceProps,
  injectWorkspace,
  IUsersService,
  lazyInject,
  TYPES,
  withDatamartSelector,
  WithDatamartSelectorProps,
} from '@mediarithmics-private/advanced-components';
import lodash from 'lodash';
import { FormInstance, RuleObject } from 'antd/lib/form';
import { dashboardsDefinition } from '../../../routes/dashboardsRoutes';
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';
import {
  DataListResponse,
  DataResponse,
} from '@mediarithmics-private/advanced-components/lib/services/ApiService';
import UserResource from '@mediarithmics-private/advanced-components/lib/models/directory/UserResource';
import omitDeep from 'omit-deep-lodash';
import {
  ChartConfig,
  ChartCommonConfig,
} from '@mediarithmics-private/advanced-components/lib/services/ChartDatasetService';

const { Content } = Layout;

const defaultContent = `{
  "sections": [
    {
        "title": "Section",
        "cards": [
            {
                "x": 0,
                "y": 0,
                "h": 2,
                "w": 4,
                "layout": "vertical",
                "charts": [
                    {
                        "title": "Number of active user points",
                        "type": "Metric",
                        "dataset": {
                            "type": "activities_analytics",
                            "query_json": {
                                "dimensions": [],
                                "metrics": [
                                    {
                                        "expression": "users"
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        ]
    }
]}`;

interface FormInitialValues {
  input_title: string;
  checkbox_home: boolean;
  checkbox_segment: boolean;
  checkbox_builder: boolean;
  checkbox_console: boolean;
  select_segments: SelectValue[];
  select_builders: SelectValue[];
  content_editor: string;
}

interface EditDashboardPageState {
  loading: boolean;
  dashboard?: CustomDashboardResource;
  content?: CustomDashboardContentResource;
  contentTextOrig?: string;
  contentTextEditor: string;
  homeCheckboxChecked: boolean;
  segmentCheckboxChecked: boolean;
  builderCheckboxChecked: boolean;
  consoleCheckboxChecked: boolean;
  dashboardTitle: string;
  selectedSegments: SelectValue[];
  selectedBuilders: SelectValue[];
  contentText: string;
  userNamesMap: Map<string, string>;
  existingSegments: LabelValueOption[];
  existingBuilders: LabelValueOption[];
  contentErrorMessage?: string;
  validated: boolean;
  form: React.RefObject<FormInstance>;
  defaultDatamartId?: string;
  formInitialValues?: FormInitialValues;
  displaySegmentInput?: boolean;
  displayBuilderInput?: boolean;
  mapCharts: Map<string, ChartConfig>;
  lastContentEditorModificationTs: number;
}

interface RouterProps {
  organisationId: string;
  dashboardId: string;
}

interface SelectValue {
  value: string;
  label: string;
  key: string;
}

interface LabelValueOption {
  label: string;
  value: string;
}

type Props = InjectedIntlProps &
  InjectedNotificationProps &
  InjectedWorkspaceProps &
  WithDatamartSelectorProps &
  RouteComponentProps<RouterProps>;

class EditDashboardPage extends React.Component<Props, EditDashboardPageState> {
  @lazyInject(TYPES.ICustomDashboardService)
  private _dashboardService: ICustomDashboardService;

  @lazyInject(TYPES.IAudienceSegmentService)
  private _audienceSegmentService: IAudienceSegmentService;

  @lazyInject(TYPES.IStandardSegmentBuilderService)
  private _standardSegmentBuilderService: IStandardSegmentBuilderService;

  @lazyInject(TYPES.IDatamartService)
  private _datamartService: IDatamartService;

  @lazyInject(TYPES.IUsersService)
  private _usersService: IUsersService;

  constructor(props: Props) {
    super(props);
    this.state = {
      homeCheckboxChecked: false,
      segmentCheckboxChecked: false,
      builderCheckboxChecked: false,
      consoleCheckboxChecked: false,
      dashboardTitle: props.intl.formatMessage(messages.dashboardDefaultTitle),
      selectedSegments: [],
      selectedBuilders: [],
      contentText: defaultContent,
      contentTextEditor: defaultContent,
      userNamesMap: new Map(),
      loading: true,
      existingSegments: [],
      existingBuilders: [],
      validated: false,
      form: React.createRef<FormInstance>(),
      mapCharts: new Map(),
      lastContentEditorModificationTs: 0,
    };
  }

  componentDidMount() {
    const {
      notifyError,
      match: {
        params: { organisationId, dashboardId },
      },
    } = this.props;
    this.fetchData(organisationId, dashboardId).catch(e => {
      this.setState({
        loading: false,
      });
      notifyError(e);
    });
  }

  componentDidUpdate(previousProps: Props) {
    const {
      match: {
        params: { organisationId },
      },
    } = this.props;

    if (organisationId !== previousProps.match.params.organisationId) {
      this.openMainListPage();
    }
  }

  moveExternallyLoadedPropertiesFromDashboardContent = (
    content: DashboardContentSchema,
    action: 'remove' | 'restore',
    mapCharts?: Map<string, ChartConfig>,
  ): DashboardContentSchemaCID => {
    const result: DashboardContentSchemaCID = {
      ...content,
      sections: content.sections.map(section => {
        const modifiedSection: DashboardContentSectionCID = {
          ...section,
          cards: section.cards.map(card => {
            const modifiedCard: DashboardContentCardCID = {
              ...card,
              charts: card.charts.map(chart => {
                if (action === 'remove')
                  return this.removeExternallyLoadedPropertiesFromChartConfig(chart);
                else return this.restoreExternallyLoadedPropertiesToChartConfig(chart, mapCharts);
              }),
            };
            return modifiedCard;
          }),
        };
        return modifiedSection;
      }),
    };

    return result;
  };

  removeExternallyLoadedPropertiesFromChartConfig = (
    chartConfig: ChartConfig,
  ): ChartCommonConfig => {
    if (chartConfig.chart_id !== undefined) {
      const { mapCharts } = this.state;
      const chartConfigCopy: ChartConfig = JSON.parse(JSON.stringify(chartConfig));
      chartConfigCopy.id = undefined;
      this.setState({
        mapCharts: mapCharts.set(chartConfig.chart_id, chartConfigCopy),
      });

      const modifiedChartConfig: ChartCommonConfig = {
        chart_id: chartConfig.chart_id,
      };

      return modifiedChartConfig;
    } else {
      return chartConfig;
    }
  };

  restoreExternallyLoadedPropertiesToChartConfig = (
    chartConfig: ChartCommonConfig,
    mapCharts?: Map<string, ChartConfig>,
  ): ChartCommonConfig => {
    if (chartConfig.chart_id !== undefined) {
      const storedChart = !!mapCharts ? mapCharts.get(chartConfig.chart_id) : undefined;
      if (!!storedChart) return storedChart;
      else return chartConfig;
    } else {
      return chartConfig;
    }
  };

  refreshExternalChartsMap = (
    dashboardContent: DashboardContentSchema,
  ): Promise<Map<string, ChartConfig>> => {
    const { mapCharts } = this.state;
    const {
      match: {
        params: { organisationId },
      },
    } = this.props;

    const allChartsIds: string[] = this._dashboardService.getAllChartsIds(dashboardContent);
    const newChartsIds: string[] = allChartsIds.filter(chartId => !mapCharts.has(chartId));

    if (newChartsIds.length > 0) {
      return this._dashboardService
        .loadChartsByIds(newChartsIds, organisationId)
        .then(newMapCharts => {
          newMapCharts.forEach((value, key) => {
            const currentChartConfig: ChartConfig = {
              ...value,
              chart_id: key,
            };
            mapCharts.set(key, currentChartConfig);
          });

          return mapCharts;
        });
    } else return Promise.resolve(mapCharts);
  };

  formatContent = (
    content?: DashboardContentSchema | DashboardContentSchemaCID,
    removeIds?: boolean,
  ) => {
    let purifiedContent;
    if (removeIds === undefined || removeIds)
      purifiedContent = content ? omitDeep(content, 'id') : undefined;
    else purifiedContent = content;

    return content ? JSON.stringify(purifiedContent, null, 4) : '';
  };

  fetchData = async (organisationId: string, dashboardId: string) => {
    const { userNamesMap } = this.state;

    if (dashboardId) {
      const dashboard = await this.fetchDashboard(organisationId, dashboardId);
      const lastModifiedBy = await this.fetchUser(dashboard.last_modified_by);
      const content: CustomDashboardContentResource | undefined = await this.fetchContent(
        organisationId,
        dashboardId,
      ).catch(() => {
        return undefined;
      });
      const createdBy = content ? await this.fetchUser(content.created_by) : undefined;
      if (lastModifiedBy) {
        userNamesMap.set(
          lastModifiedBy.id,
          `${lastModifiedBy.first_name} ${lastModifiedBy.last_name}`,
        );
      }
      if (createdBy) {
        userNamesMap.set(createdBy.id, `${createdBy.first_name} ${createdBy.last_name}`);
      }
      const segments = await this.fetchSegments(organisationId);
      const builders = await this.fetchBuilders(organisationId);
      const contentText = content ? this.formatContent(content.content, false) : '';
      const selectedSegments = this.convertIdsToSelectValues(dashboard.segment_ids);
      const selectedBuilders = this.convertIdsToSelectValues(dashboard.builder_ids);
      const enrichedSegmentsValues = this.enrichSelectedValuesByOptions(selectedSegments, segments);
      const enrichedBuildersValues = this.enrichSelectedValuesByOptions(selectedBuilders, builders);

      const initialValues: FormInitialValues = {
        input_title: dashboard.title,
        checkbox_home: dashboard.scopes.includes('home'),
        checkbox_segment: dashboard.scopes.includes('segments'),
        checkbox_builder: dashboard.scopes.includes('builders'),
        checkbox_console: dashboard.scopes.includes('console'),
        select_segments: selectedSegments,
        select_builders: selectedBuilders,
        content_editor: contentText,
      };

      this.setState({
        dashboard: dashboard,
        dashboardTitle: dashboard.title,
        homeCheckboxChecked: dashboard.scopes.includes('home'),
        segmentCheckboxChecked: dashboard.scopes.includes('segments'),
        builderCheckboxChecked: dashboard.scopes.includes('builders'),
        consoleCheckboxChecked: dashboard.scopes.includes('console'),
        selectedSegments: enrichedSegmentsValues,
        selectedBuilders: enrichedBuildersValues,
        contentTextOrig: contentText,
        contentText: contentText.length > 0 ? contentText : defaultContent,
        contentTextEditor: contentText.length > 0 ? contentText : defaultContent,
        content: content,
        loading: false,
        existingBuilders: builders,
        existingSegments: segments,
        userNamesMap: userNamesMap,
        formInitialValues: initialValues,
        displaySegmentInput: selectedSegments.length > 0,
        displayBuilderInput: selectedBuilders.length > 0,
      });
    } else {
      this.setState({
        contentText: defaultContent,
        contentTextEditor: defaultContent,
        loading: false,
        formInitialValues: {
          input_title: 'Untitled dashboard',
          checkbox_home: false,
          checkbox_segment: false,
          checkbox_builder: false,
          checkbox_console: false,
          select_segments: [],
          select_builders: [],
          content_editor: defaultContent,
        },
      });
    }
  };

  fetchUser = async (userId?: string): Promise<UserResource | undefined> => {
    const { notifyError } = this.props;
    const { userNamesMap } = this.state;

    if (userId && !userNamesMap.has(userId)) {
      const userResponse: DataListResponse<UserResource> = await this._usersService
        .getUsersByKeyword(userId)
        .catch(e => {
          notifyError(e);
          return {
            data: [],
            count: 0,
            status: 'error',
          };
        });
      const user = userResponse.data.find(userResource => userResource.id === userId);

      return user;
    }
    return undefined;
  };

  fetchBuilders = (organisationId: string): Promise<LabelValueOption[]> => {
    return this._datamartService.getDatamarts(organisationId).then(datamartsResponse => {
      return Promise.all(
        datamartsResponse.data.map(datamart =>
          this._standardSegmentBuilderService.getStandardSegmentBuilders(datamart.id),
        ),
      ).then(responses => {
        const result = lodash
          .flatMap(responses, response => response.data)
          .map(builder => {
            const labelValueOption: LabelValueOption = {
              label: `${builder.id} - ${builder.name}`,
              value: builder.id,
            };

            return labelValueOption;
          });
        return result;
      });
    });
  };

  fetchSegments = async (organisationId: string): Promise<LabelValueOption[]> => {
    const segmentsResponse = await this._audienceSegmentService.getSegments(organisationId, {
      max_results: 1000000,
    });
    const result = segmentsResponse.data.map(segment => {
      const labelValueOption: LabelValueOption = {
        label: `${segment.id} - ${segment.name}`,
        value: segment.id,
      };

      return labelValueOption;
    });
    return result;
  };

  fetchContent = (
    organisationId: string,
    dashboardId: string,
  ): Promise<CustomDashboardContentResource> => {
    return this._dashboardService.getContent(dashboardId, organisationId).then(contentResponse => {
      return contentResponse.data;
    });
  };

  fetchDashboard = (
    organisationId: string,
    dashboardId: string,
  ): Promise<CustomDashboardResource> => {
    return this._dashboardService
      .getDashboard(dashboardId, organisationId)
      .then(dashboardResponse => {
        if (dashboardResponse) {
          return dashboardResponse.data;
        } else return Promise.reject();
      });
  };

  enrichSelectedValuesByOptions(values: SelectValue[], options: LabelValueOption[]) {
    if (values.length > 0 && options.length > 0) {
      return values.map(value => {
        const foundOption = options.find(option => option.value === value.value);
        const selectValue: SelectValue = {
          ...value,
          label: foundOption ? foundOption.label : value.label,
        };

        return selectValue;
      });
    }
    return values;
  }

  convertIdsToSelectValues = (values: string[]): SelectValue[] => {
    return values.map(segId => {
      const selectValue: SelectValue = {
        value: segId,
        label: segId,
        key: segId,
      };

      return selectValue;
    });
  };

  openMainListPage = () => {
    const {
      history,
      match: {
        params: { organisationId },
      },
    } = this.props;
    history.push(`/o/${organisationId}${dashboardsDefinition.dashboards.path}`);
  };

  notifySuccessAndRefresh = (
    dashboard: CustomDashboardResource,
    content?: CustomDashboardContentResource,
  ) => {
    const { notifySuccess, intl } = this.props;

    notifySuccess({
      message: intl.formatMessage(messages.successfullySaved),
      description: '',
    });

    this.setState({
      dashboard: dashboard,
      content: content,
      contentTextOrig: this.formatContent(content?.content),
      contentText: this.formatContent(content?.content),
      contentTextEditor: this.formatContent(content?.content),
    });
  };

  createNewDashboard = (organisationId: string, communityId: string) => {
    const { contentText } = this.state;

    this._dashboardService
      .createDashboard(
        organisationId,
        this.applyChangesOnDashboard(organisationId, communityId, {}),
      )
      .then(responseDashboard => {
        if (contentText.length > 0)
          return this._dashboardService
            .createContent(
              responseDashboard.data.id,
              omitDeep(JSON.parse(contentText), 'id') as DashboardContentSchema,
            )
            .then(responseContent => {
              this.notifySuccessAndRefresh(responseDashboard.data, responseContent.data);
            })
            .catch(e => {
              this.props.notifyError(e);
              this.setState({
                contentErrorMessage: this.formatContentCreationErrorMessage(e),
                dashboard: responseDashboard.data,
              });
            });
        else {
          this.notifySuccessAndRefresh(responseDashboard.data);
          return null;
        }
      })
      .catch(e => this.props.notifyError(e));
  };

  parseSchema = (content: string): Promise<DashboardContentSchema> => {
    try {
      const result = omitDeep(JSON.parse(content), 'id') as DashboardContentSchema;
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  modifyExistingDashboard = (dashboardId: string, organisationId: string, communityId: string) => {
    const { dashboard, contentTextOrig, contentText, content } = this.state;

    const promises: Array<
      Promise<DataResponse<CustomDashboardResource | CustomDashboardContentResource>>
    > = [];

    let storedDashboard: CustomDashboardResource | undefined;
    let storedContent: CustomDashboardContentResource | undefined;

    promises.push(
      this._dashboardService
        .updateDashboard(
          dashboardId,
          organisationId,
          this.applyChangesOnDashboard(organisationId, communityId, {
            ...dashboard,
          }),
        )
        .then(response => {
          storedDashboard = response.data;

          return response;
        }),
    );

    if (
      (!contentTextOrig && contentText.length > 0) ||
      (contentTextOrig && contentText !== contentTextOrig)
    )
      promises.push(
        this.parseSchema(contentText)
          .then(newSchema => {
            return this._dashboardService.createContent(dashboardId, newSchema);
          })
          .then(response => {
            storedContent = response.data;
            return response;
          })
          .catch(e => {
            this.setState({
              contentErrorMessage: this.formatContentCreationErrorMessage(e),
            });
            return Promise.reject(e);
          }),
      );
    else if (content) storedContent = content;

    Promise.all(promises)
      .then(_ => {
        if (storedDashboard) this.notifySuccessAndRefresh(storedDashboard, storedContent);
      })
      .catch(e => this.props.notifyError(e));
  };

  formatContentCreationErrorMessage = (e: any): string => {
    const errMsg: string = e.error ? e.error : '';

    return errMsg.substring(0, errMsg.indexOf(':') !== -1 ? errMsg.indexOf(':') : errMsg.length);
  };

  getSelectedScopes = () => {
    const {
      homeCheckboxChecked,
      segmentCheckboxChecked,
      builderCheckboxChecked,
      consoleCheckboxChecked,
    } = this.state;

    const scopes: string[] = [];
    if (homeCheckboxChecked) scopes.push('home');
    if (segmentCheckboxChecked) scopes.push('segments');
    if (builderCheckboxChecked) scopes.push('builders');
    if (consoleCheckboxChecked) scopes.push('console');

    return scopes;
  };

  applyChangesOnDashboard = (
    organisationId: string,
    communityId: string,
    dashboard: Partial<CustomDashboardResource>,
  ) => {
    const { dashboardTitle, selectedSegments, selectedBuilders } = this.state;

    const result: Partial<CustomDashboardResource> = {
      ...dashboard,
      title: dashboardTitle,
      scopes: this.getSelectedScopes(),
      segment_ids: selectedSegments.map(val => val.key),
      builder_ids: selectedBuilders.map(val => val.key),
      archived: false,
      organisation_id: organisationId,
      community_id: communityId,
      last_modified_by: undefined,
      last_modified_ts: undefined,
    };

    return result;
  };

  parseDashboardContentSchema = (e: string): DashboardContentSchema | undefined => {
    try {
      const parsedContent: DashboardContentSchema = JSON.parse(e);
      return parsedContent;
    } catch (e) {
      return undefined;
    }
  };

  onContentTextChange = (e: string) => {
    this.setState({
      contentTextEditor: e,
      lastContentEditorModificationTs: Date.now(),
    });

    setTimeout(() => {
      const { lastContentEditorModificationTs } = this.state;
      if (Date.now() - lastContentEditorModificationTs >= 1000) {
        const parsedContent = this.parseDashboardContentSchema(e);
        if (!!parsedContent)
          this.refreshExternalChartsMap(parsedContent).then(newMapCharts => {
            const formattedContentTextWithChartIds = this.formatContent(
              this.moveExternallyLoadedPropertiesFromDashboardContent(
                parsedContent,
                'restore',
                newMapCharts,
              ),
              false,
            );

            this.setState({
              contentText: formattedContentTextWithChartIds,
              mapCharts: newMapCharts,
            });
          });
      }
    }, 1000);
  };

  onSave = () => {
    if (this.validate()) {
      const {
        match: {
          params: { organisationId },
        },
        workspace: { community_id },
      } = this.props;

      const { dashboard } = this.state;

      if (organisationId) {
        if (dashboard) this.modifyExistingDashboard(dashboard.id, organisationId, community_id);
        else this.createNewDashboard(organisationId, community_id);
      }
    }
  };

  onCancel = () => {
    this.openMainListPage();
  };

  onHomeCheckboxChange = (e: CheckboxChangeEvent) => {
    this.setState({
      homeCheckboxChecked: e.target.checked,
    });
  };

  onSegmentsCheckboxChange = (e: CheckboxChangeEvent) => {
    const { displaySegmentInput } = this.state;
    this.setState({
      segmentCheckboxChecked: e.target.checked,
      displaySegmentInput: displaySegmentInput && e.target.checked,
    });
  };

  onSegmentBuildersCheckboxChange = (e: CheckboxChangeEvent) => {
    const { displaySegmentInput } = this.state;
    this.setState({
      builderCheckboxChecked: e.target.checked,
      displayBuilderInput: displaySegmentInput && e.target.checked,
    });
  };

  onConsoleCheckboxChange = (e: CheckboxChangeEvent) => {
    this.setState({
      consoleCheckboxChecked: e.target.checked,
    });
  };

  onDashboardTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      dashboardTitle: e.target.value,
    });
  };

  onSelectSegmentChange = (v: SelectValue[]) => {
    this.setState({
      selectedSegments: v,
    });
  };

  onSelectBuilderChange = (v: SelectValue[]) => {
    this.setState({
      selectedBuilders: v,
    });
  };

  formatEditedBy = (
    modifiedBy: string,
    modifiedTs: Date,
    userNamesMap: Map<string, string>,
    type: string,
  ) => {
    const date = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(modifiedTs);
    return `${type} last modified by ${
      userNamesMap.has(modifiedBy) ? userNamesMap.get(modifiedBy) : modifiedBy
    } on ${date}`;
  };

  validateSegments = (_: RuleObject, value: SelectValue[]): Promise<void> => {
    const { existingSegments } = this.state;

    return this.validateSelectField(value, existingSegments);
  };

  validateBuilders = (_: RuleObject, value: SelectValue[]): Promise<void> => {
    const { existingBuilders } = this.state;

    return this.validateSelectField(value, existingBuilders);
  };

  validateSelectField = (
    selectedValues: SelectValue[],
    options: LabelValueOption[],
  ): Promise<void> => {
    const { intl } = this.props;

    const badValues: string[] = [];

    selectedValues.forEach(selectedValue => {
      if (!options.find(option => option.value === selectedValue.value))
        badValues.push(selectedValue.label);
    });

    if (badValues.length > 0) {
      const badValuesStr = badValues.reduce((previousValue, currentValue, currentIndex) => {
        if (currentIndex === 0) return `${currentValue}`;
        else return `${previousValue}, ${currentValue}`;
      });
      return Promise.reject(
        `${intl.formatMessage(messages.incorrectValuesInList)} ${badValuesStr}`,
      );
    } else return Promise.resolve();
  };

  onContentValidateInAceEditor = (annotations: Ace.Annotation[]) => {
    const { contentErrorMessage } = this.state;
    const message =
      annotations.length > 0
        ? annotations
            .map(
              annotation =>
                `${annotation.type} (${annotation.row}:${annotation.column}): ${annotation.text}`,
            )
            .reduce((previousValue, currentValue, currentIndex) => {
              if (currentIndex === 0) return `${currentValue}`;
              else return `${previousValue}\n${currentValue}`;
            })
        : undefined;
    if (message !== contentErrorMessage) {
      this.setState({
        contentErrorMessage: message,
      });
    }
  };

  validate = (): boolean => {
    const { form, contentErrorMessage } = this.state;
    let result = true;

    const formErrors: string[] =
      form && form.current
        ? lodash.flatMap(form.current.getFieldsError(), field => field.errors)
        : [];
    if (formErrors.length > 0 || contentErrorMessage) result = false;

    return result;
  };

  shouldComponentUpdate(nextProps: Props, nextState: EditDashboardPageState): boolean {
    // Here we compare the state fields used in the render function
    // and we authorize rendering only if one of them is changed.
    // Like this we want to reduce the number of renderings
    // as each rendering provoke charts to visually reload and to send API calls.

    const {
      contentErrorMessage,
      contentText,
      segmentCheckboxChecked,
      builderCheckboxChecked,
      displaySegmentInput,
      displayBuilderInput,
      dashboard,
      loading,
      existingSegments,
      existingBuilders,
      form,
      userNamesMap,
      content,
      formInitialValues,
    } = this.state;

    return (
      this.props !== nextProps ||
      contentErrorMessage !== nextState.contentErrorMessage ||
      contentText !== nextState.contentText ||
      segmentCheckboxChecked !== nextState.segmentCheckboxChecked ||
      builderCheckboxChecked !== nextState.builderCheckboxChecked ||
      displaySegmentInput !== nextState.displaySegmentInput ||
      displayBuilderInput !== nextState.displayBuilderInput ||
      dashboard !== nextState.dashboard ||
      loading !== nextState.loading ||
      existingSegments !== nextState.existingSegments ||
      existingBuilders !== nextState.existingBuilders ||
      form !== nextState.form ||
      userNamesMap !== nextState.userNamesMap ||
      content !== nextState.content ||
      formInitialValues !== nextState.formInitialValues
    );
  }

  onTabChange = () => {
    const { contentTextEditor, lastContentEditorModificationTs } = this.state;
    if (Date.now() - lastContentEditorModificationTs < 1000)
      this.onContentTextChange(contentTextEditor);
  };

  renderEditorTab() {
    const { contentErrorMessage, contentTextEditor } = this.state;

    const contentErrorStatus = contentErrorMessage ? 'error' : 'success';
    return (
      <Form.Item
        className='mcs-dashboardEditor_aceEditor'
        validateStatus={contentErrorStatus}
        help={contentErrorMessage}
      >
        <AceEditor
          onChange={this.onContentTextChange}
          mode='json'
          theme='github'
          fontSize={12}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={false}
          width='100%'
          value={contentTextEditor}
          minLines={20}
          maxLines={1000}
          height='auto'
          setOptions={{
            highlightGutterLine: false,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
          }}
          onValidate={this.onContentValidateInAceEditor}
        />
      </Form.Item>
    );
  }

  updateSchema = (newState: DashboardContentSchema) => {
    this.setState({
      contentText: this.formatContent(newState, false),
      contentTextEditor: this.formatContent(
        this.moveExternallyLoadedPropertiesFromDashboardContent(newState, 'remove'),
      ),
    });
  };

  renderChartEdition() {
    const { selectedDatamartId, intl } = this.props;
    const { contentText } = this.state;
    const {
      match: {
        params: { organisationId },
      },
    } = this.props;
    let content;
    try {
      content = JSON.parse(contentText);
    } catch (e) {
      return <EmptyChart title={intl.formatMessage(messages.couldNotBeLoaded)} />;
    }

    return (
      <EditableDashboardLayout
        schema={content}
        datamart_id={selectedDatamartId}
        organisationId={organisationId}
        updateSchema={this.updateSchema}
        queryExecutionSource={'DASHBOARD'}
        queryExecutionSubSource={'HOME_DASHBOARD'}
      />
    );
  }

  displaySegmentSelector = () => {
    this.setState({
      displaySegmentInput: true,
      segmentCheckboxChecked: true,
    });
  };

  displayBuilderSelector = () => {
    this.setState({
      displayBuilderInput: true,
      builderCheckboxChecked: true,
    });
  };

  render() {
    const { intl } = this.props;
    const {
      displaySegmentInput,
      displayBuilderInput,
      builderCheckboxChecked,
      dashboard,
      loading,
      existingSegments,
      existingBuilders,
      form,
      userNamesMap,
      content,
      formInitialValues,
      segmentCheckboxChecked,
    } = this.state;

    const editedBy =
      dashboard && dashboard.last_modified_by && dashboard.last_modified_ts
        ? this.formatEditedBy(
            dashboard.last_modified_by,
            dashboard.last_modified_ts,
            userNamesMap,
            'Dashboard registration',
          )
        : null;

    const editedByForContent = content
      ? this.formatEditedBy(
          content.created_by,
          content.created_ts,
          userNamesMap,
          'Dashboard content',
        )
      : null;

    const wysiwigTab = {
      title: 'Edit dashboard',
      display: this.renderChartEdition(),
    };

    const editorTab = {
      title: 'Advanced',
      display: this.renderEditorTab(),
    };

    return loading ? (
      <Loading isFullScreen={true} />
    ) : (
      <div className='ant-layout'>
        <div className='ant-layout'>
          <Content className='mcs-content-container mcs-dashboardEditor'>
            <Form ref={form} initialValues={formInitialValues}>
              <div className='mcs-dashboardEditor_header'>
                <Form.Item
                  name='input_title'
                  className='mcs-dashboardEditor_column_input mcs-dashboardEditor_title'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the title',
                    },
                  ]}
                >
                  <Input onChange={this.onDashboardTitleChange} />
                </Form.Item>
                <EditDashboardActionBar handleSave={this.onSave} handleCancel={this.onCancel} />
              </div>
              <div className='mcs-dashboardEditor_row_column mcs-dashboardEditor_row_editedBy'>
                {editedBy && <span>{editedBy}</span>}
                <br />
                {editedByForContent && <span>{editedByForContent}</span>}
              </div>
              <div className='mcs-editDashboard_scopesDescription'>
                {intl.formatMessage(messages.displayOn)}
              </div>
              <Form.Item
                name='checkbox_home'
                valuePropName='checked'
                className='mcs-dashboardEditor_homeCheckbox'
              >
                <Checkbox onChange={this.onHomeCheckboxChange}>
                  {intl.formatMessage(messages.home)}
                </Checkbox>
              </Form.Item>

              <Form.Item
                name='checkbox_segment'
                valuePropName='checked'
                className='mcs-dashboardEditor_checkbox'
              >
                <Checkbox onChange={this.onSegmentsCheckboxChange} checked={segmentCheckboxChecked}>
                  {intl.formatMessage(messages.segments)}{' '}
                </Checkbox>
                {!displaySegmentInput && (
                  <Button onClick={this.displaySegmentSelector} type='dashed'>
                    Only display on specific segments...
                  </Button>
                )}
              </Form.Item>
              {displaySegmentInput && (
                <Form.Item
                  name='select_segments'
                  className='mcs-dashboardEditor_selector'
                  rules={[
                    {
                      validator: this.validateSegments,
                    },
                  ]}
                >
                  <Select
                    placeholder={intl.formatMessage(messages.segmentIds)}
                    mode='tags'
                    tokenSeparators={[',', '	']}
                    showSearch={true}
                    labelInValue={true}
                    autoFocus={true}
                    onChange={this.onSelectSegmentChange}
                    optionFilterProp='label'
                    options={existingSegments}
                  />
                </Form.Item>
              )}
              <Form.Item
                name='checkbox_builder'
                valuePropName='checked'
                className='mcs-dashboardEditor_checkbox'
              >
                <Checkbox
                  onChange={this.onSegmentBuildersCheckboxChange}
                  checked={builderCheckboxChecked}
                >
                  {intl.formatMessage(messages.builders)}
                </Checkbox>
                {!displayBuilderInput && (
                  <Button onClick={this.displayBuilderSelector} type='dashed'>
                    Only display on specific builders...
                  </Button>
                )}
              </Form.Item>
              {displayBuilderInput && (
                <Form.Item
                  name='select_builders'
                  className='mcs-dashboardEditor_selector'
                  rules={[
                    {
                      validator: this.validateBuilders,
                    },
                  ]}
                >
                  <Select
                    placeholder={intl.formatMessage(messages.builderIds)}
                    mode='tags'
                    tokenSeparators={[',', '	']}
                    showSearch={true}
                    labelInValue={true}
                    autoFocus={true}
                    onChange={this.onSelectBuilderChange}
                    options={existingBuilders}
                  />
                </Form.Item>
              )}

              <Form.Item
                name='checkbox_console'
                valuePropName='checked'
                className='mcs-dashboardEditor_checkbox'
              >
                <Checkbox onChange={this.onConsoleCheckboxChange}>
                  {intl.formatMessage(messages.console)}
                </Checkbox>
              </Form.Item>
              <McsTabs
                items={[wysiwigTab, editorTab]}
                isCard={true}
                animated={false}
                className='mcs-editDashboard_tabs'
                destroyInactiveTabPane={true}
                onChange={this.onTabChange}
              />
            </Form>
          </Content>
        </div>
      </div>
    );
  }
}

export default compose<Props, {}>(
  withRouter,
  injectIntl,
  injectNotifications,
  withDatamartSelector,
  injectWorkspace,
  injectDrawer,
)(EditDashboardPage);

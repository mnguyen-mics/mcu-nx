import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { compose } from 'recompose';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import AceEditor from 'react-ace';
import { Ace } from 'ace-builds';
import { Layout, Select, Checkbox, Form, Input, Row } from 'antd';
import EditDashboardActionBar from './EditDashboardActionBar';
import messages from './messages';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import { Loading } from '@mediarithmics-private/mcs-components-library';
import {
  CustomDashboardResource,
  CustomDashboardContentResource,
} from '@mediarithmics-private/advanced-components/lib/models/customDashboards/customDashboards';
import { IAudienceSegmentService } from '@mediarithmics-private/advanced-components/lib/services/AudienceSegmentService';
import { IStandardSegmentBuilderService } from '@mediarithmics-private/advanced-components/lib/services/StandardSegmentBuilderService';
import { IDatamartService } from '@mediarithmics-private/advanced-components/lib/services/DatamartService';
import {
  ICustomDashboardService,
  lazyInject,
  TYPES,
} from '@mediarithmics-private/advanced-components';
import lodash from 'lodash';
import { FormInstance, RuleObject } from 'antd/lib/form';
import { dashboardsDefinition } from '../../../routes/dashboardsRoutes';
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';
import { DataResponse } from '@mediarithmics-private/advanced-components/lib/services/ApiService';

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

interface EditDashboardPageState {
  loading: boolean;
  dashboard?: CustomDashboardResource;
  contentTextOrig?: string;
  homeCheckboxChecked: boolean;
  segmentCheckboxChecked: boolean;
  builderCheckboxChecked: boolean;
  dashboardTitle: string;
  selectedSegments: SelectValue[];
  selectedBuilders: SelectValue[];
  contentText: string;
  existingSegments: LabelValueOption[];
  existingBuilders: LabelValueOption[];
  contentErrorMessage?: string;
  validated: boolean;
  form: React.RefObject<FormInstance>;
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

export interface EditDashboardPageProps {
  data?: CustomDashboardResource;
  organisationId: string;
}

type Props = EditDashboardPageProps &
  InjectedIntlProps &
  InjectedNotificationProps &
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

  constructor(props: Props) {
    super(props);
    this.state = {
      homeCheckboxChecked: false,
      segmentCheckboxChecked: false,
      builderCheckboxChecked: false,
      dashboardTitle: '',
      selectedSegments: [],
      selectedBuilders: [],
      contentText: '',
      loading: true,
      existingSegments: [],
      existingBuilders: [],
      validated: false,
      form: React.createRef<FormInstance>(),
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { organisationId, dashboardId },
      },
    } = this.props;

    this.fetchData(organisationId, dashboardId);
  }

  fetchData = (organisationId: string, dashboardId: string) => {
    const { notifyError } = this.props;
    const fetchPromises: Array<
      Promise<CustomDashboardResource | CustomDashboardContentResource | LabelValueOption[]>
    > = [];

    if (dashboardId) {
      fetchPromises.push(
        this.fetchDashboard(organisationId, dashboardId).then(dashboard => {
          this.fillDashboardElements(dashboard);
          if (dashboard.dashboard_content_id)
            return this.fetchContent(organisationId, dashboardId).then(content => {
              this.fillContentElements(content);
              return content;
            });
          else return dashboard;
        }),
      );
    } else this.setState({ contentText: defaultContent, loading: false });

    fetchPromises.push(
      this.fetchSegments(organisationId, segments => {
        this.setState({
          existingSegments: segments,
        });
        this.enrichSegmentSelectedValues();
      }),
    );

    fetchPromises.push(
      this.fetchBuilders(organisationId, builders => {
        this.setState({
          existingBuilders: builders,
        });
        this.enrichBuilderSelectedValues();
      }),
    );

    Promise.all(fetchPromises)
      .then(_ => {
        this.setState({
          loading: false,
        });
      })
      .catch(e => {
        this.setState({
          loading: false,
        });
        notifyError(e);
      });
  };

  fetchBuilders = (
    organisationId: string,
    processResult: (builders: LabelValueOption[]) => void,
  ): Promise<LabelValueOption[]> => {
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

        processResult(result);

        return result;
      });
    });
  };

  fetchSegments = (
    organisationId: string,
    processResult: (builders: LabelValueOption[]) => void,
  ): Promise<LabelValueOption[]> => {
    return this._audienceSegmentService.getSegments(organisationId).then(segmentsResponse => {
      const result = segmentsResponse.data.map(segment => {
        const labelValueOption: LabelValueOption = {
          label: `${segment.id} - ${segment.name}`,
          value: segment.id,
        };

        return labelValueOption;
      });

      processResult(result);

      return result;
    });
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

  fillDashboardElements = (dashboard: CustomDashboardResource) => {
    this.setState({
      dashboard: dashboard,
      dashboardTitle: dashboard.title,
      homeCheckboxChecked: dashboard.scopes.includes('home'),
      segmentCheckboxChecked: dashboard.scopes.includes('segments'),
      builderCheckboxChecked: dashboard.scopes.includes('builders'),
      selectedSegments: this.convertIdsToSelectValues(dashboard.segment_ids),
      selectedBuilders: this.convertIdsToSelectValues(dashboard.builder_ids),
    });
    this.enrichSegmentSelectedValues();
    this.enrichBuilderSelectedValues();
  };

  fillContentElements = (content: CustomDashboardContentResource) => {
    const contentText = JSON.stringify(content.content, null, 4);

    this.setState({
      contentTextOrig: contentText,
      contentText: contentText,
    });
  };

  enrichSegmentSelectedValues = () => {
    const { selectedSegments, existingSegments } = this.state;

    this.enrichSelectedValuesByOptions(selectedSegments, existingSegments, enrichedValues => {
      this.setState({
        selectedSegments: enrichedValues,
      });
    });
  };

  enrichBuilderSelectedValues = () => {
    const { selectedBuilders, existingBuilders } = this.state;

    this.enrichSelectedValuesByOptions(selectedBuilders, existingBuilders, enrichedValues => {
      this.setState({
        selectedBuilders: enrichedValues,
      });
    });
  };

  enrichSelectedValuesByOptions = (
    values: SelectValue[],
    options: LabelValueOption[],
    processResult: (enrichedValues: SelectValue[]) => void,
  ) => {
    if (values.length > 0 && options.length > 0) {
      processResult(
        values.map(value => {
          const findedOption = options.find(option => option.value === value.value);
          const selectValue: SelectValue = {
            ...value,
            label: findedOption ? findedOption.label : value.label,
          };

          return selectValue;
        }),
      );
    }
  };

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

  createNewDashboard = (organisationId: string) => {
    const { contentText } = this.state;

    this._dashboardService
      .createDashboard(organisationId, this.applyChangesOnDashboard(organisationId, {}))
      .then(responseDashboard => {
        if (contentText.length > 0)
          this._dashboardService
            .createContent(responseDashboard.data.id, JSON.parse(contentText))
            .then(_ => this.openMainListPage())
            .catch(e => {
              this.props.notifyError(e);
              this.setState({
                contentErrorMessage: this.formatContentCreationErrorMessage(e),
                dashboard: responseDashboard.data,
              });
            });
        else this.openMainListPage();
      })
      .catch(e => this.props.notifyError(e));
  };

  modifyExistingDashboard = (dashboardId: string, organisationId: string) => {
    const { dashboard, contentTextOrig, contentText } = this.state;

    const promises: Array<
      Promise<DataResponse<CustomDashboardResource | CustomDashboardContentResource>>
    > = [];

    promises.push(
      this._dashboardService.updateDashboard(
        dashboardId,
        organisationId,
        this.applyChangesOnDashboard(organisationId, {
          ...dashboard,
        }),
      ),
    );

    if (
      (!contentTextOrig && contentText.length > 0) ||
      (contentTextOrig && contentText !== contentTextOrig)
    )
      promises.push(
        this._dashboardService.createContent(dashboardId, JSON.parse(contentText)).catch(e => {
          this.setState({
            contentErrorMessage: this.formatContentCreationErrorMessage(e),
          });
          return Promise.reject(e);
        }),
      );

    Promise.all(promises)
      .then(_ => this.openMainListPage())
      .catch(e => this.props.notifyError(e));
  };

  formatContentCreationErrorMessage = (e: any): string => {
    const errMsg: string = e.error ? e.error : '';

    return errMsg.substring(0, errMsg.indexOf(':') !== -1 ? errMsg.indexOf(':') : errMsg.length);
  };

  getSelectedScopes = () => {
    const { homeCheckboxChecked, segmentCheckboxChecked, builderCheckboxChecked } = this.state;

    const scopes: string[] = [];
    if (homeCheckboxChecked) scopes.push('home');
    if (segmentCheckboxChecked) scopes.push('segments');
    if (builderCheckboxChecked) scopes.push('builders');

    return scopes;
  };

  applyChangesOnDashboard = (
    organisationId: string,
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
      community_id: organisationId,
    };

    return result;
  };

  onContentTextChange = (e: string) => {
    this.setState({
      contentText: e,
    });
  };

  onSave = () => {
    if (this.validate()) {
      const {
        match: {
          params: { organisationId },
        },
      } = this.props;

      const { dashboard } = this.state;

      if (organisationId) {
        if (dashboard) this.modifyExistingDashboard(dashboard.id, organisationId);
        else this.createNewDashboard(organisationId);
      }
    }
  };

  onHomeCheckboxChange = (e: CheckboxChangeEvent) => {
    this.setState({
      homeCheckboxChecked: e.target.checked,
    });
  };

  onSegmentsCheckboxChange = (e: CheckboxChangeEvent) => {
    this.setState({
      segmentCheckboxChecked: e.target.checked,
    });
  };

  onSegmentBuildersCheckboxChange = (e: CheckboxChangeEvent) => {
    this.setState({
      builderCheckboxChecked: e.target.checked,
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

  formatEditedBy = (modifiedBy: string, modifiedTs: Date) => {
    const date = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(modifiedTs);
    return `Last edited by ${modifiedBy} on ${date}`;
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

    this.setState({
      contentErrorMessage: message,
    });
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

  render() {
    const { intl } = this.props;
    const {
      dashboardTitle,
      segmentCheckboxChecked,
      builderCheckboxChecked,
      contentText,
      homeCheckboxChecked,
      selectedSegments,
      selectedBuilders,
      dashboard,
      loading,
      existingSegments,
      existingBuilders,
      contentErrorMessage,
      form,
    } = this.state;

    const initialValues = dashboard
      ? {
          input_title: dashboardTitle,
          checkbox_home: homeCheckboxChecked,
          checkbox_segment: segmentCheckboxChecked,
          checkbox_builder: builderCheckboxChecked,
          select_segments: selectedSegments,
          select_builders: selectedBuilders,
          content_editor: contentText.length > 0 ? contentText : '',
        }
      : {
          content_editor: defaultContent,
        };

    const breadcrumb = dashboard
      ? dashboard.title
      : intl.formatMessage(messages.createNewDashboard);

    const editedBy =
      dashboard && dashboard.last_modified_by && dashboard.last_modified_ts
        ? this.formatEditedBy(dashboard.last_modified_by, dashboard.last_modified_ts)
        : null;

    const contentErrorStatus = contentErrorMessage ? 'error' : 'success';

    return loading ? (
      <Loading isFullScreen={true} />
    ) : (
      <div className='ant-layout'>
        <EditDashboardActionBar lastBreadcrumb={breadcrumb} handleSave={this.onSave} />
        <div className='ant-layout'>
          <Content className='mcs-content-container mcs-dashboardEditor'>
            <Form ref={form} initialValues={initialValues}>
              <Row className='mcs-dashboardEditor_row'>
                <Row className='mcs-dashboardEditor_row_column'>
                  {dashboard && <span className='mcs-dashboardEditor_index'>#{dashboard.id}</span>}
                  <Form.Item
                    name='input_title'
                    className='mcs-dashboardEditor_column_input'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the title',
                      },
                    ]}
                  >
                    <Input onChange={this.onDashboardTitleChange} />
                  </Form.Item>
                </Row>
                <div className='mcs-dashboardEditor_row_column mcs-dashboardEditor_row_editedBy'>
                  {editedBy && <span>{editedBy}</span>}
                </div>
              </Row>
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
                <Checkbox onChange={this.onSegmentsCheckboxChange}>
                  {intl.formatMessage(messages.segments)}
                </Checkbox>
              </Form.Item>
              {segmentCheckboxChecked && (
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
                <Checkbox onChange={this.onSegmentBuildersCheckboxChange}>
                  {intl.formatMessage(messages.builders)}
                </Checkbox>
              </Form.Item>
              {builderCheckboxChecked && (
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
                className='mcs-dashboardEditor_aceEditor'
                validateStatus={contentErrorStatus}
                help={contentErrorMessage}
              >
                <AceEditor
                  mode='json'
                  theme='github'
                  onChange={this.onContentTextChange}
                  fontSize={14}
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  width='100%'
                  defaultValue={initialValues.content_editor}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: false,
                    showLineNumbers: true,
                  }}
                  onValidate={this.onContentValidateInAceEditor}
                />
              </Form.Item>
            </Form>
          </Content>
        </div>
      </div>
    );
  }
}

export default compose<EditDashboardPageProps, {}>(
  withRouter,
  injectIntl,
  injectNotifications,
)(EditDashboardPage);

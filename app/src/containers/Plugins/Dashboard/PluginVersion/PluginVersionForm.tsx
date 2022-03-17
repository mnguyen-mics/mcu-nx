import { Button, Col, Form, Input, message, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import messages from '../../messages';
import cuid from 'cuid';
import {
  FormSection,
  IDataFileService,
  IPluginService,
  lazyInject,
  PluginResource,
  PluginVersionResource,
  TYPES,
} from '@mediarithmics-private/advanced-components';
import { PlusOutlined } from '@ant-design/icons';
import {
  PluginPropertyType,
  PropertyResourceShape,
} from '@mediarithmics-private/advanced-components/lib/models/plugin';
import PluginVersionProperty from './PluginVersionProperty';
import { Loading } from '@mediarithmics-private/mcs-components-library';
import { RouterProps } from '../PluginPageActionbar';
import { RouteComponentProps, withRouter } from 'react-router';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../../Notifications/injectNotifications';

export const INITIAL_PROPERTY: PropertyResourceShape = {
  property_type: 'STRING',
  value: {
    value: '',
  },
  deletable: false,
  origin: 'PLUGIN',
  technical_name: '',
  writable: false,
};
export interface PluginVersionFormData {
  pluginVersionId: string;
  properties: PropertyResourceModel[];
}

export interface PropertyResourceModel {
  key: string;
  property: PropertyResourceShape;
}

export interface PluginVersionFormProps {
  plugin?: PluginResource;
  lastPluginVersion?: PluginVersionResource;
  fetchPlugin: () => void;
  closeDrawer: () => void;
}

type Props = PluginVersionFormProps &
  InjectedIntlProps &
  RouteComponentProps<RouterProps> &
  InjectedNotificationProps;

interface State {
  isLoading: boolean;
  formData: PluginVersionFormData;
}

class PluginVersionForm extends React.Component<Props, State> {
  @lazyInject(TYPES.IPluginService)
  private _pluginService: IPluginService;
  @lazyInject(TYPES.IDataFileService)
  private _dataFileService: IDataFileService;
  constructor(props: Props) {
    super(props);
    this.state = {
      formData: {
        pluginVersionId: '',
        properties: [
          {
            key: cuid(),
            property: INITIAL_PROPERTY,
          },
          {
            key: 'provider',
            property: {
              technical_name: 'provider',
              value: {
                value: '',
              },
              property_type: 'STRING',
              origin: 'PLUGIN_STATIC',
              writable: false,
              deletable: false,
            },
          },
          {
            key: 'name',
            property: {
              technical_name: 'name',
              value: {
                value: '',
              },
              property_type: 'STRING',
              origin: 'PLUGIN_STATIC',
              writable: false,
              deletable: false,
            },
          },
        ],
      },
      isLoading: false,
    };
  }

  componentDidMount() {
    const { plugin, lastPluginVersion, notifyError } = this.props;
    const pluginId = plugin?.id;
    const pluginVersionId = lastPluginVersion?.id;
    if (pluginId && pluginVersionId)
      this._pluginService
        .getPluginVersionProperties(pluginId, pluginVersionId)
        .then(res => {
          this.setState({
            formData: {
              pluginVersionId: lastPluginVersion?.version_id || '',
              properties: res.data.map(p => {
                const getKey = (key: string) => {
                  switch (key) {
                    case 'provider':
                      return 'provider';
                    case 'name':
                      return 'name';
                    default:
                      return cuid();
                  }
                };
                return {
                  key: getKey(p.technical_name),
                  property: p,
                };
              }),
            },
          });
        })
        .catch(err => {
          notifyError(err);
        });
  }

  savePluginVersion = (formData: PluginVersionFormData) => {
    const {
      plugin,
      notifyError,
      closeDrawer,
      fetchPlugin,
      match: {
        params: { organisationId },
      },
      intl: { formatMessage },
    } = this.props;
    const providerProperty = formData.properties.find(p => p.key === 'provider');
    const nameProperty = formData.properties.find(p => p.key === 'name');
    const pluginVersionId = formData.pluginVersionId;
    const currentPluginVersionId = plugin?.current_version_id;
    const pluginId = plugin?.id;

    if (!providerProperty || !nameProperty || !pluginVersionId) {
      return message.error(formatMessage(messages.missingField), 3);
    } else if (pluginId) {
      const properties = formData.properties.map(p => p.property);
      this.setState({
        isLoading: true,
      });

      const newProperties: PropertyResourceShape[] = [];

      properties.map((pluginProperty: any) => {
        if (pluginProperty.property_type === 'DATA_FILE') {
          // build formData
          const blob = new Blob([pluginProperty.value.fileContent], {
            type: 'application/octet-stream',
          }); /* global Blob */
          if (pluginProperty.value.uri) {
            // edit
            return this._dataFileService
              .editDataFile(pluginProperty.value.fileName, pluginProperty.value.uri, blob)
              .then(() => {
                const newProperty = {
                  ...pluginProperty,
                };
                newProperty.value = {
                  uri: pluginProperty.value.uri,
                  last_modified: null,
                };
                newProperties.push(newProperty);
              });
          } else if (pluginProperty.value.fileName && pluginProperty.value.fileContent) {
            // create
            return this._dataFileService
              .createDatafile(
                organisationId,
                `plugins/${pluginId}/versions`,
                currentPluginVersionId ? currentPluginVersionId : '1', // value is used for file uri
                pluginProperty.value.fileName,
                blob,
              )
              .then((res: any) => {
                const newProperty = {
                  ...pluginProperty,
                };
                newProperty.value = {
                  uri: res,
                  last_modified: null,
                };
                newProperties.push(newProperty);
              });
          } else if (
            !pluginProperty.value.fileName &&
            !pluginProperty.value.fileContent &&
            !pluginProperty.value.uri
          ) {
            // delete
            const newProperty = {
              ...pluginProperty,
            };
            newProperty.value = {
              uri: null,
              last_modified: null,
            };
            newProperties.push(newProperty);
            return;
          }
          return;
        } else {
          newProperties.push(pluginProperty);
          return;
        }
      });

      return this._pluginService
        .createPluginVersion(pluginId, {
          version_id: formData.pluginVersionId,
          plugin_properties: newProperties,
        })
        .then(newPluginVersionResponse => {
          // Then we copy all configuration files
          // and layout files for this new version
          if (currentPluginVersionId) {
            // Configuration files part
            this._pluginService
              .listPluginConfigurationFiles(pluginId, currentPluginVersionId)
              .then(configurationFileListingResponse => {
                configurationFileListingResponse.data.forEach(configurationFileListingEntity => {
                  const technicalName = configurationFileListingEntity.technical_name;
                  this._pluginService
                    .getPluginConfigurationFile(pluginId, currentPluginVersionId, technicalName)
                    .then(configurationFileResponse => {
                      this._pluginService.putPluginConfigurationFile(
                        pluginId,
                        newPluginVersionResponse.data.id,
                        technicalName,
                        configurationFileResponse,
                      );
                    })
                    .catch(err => {
                      notifyError(err);
                    });
                });
              })
              .catch(err => {
                notifyError(err);
              });
            // Layout file part
            this._pluginService
              .listPluginLayouts(pluginId, currentPluginVersionId)
              .then(layoutFileListingResponse => {
                layoutFileListingResponse.data.forEach(layoutFileListingEntity => {
                  if (layoutFileListingEntity.locale) {
                    const locale = layoutFileListingEntity.locale;
                    this._pluginService
                      .getLocalizedPluginLayoutFile(pluginId, currentPluginVersionId, locale)
                      .then(layoutFileResponse => {
                        this._pluginService
                          .putLocalizationFile(
                            pluginId,
                            newPluginVersionResponse.data.id,
                            locale,
                            layoutFileResponse,
                          )
                          .catch(err => {
                            notifyError(err);
                          });
                      })
                      .catch(err => {
                        notifyError(err);
                      });
                  } else {
                    this._pluginService
                      .getLocalizedPluginLayout(pluginId, currentPluginVersionId)
                      .then(layoutResponse => {
                        const blob = new Blob([JSON.stringify(layoutResponse) || '']);
                        this._pluginService
                          .putPropertiesLayout(pluginId, newPluginVersionResponse.data.id, blob)
                          .catch(err => {
                            notifyError(err);
                          });
                      });
                  }
                });
              })
              .catch(err => {
                notifyError(err);
              });
          }
        })
        .then(res => {
          fetchPlugin();
          message.success(formatMessage(messages.pluginVersionSaveSuccess), 3);
          this.setState({
            isLoading: false,
          });
          closeDrawer();
        })
        .catch(err => {
          this.setState({
            isLoading: false,
          });
          notifyError(err);
        });
    }
    return;
  };

  addNewProperty = () => {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        properties: formData.properties.concat({
          key: cuid(),
          property: INITIAL_PROPERTY,
        }),
      },
    });
  };

  handleSubmit = () => {
    const { formData } = this.state;
    return this.savePluginVersion(formData);
  };

  onGeneralPropertyChange = (fieldName: 'provider' | 'name') => (e: any) => {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        properties: formData.properties.map(p => {
          if (p.key === fieldName) {
            return {
              ...p,
              property: {
                ...p.property,
                value: {
                  value: e.target.value,
                } as any,
              },
            };
          }
          return p;
        }),
      },
    });
  };

  onVersionChange = (e: any) => {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        pluginVersionId: e.target.value,
      },
    });
  };

  onPropertyChange =
    (key: string, fieldName: string, propertyType: PluginPropertyType) => (e: any) => {
      const { formData } = this.state;

      this.setState({
        formData: {
          ...formData,
          properties: formData.properties.map(p => {
            if (p.key === key) {
              switch (fieldName) {
                case 'technical_name':
                  return {
                    ...p,
                    property: {
                      ...p.property,
                      property_type: propertyType,
                      technical_name: e.target.value,
                    },
                  };
                case 'writable':
                  return {
                    ...p,
                    property: {
                      ...p.property,
                      property_type: propertyType,
                      writable: e.target.checked,
                    },
                  };
                case 'property_type':
                  const val =
                    propertyType === 'URL'
                      ? {
                          url: '',
                        }
                      : { value: '' };
                  return {
                    ...p,
                    property: {
                      ...p.property,
                      property_type: propertyType,
                      value: val,
                    },
                  };
                case 'value':
                  if (propertyType === 'DATA_FILE') {
                    const value = { fileName: e.file.name, fileContent: e.file };
                    return {
                      ...p,
                      property: {
                        ...p.property,
                        property_type: propertyType,
                        value: value,
                      },
                    };
                  } else {
                    const inputValue = e.target.value;
                    const value =
                      propertyType === 'URL'
                        ? {
                            url: inputValue,
                          }
                        : { value: inputValue };
                    return {
                      ...p,
                      property: {
                        ...p.property,
                        property_type: propertyType,
                        value: value,
                      },
                    };
                  }

                default:
                  break;
              }
            }
            return p;
          }) as any,
        },
      });
    };

  onDelete = (key: string) => () => {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        properties: formData.properties.filter(p => p.key !== key),
      },
    });
  };

  render() {
    const {
      intl: { formatMessage },
    } = this.props;

    const { formData, isLoading } = this.state;

    return (
      <Form layout='vertical' className='mcs-pluginEdit-drawer-form'>
        <Content className='mcs-content-container mcs-pluginEdit-drawer-container'>
          {isLoading ? (
            <Loading isFullScreen={true} />
          ) : (
            <React.Fragment>
              <FormSection
                title={messages.generalInformation}
                subtitle={messages.generalInformationSubtitle}
              />
              <Row className='mcs-pluginEdit-drawerForm-generalInformationSection' gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label={
                      <div className='mcs-pluginEdit-drawer-form-label'>
                        {formatMessage(messages.version)}
                      </div>
                    }
                    className='mcs-pluginEdit-drawer-form-item'
                  >
                    <Input
                      className='mcs-pluginEdit-drawer-form-input mcs-pluginEdit-drawer-form-input-version'
                      placeholder={formData.pluginVersionId}
                      onChange={this.onVersionChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={
                      <div className='mcs-pluginEdit-drawer-form-label'>
                        {formatMessage(messages.provider)}
                      </div>
                    }
                    className='mcs-pluginEdit-drawer-form-item'
                  >
                    <Input
                      className='mcs-pluginEdit-drawer-form-input mcs-pluginEdit-drawer-form-input-provider'
                      placeholder='Provider'
                      onChange={this.onGeneralPropertyChange('provider')}
                      value={
                        (formData.properties.find(p => p.key === 'provider')?.property.value as any)
                          .value
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={
                      <div className='mcs-pluginEdit-drawer-form-label'>
                        {formatMessage(messages.name)}
                      </div>
                    }
                    className='mcs-pluginEdit-drawer-form-item'
                  >
                    <Input
                      className='mcs-pluginEdit-drawer-form-input mcs-pluginEdit-drawer-form-input-name'
                      placeholder='Name'
                      onChange={this.onGeneralPropertyChange('name')}
                      value={
                        (formData.properties.find(p => p.key === 'name')?.property.value as any)
                          .value
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <FormSection
                title={messages.propertiesSection}
                subtitle={messages.propertiesSectionSubtitle}
              />
              <div className='mcs-pluginEdit-drawerForm-propertySection'>
                {formData.properties
                  .filter(p => p.key !== 'name' && p.key !== 'provider')
                  .map(propertyModel => {
                    const key = propertyModel.key;
                    return (
                      <PluginVersionProperty
                        key={key}
                        propertyModel={propertyModel}
                        onDelete={this.onDelete}
                        onChange={this.onPropertyChange}
                      />
                    );
                  })}
              </div>
              <Button
                className='mcs-pluginConfigurationFileTable_addNewProperty'
                onClick={this.addNewProperty}
              >
                <PlusOutlined /> <FormattedMessage {...messages.addNewProperty} />
              </Button>
            </React.Fragment>
          )}
        </Content>
        <div className='mcs-pluginEdit-saveButtonContainer'>
          <Button
            onClick={this.handleSubmit}
            className='mcs-primary mcs-pluginVersionDrawer-saveButton'
            type='primary'
          >
            {formatMessage(messages.save)}
          </Button>
        </div>
      </Form>
    );
  }
}

export default compose<Props, PluginVersionFormProps>(
  injectIntl,
  injectNotifications,
  withRouter,
)(PluginVersionForm);

import * as React from 'react';
import { compose } from 'recompose';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { withRouter, RouteComponentProps } from 'react-router';
import CreativeService from '../../../../services/CreativeService';
import PluginService from '../../../../services/PluginService';
import PluginEditForm from '../../../Plugin/Edit/PluginEditForm';
import { EditContentLayout } from '../../../../components/Layout';
import {
  PluginProperty,
  PluginVersionResource,
} from '../../../../models/Plugins';
import { Loading } from '../../../../components';
import { EmailTemplateResource } from '../../../../models/creative/CreativeResource';
import { DataResponse } from '../../../../services/ApiService';

import messages from './messages';
import injectNotifications, { InjectedNotificationProps } from '../../../Notifications/injectNotifications';
import { PluginLayout } from '../../../../models/plugin/PluginLayout';
import { PropertyResourceShape } from '../../../../models/plugin';

const CreativeRendererId = '1034';

interface EmailTemplateRouteParam {
  organisationId: string;
  creativeId?: string;
}

interface EmailTemplateForm {
  plugin?: EmailTemplateResource;
  properties?: PluginProperty[];
}

interface CreateEmailTemplateState {
  edition: boolean;
  isLoading: boolean;
  pluginLayout?: PluginLayout;
  initialValues?: EmailTemplateForm;
  emailTemplateRenderer?: PluginVersionResource;
}

type JoinedProps = InjectedNotificationProps &
  RouteComponentProps<EmailTemplateRouteParam> &
  InjectedIntlProps;

class CreateEmailTemplate extends React.Component<
  JoinedProps,
  CreateEmailTemplateState
  > {
  constructor(props: JoinedProps) {
    super(props);

    this.state = {
      edition: props.match.params.creativeId ? true : false,
      isLoading: true,
    };
  }

  componentDidMount() {
    const { edition } = this.state;
    const {
      match: {
        params: { organisationId, creativeId },
      },
      notifyError
    } = this.props;

    this.setState(() => { return { isLoading: true } });

    const promise = edition && creativeId ? this.fetchInitialValues(creativeId) : this.fetchCreationValue(organisationId);

    promise.then(() => {
      this.setState(() => {
        return { isLoading: false };
      })
    }).catch(err => {
      notifyError(err);
      this.setState(() => {
        return { isLoading: false };
      });
    });
  }

  componentWillReceiveProps(nextProps: JoinedProps) {
    const {
      match: {
        params: { organisationId, creativeId },
      },
      notifyError
    } = this.props;
    const {
      match: {
        params: {
          organisationId: nextOrganisationId,
          creativeId: nextEmailTemplateId,
        },
      },
    } = nextProps;

    if (
      (organisationId !== nextOrganisationId ||
        creativeId !== nextEmailTemplateId) &&
      nextEmailTemplateId
    ) {
      this.setState(() => { return { isLoading: true } });
      this.fetchInitialValues(nextEmailTemplateId).then(() => {
        this.setState(() => {
          return { isLoading: false };
        })
      }).catch(err => {
        notifyError(err);
        this.setState(() => {
          return { isLoading: false };
        });
      });
    }
  }

  promisesValues = (properties: PropertyResourceShape[], pLayoutRes: DataResponse<PluginLayout> | null) => {

    const modifiedProperties = properties
      .sort(a => {
        return a.writable === false ? -1 : 1;
      })
      .map(prop => {
        return prop.technical_name === 'template_file' &&
          prop.property_type === 'DATA_FILE'
          ? {
            ...prop,
            value: { ...prop.value, acceptedFile: 'text/html' },
          }
          : prop;
      });

    this.setState(prevState => {
      const nextState = {
        ...prevState,
        isLoading: false,
        initialValues: {
          properties: modifiedProperties
        },
      };


      if (pLayoutRes !== null && pLayoutRes.status !== "error") {
        nextState.pluginLayout = pLayoutRes.data;
      };

      return nextState;
    })
  };

  fetchCreationValue = (organisationId: string): Promise<any> => {
    return PluginService.getPluginVersions(CreativeRendererId).then(res => {
      const lastVersion = res.data[res.data.length - 1];

      return Promise.all([
        PluginService.getPluginVersionProperty(
          CreativeRendererId,
          lastVersion.id,
        ).then(res1 => res1.data),
        PluginService.getLocalizedPluginLayout(
          CreativeRendererId,
          lastVersion.id
        )
      ]).then(results => {
        this.promisesValues(results[0], results[1]);
        return results;
      })
    });
  }

  fetchInitialValues = (emailTemplateId: string): Promise<any> => {
    return PluginService.getPluginVersions(CreativeRendererId).then(res => {

      return Promise.all([
        CreativeService.getEmailTemplate(
          emailTemplateId,
        ).then(res1 => res1.data),
        CreativeService.getEmailTemplateProperties(
          emailTemplateId,
        ).then(res1 => res1.data),
        CreativeService.getEmailTemplateLocalizedPluginLayout(
          emailTemplateId,
        )
      ]).then(results => {
        this.promisesValues(results[1], results[2]);

        this.setState(prevState => {
          const nextState: CreateEmailTemplateState = {
            ...prevState,
            initialValues: {
              plugin: results[0],
              ...prevState.initialValues,
            },
          };

          return nextState;
        });

        return results;
      })
    });
  };

  redirect = () => {
    const {
      history,
      match: {
        params: { organisationId },
      },
    } = this.props;
    const attributionModelUrl = `/v2/o/${organisationId}/creatives/email`;
    history.push(attributionModelUrl);
  };

  saveOrCreatePluginInstance = (
    plugin: EmailTemplateResource,
    properties: PluginProperty[],
  ) => {

    const {
      match: { params: { organisationId, creativeId } },
      history,
      notifyError,
    } = this.props;

    // if edition update and redirect
    if (creativeId) {
      return this.setState({ isLoading: true }, () => {
        CreativeService.updateEmailTemplate(plugin.id, plugin)
          .then(res => {
            return this.updatePropertiesValue(
              properties,
              organisationId,
              plugin.id,
            );
          })
          .then(res => {
            this.setState({ isLoading: false }, () => {
              history.push(`/v2/o/${organisationId}/creatives/email`);
            });
          })
          .catch(err => notifyError(err));
      });
    }
    // if creation save and redirect
    const formattedFormValues = {
      ...plugin,
    };
    if (this.state.initialValues && this.state.emailTemplateRenderer) {
      formattedFormValues.renderer_artifact_id = this.state.emailTemplateRenderer.artifact_id;
      formattedFormValues.renderer_group_id = this.state.emailTemplateRenderer.group_id;
      formattedFormValues.editor_artifact_id = 'default-editor';
      formattedFormValues.editor_group_id = 'com.mediarithmics.template.email';
    }
    return this.setState({ isLoading: true }, () => {
      CreativeService.createEmailTemplate(organisationId, formattedFormValues)
        .then(res => res.data)
        .then(res => {
          return this.updatePropertiesValue(properties, organisationId, res.id);
        })
        .then(res => {
          this.setState({ isLoading: false }, () => {
            history.push(`/v2/o/${organisationId}/creatives/email`);
          });
        })
        .catch(err => notifyError(err));
    });
  };

  updatePropertiesValue = (
    properties: PluginProperty[],
    organisationId: string,
    id: string,
  ) => {
    const propertiesPromises: Array<Promise<DataResponse<PluginProperty>>> = [];
    properties.forEach(item => {
      propertiesPromises.push(
        CreativeService.updateEmailTemplateProperty(
          organisationId,
          id,
          item.technical_name,
          item,
        ),
      );
    });
    return Promise.all(propertiesPromises);
  };

  formatInitialValues = (initialValues: any) => {
    const formattedProperties: any = {};

    if (initialValues.properties) {
      initialValues.properties.forEach((property: PluginProperty) => {
        formattedProperties[property.technical_name] = {
          value: property.value,
        };
      });
    }

    return {
      plugin: initialValues.plugin,
      properties: formattedProperties,
    };
  };

  render() {
    const {
      match: { params: { organisationId, creativeId } },
      intl: { formatMessage },
    } = this.props;

    const { isLoading } = this.state;

    const breadcrumbPaths = [
      { name: formatMessage(messages.emailTemplateBreadCrumb) },
    ];

    const sections: Array<{ sectionId: string, title: { id: string; defaultMessage: string; } }> =
      this.state.pluginLayout === undefined ?
        [{
          sectionId: 'properties',
          title: messages.menuProperties,
        },
        ] :
        this.state.pluginLayout.sections.map(section => {
          return {
            sectionId: section.title,
            title: { id: section.title, defaultMessage: section.title },
          }
        });

    const sidebarItems = [
      {
        sectionId: 'general',
        title: messages.menuGeneralInformation,
      }
    ].concat(sections);

    const formId = 'pluginForm';

    const actionbarProps =
      (this.state.initialValues &&
        this.state.initialValues.properties &&
        this.state.initialValues.properties.length) ||
        !!creativeId
        ? {
          formId,
          message: messages.save,
          onClose: this.redirect,
        }
        : {
          formId,
          onClose: this.redirect,
        };

    return isLoading ? (
      <div style={{ display: 'flex', flex: 1 }}>
        <Loading className="loading-full-screen" />
      </div>
    ) : (
        <EditContentLayout
          paths={breadcrumbPaths}
          items={sidebarItems}
          scrollId={formId}
          {...actionbarProps}
        >
          <PluginEditForm
            editionMode={!!creativeId}
            organisationId={organisationId}
            save={this.saveOrCreatePluginInstance}
            pluginProperties={
              (this.state.initialValues && this.state.initialValues.properties) ||
              []
            }
            disableFields={isLoading}
            pluginLayout={this.state.pluginLayout}
            isLoading={isLoading}
            pluginVersionId={
              (this.state.emailTemplateRenderer &&
                this.state.emailTemplateRenderer.id) ||
              ''
            }
            formId={formId}
            initialValues={this.formatInitialValues(this.state.initialValues)}
            showGeneralInformation={true}
            showTechnicalName={true}
          />
        </EditContentLayout>
      );
  }
}

export default compose(injectIntl, withRouter, injectNotifications)(
  CreateEmailTemplate,
);

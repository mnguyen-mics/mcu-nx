import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import { withMcsRouter } from '../../../../Helpers';
import DisplayCreativeCreationEditor from './DisplayCreativeCreationEditor';
import DisplayCreativeTypePicker from './DisplayCreativeTypePicker';

import PluginService from '../../../../../services/PluginService';
import CreativeService from '../../../../../services/CreativeService';
import * as actions from '../../../../../state/Notifications/actions';
import log from '../../../../../utils/Logger';
import { ReactRouterPropTypes } from '../../../../../validators/proptypes';
import Loading from '../../../../../components/Loading.tsx';
import { EditContentLayout } from '../../../../../components/Layout/index.ts';

import messages from '../messages';

const formId = 'creativeEditor';

class DisplayCreativeContent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      adRenderer: {
        id: null,
        versionId: null,
        artifactId: null,
        groupId: null,
      },
      isLoading: false,
      rendererProperties: [],
      formats: []
    };
  }

  onSelect = adRenderer => {
    const {
      notifyError,
      organisationId
    } = this.props;
    this.setState(prevState => {
      const nextState = {
        ...prevState
      };
      nextState.isLoading = true;
      return nextState;
    }, () => {
      PluginService
        .getPluginVersions(adRenderer)
        .then(res => {
          const lastVersion = res.data[res.data.length - 1];

          const pluginPropertiesPromise = PluginService.getPluginVersionProperty(adRenderer, lastVersion.id);
          const formatsPromises = CreativeService.getCreativeFormats(organisationId);

          Promise.all([pluginPropertiesPromise, formatsPromises])
            .then(values => {
              this.setState(prevState => {
                const nextState = {
                  ...prevState
                };
                nextState.rendererProperties = values[0].sort((a) => {
                  return a.writable === false ? -1 : 1;
                });
                nextState.formats = values[1].filter(item => {
                  return item.type === 'DISPLAY_AD';
                }).sort((a, b) => {
                  return a.width - b.width;
                }).map(item => {
                  return `${item.width}x${item.height}`;
                });

                nextState.adRenderer = {
                  id: adRenderer,
                  versionId: lastVersion.id,
                  artifactId: lastVersion.artifact_id,
                  groupId: lastVersion.group_id
                };
                nextState.isLoading = false;
                return nextState;
              });
            })
            .catch(err => {
              notifyError(err);
              this.setState(() => {
                return { isLoading: false };
              });
            });

        })
        .catch(err => {
          log.debug(err);
          notifyError(err);
          this.setState(prevState => {
            const nextState = {
              ...prevState
            };
            nextState.isLoading = true;
            return nextState;
          });
        });
    });
  }

  onReset = () => {
    this.setState(prevState => {
      const nextState = {
        ...prevState
      };
      nextState.adRenderer = {
        id: null,
        versionId: null
      };
      return nextState;
    });

  }

  render() {
    const {
      organisationId,
      intl: { formatMessage },
      onClose,
      match: {
        url,
      },
    } = this.props;

    const {
      adRenderer,
      isLoading
    } = this.state;

    const sidebarItems = {
      creative: messages.creativeSiderMenuCreativeType,
      general_infos: messages.creativeSiderMenuGeneralInformation,
      properties: messages.creativeSiderMenuProperties,
    };

    const buttonMetadata = {
      formId: formId,
      message: messages.saveCreative,
      onClose: onClose,
    };

    const breadcrumbPaths = [
      { name: formatMessage(messages.creativeCreationBreadCrumb) },
    ];


    const isCreativetypePicker = true;

    return (
      <div className="ant-layout">
        {isLoading ?
          <div style={{ display: 'flex', flex: 1 }}>
            <Loading className="loading-full-screen" />
          </div>
          :
          (adRenderer.id && adRenderer.versionId) ?
            <EditContentLayout
              breadcrumbPaths={breadcrumbPaths}
              sidebarItems={sidebarItems}
              buttonMetadata={buttonMetadata}
              url={url}
              changeType={this.onReset}
            >
              <DisplayCreativeCreationEditor
                save={this.props.save}
                adRenderer={adRenderer}
                isLoading={isLoading}
                formats={this.state.formats}
                rendererProperties={this.state.rendererProperties}
                organisationId={organisationId}
                closeNextDrawer={this.props.closeNextDrawer}
                openNextDrawer={this.props.openNextDrawer}
                formId={formId}
              />
            </EditContentLayout>
            :
            <div className="ant-layout">
              <EditContentLayout
                breadcrumbPaths={breadcrumbPaths}
                buttonMetadata={buttonMetadata}
                url={url}
                isCreativetypePicker={isCreativetypePicker}
              >
                <DisplayCreativeTypePicker
                  save={this.props.save}
                  onSelect={this.onSelect}
                  formId={formId}
                  closeNextDrawer={this.props.closeNextDrawer}
                  openNextDrawer={this.props.openNextDrawer}
                  organisationId={organisationId}
                />
              </EditContentLayout>
            </div>}
      </div>
    );
  }
}

DisplayCreativeContent.propTypes = {
  organisationId: PropTypes.string.isRequired,
  notifyError: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  closeNextDrawer: PropTypes.func.isRequired,
  openNextDrawer: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  save: PropTypes.func.isRequired,
};

export default compose(
  injectIntl,
  withMcsRouter,
  connect(
    undefined,
    { notifyError: actions.notifyError },
  ),
)(DisplayCreativeContent);

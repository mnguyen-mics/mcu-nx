import * as React from 'react';
import { compose } from 'recompose';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { withRouter, RouteComponentProps } from 'react-router';
import RecommenderService from '../../../../../services/Library/RecommenderService';
import {
  PluginProperty,
  Recommender,
  PluginResource,
  PluginInstance,
} from '../../../../../models/Plugins';

import messages from './messages';
import GenericPluginContent, { PluginContentOuterProps } from '../../../../Plugin/Edit/GenericPluginContent';
import { Omit } from 'antd/lib/form/Form';

const RecommenderPluginContent = GenericPluginContent as React.ComponentClass<PluginContentOuterProps<Recommender>>
interface RecommenderRouteParam {
  organisationId: string;
  recommenderId?: string;
}

type JoinedProps = RouteComponentProps<RecommenderRouteParam> &
  InjectedIntlProps;

class CreateEditRecommender extends React.Component<JoinedProps> {
  
  redirect = () => {
    const { history, match: { params: { organisationId } } } = this.props;
    const attributionModelUrl = `/v2/o/${organisationId}/settings/campaigns/recommenders`;
    history.push(attributionModelUrl);
  };

  onSaveOrCreatePluginInstance = (
    plugin: Recommender,
    properties: PluginProperty[],
  ) => {

    const {
      match: { params: { organisationId } },
      history,
    } = this.props;
    history.push(
      `/v2/o/${organisationId}/settings/campaigns/recommenders`,
    );
  };

  createPluginInstance = (
    organisationId: string,
    plugin: PluginResource,
    pluginInstance: Recommender,
  ): PluginInstance => {
    const result: Omit<Recommender, "id"> = {
      // ...pluginInstance,
      version_id: plugin.current_version_id,
      version_value: pluginInstance.version_value,
      artifact_id: plugin.artifact_id,
      group_id: plugin.group_id,
      organisation_id: organisationId,
      recommenders_plugin_id: plugin.id,
      name: pluginInstance.name
    }
    return result
  };


  render() {
    const { intl: { formatMessage }, match: { params: { recommenderId } } } = this.props;


    const breadcrumbPaths = (recommender?: Recommender) => [
      {
        name: recommender
          ? formatMessage(messages.recommenderEditBreadcrumb, { name: recommender.name })
          : formatMessage(messages.recommenderNewBreadcrumb),
      },
    ];

    return (
      <RecommenderPluginContent
        pluginType={'RECOMMENDER'}
        listTitle={messages.listTitle}
        listSubTitle={messages.listSubTitle}
        breadcrumbPaths={breadcrumbPaths}
        pluginInstanceService={RecommenderService}
        pluginInstanceId={recommenderId}
        createPluginInstance={this.createPluginInstance}
        onSaveOrCreatePluginInstance={this.onSaveOrCreatePluginInstance}
        onClose={this.redirect}
      />
    );
  }
}

export default compose<JoinedProps, {}>(
  injectIntl,
  withRouter,
)(CreateEditRecommender);

import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { Layout, message } from 'antd';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import * as FeatureSelectors from '../../../../../state/Features/selectors';
import {
  EditSiteRouteMatchParam,
  INITIAL_SITE_FORM_DATA,
  SiteFormData,
} from './domain';
import messages from './messages';
import SiteEditForm, { FORM_ID } from './SiteEditForm';
import Loading from '../../../../../components/Loading';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../../../Notifications/injectNotifications';
import { injectDatamart, InjectedDatamartProps } from '../../../../Datamart';
import { createFieldArrayModel } from '../../../../../utils/FormHelper';
import {
  ChannelResource,
  EventRules,
} from '../../../../../models/settings/settings';
import { VisitAnalyzerFieldModel } from '../../Common/domain';
import DatamartSelector from '../../../../../containers/Audience/Common/DatamartSelector';
import { DatamartResource } from '../../../../../models/datamart/DatamartResource';
import { getWorkspace } from '../../../../../state/Session/selectors';
import FormLayoutActionbar, {
  FormLayoutActionbarProps,
} from '../../../../../components/Layout/FormLayoutActionbar';
import { UserWorkspaceResource } from '../../../../../models/directory/UserProfileResource';
import { lazyInject } from '../../../../../config/inversify.config';
import { IChannelService } from '../../../../../services/ChannelService';
import { TYPES } from '../../../../../constants/types';

interface State {
  siteData: SiteFormData;
  loading: boolean;
  selectedDatamartId: string;
}

interface MapStateToProps {
  workspace: (organisationId: string) => UserWorkspaceResource;
}

type Props = InjectedIntlProps &
  InjectedNotificationProps &
  RouteComponentProps<EditSiteRouteMatchParam> &
  MapStateToProps &
  InjectedDatamartProps;

class SiteEditPage extends React.Component<Props, State> {

  @lazyInject(TYPES.IChannelService)
  private _channelService: IChannelService;

  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true, // default true to avoid render x2 on mounting
      siteData: INITIAL_SITE_FORM_DATA,
      selectedDatamartId: props.match.params.datamartId,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { siteId: siteIdFromURLParam, organisationId },
      },
      location,
      datamart,
    } = this.props;

    const siteIdFromLocState = location.state && location.state.siteId;

    const siteId = siteIdFromURLParam || siteIdFromLocState;

    if (siteId) {
      const getSites = this._channelService.getChannel(
        this.state.selectedDatamartId,
        siteId,
      );
      const getEventRules = this._channelService.getEventRules(
        this.state.selectedDatamartId,
        siteId,
        organisationId,
      );
      const getAliases = this._channelService.getAliases(
        this.state.selectedDatamartId,
        siteId,
        organisationId,
      );

      Promise.all([getSites, getEventRules, getAliases])
        .then(res => {
          const formData = {
            site: res[0].data,
            visitAnalyzerFields: res[0].data.visit_analyzer_model_id
              ? [
                  createFieldArrayModel({
                    visit_analyzer_model_id:
                      res[0].data.visit_analyzer_model_id,
                  }),
                ]
              : [],
            eventRulesFields: res[1].data.map((er: EventRules) =>
              createFieldArrayModel(er),
            ),
            aliases: res[2].data.map(al => createFieldArrayModel(al)),
          };
          return formData;
        })
        .then((formData: SiteFormData) =>
          this.setState({
            loading: false,
            siteData: formData,
            selectedDatamartId: formData.site.datamart_id
              ? formData.site.datamart_id
              : datamart.id,
          }),
        );
    } else {
      this.setState({ loading: false });
    }
  }

  onSubmitFail = () => {
    const { intl } = this.props;
    message.error(intl.formatMessage(messages.errorFormMessage));
  };

  getDatamartId = () => {
    const {
      match: {
        params: { siteId },
      },
      datamart,
    } = this.props;

    const { siteData, selectedDatamartId } = this.state;
    
    let datamartId: string;
    if (siteId) {
      datamartId = siteData.site.datamart_id
        ? siteData.site.datamart_id
        : datamart.id;
    } else {
      datamartId = selectedDatamartId;
    }
    return datamartId;
  }

  save = (siteFormData: SiteFormData) => {
    const {
      match: {
        params: { organisationId },
      },
      notifyError,
      history,
      intl,
    } = this.props;
    
    const datamartId = this.getDatamartId();

    const hideSaveInProgress = message.loading(
      intl.formatMessage(messages.savingInProgress),
      0,
    );

    this.setState({
      loading: true,
    });

    const getVisitAnalyzerId = (
      visitAnalyzerFields: VisitAnalyzerFieldModel[],
    ) => {
      if (
        visitAnalyzerFields.length &&
        visitAnalyzerFields[0].model &&
        visitAnalyzerFields[0].model.visit_analyzer_model_id
      ) {
        return visitAnalyzerFields[0].model.visit_analyzer_model_id;
      }
      return null;
    };

    const generateEventRulesTasks = (
      site: ChannelResource,
    ): Array<Promise<any>> => {
      const startIds = this.state.siteData.eventRulesFields.map(
        erf => erf.model.id,
      );
      const savedIds: string[] = [];
      const saveCreatePromises = siteFormData.eventRulesFields.map(erf => {
        if (!erf.model.id) {
          return this._channelService.createEventRules(datamartId, site.id, {
            ...erf.model,
            datamart_id: datamartId,
            site_id: site.id,
          });
        } else if (startIds.includes(erf.model.id)) {
          savedIds.push(erf.model.id);
          const eventRuleBody = { ...erf.model, datamart_id: datamartId, site_id: site.id };
          if (
            eventRuleBody.type === 'USER_IDENTIFIER_INSERTION' && 
            eventRuleBody.identifier_creation === 'USER_ACCOUNT' && 
            !eventRuleBody.compartment_id
          ) {
            eventRuleBody.compartment_id = null;
          }
          return this._channelService.updateEventRules(
            datamartId,
            site.id,
            organisationId,
            erf.model.id,
            eventRuleBody,
          );
        }
        return Promise.resolve();
      });
      const deletePromises = startIds.map(
        sid =>
          sid && !savedIds.includes(sid)
            ? this._channelService.deleteEventRules(
                datamartId,
                site.id,
                organisationId,
                sid,
              )
            : Promise.resolve(),
      );
      return [...saveCreatePromises, ...deletePromises];
    };

    const generateAliasesTasks = (
      site: ChannelResource,
    ): Array<Promise<any>> => {
      const startId = this.state.siteData.aliases.map(alias => alias.model.id);
      const savedIds: string[] = [];
      const saveCreatePromises = siteFormData.aliases.map(alias => {
        if (!alias.model.id) {
          return this._channelService.createAliases(datamartId, site.id, {
            organisation_id: organisationId,
            site_id: site.id,
            name: alias.model.name,
          });
        } else if (startId.includes(alias.model.id)) {
          savedIds.push(alias.model.id);
          return this._channelService.updateAliases(
            datamartId,
            site.id,
            organisationId,
            alias.model.id,
            {
              ...alias.model,
              site_id: site.id,
              organisation_id: organisationId,
            },
          );
        }
        return Promise.resolve();
      });
      const deletePromises = startId.map(
        sid =>
          sid && !savedIds.includes(sid)
            ? this._channelService.deleteAliases(
                datamartId,
                site.id,
                organisationId,
                sid,
              )
            : Promise.resolve(),
      );
      return [...saveCreatePromises, ...deletePromises];
    };

    const generateAllPromises = (
      site: ChannelResource,
    ): Array<Promise<any>> => {
      return [...generateEventRulesTasks(site), ...generateAliasesTasks(site)];
    };

    const generateSavingPromise = (): Promise<any> => {
      if (siteFormData.site.id) {
        const mbApp = {
          ...siteFormData.site,
          visit_analyzer_model_id: getVisitAnalyzerId(
            siteFormData.visitAnalyzerFields,
          ),
        };

        return this._channelService.updateSite(
          datamartId,
          siteFormData.site.id,
          mbApp,
        ).then(site => Promise.all(generateAllPromises(site.data)));
      }

      return this._channelService.createChannel(
        this.props.match.params.organisationId,
        datamartId,
        {
          ...siteFormData.site,
          visit_analyzer_model_id: getVisitAnalyzerId(
            siteFormData.visitAnalyzerFields,
          ),
          type: 'SITE',
        },
      ).then(site => Promise.all(generateAllPromises(site.data)));
    };

    generateSavingPromise()
      .then(() => {
        hideSaveInProgress();
        const mobileApplicationUrl = `/v2/o/${organisationId}/settings/datamart/sites`;
        history.push(mobileApplicationUrl);
      })
      .catch(err => {
        hideSaveInProgress();
        notifyError(err);
        this.setState({
          loading: false,
        });
      });
  };

  onClose = () => {
    const {
      history,
      location,
      match: {
        params: { organisationId },
      },
    } = this.props;
    
    const defaultRedirectUrl = `/v2/o/${organisationId}/settings/datamart/sites`;

    return location.state && location.state.from
      ? history.push(location.state.from)
      : history.push(defaultRedirectUrl);
  };

  onDatamartSelect = (datamart: DatamartResource) => {
    this.setState({
      selectedDatamartId: datamart.id,
    });
  };

  render() {
    const {
      match: {
        params: { organisationId },
      },
      intl: { formatMessage },
    } = this.props;

    const { loading, siteData } = this.state;

    if (loading) {
      return <Loading className="loading-full-screen" />;
    }

    const mobileName =
      siteData.site && siteData.site.name
        ? formatMessage(messages.editSiteTitle, {
            name: siteData.site.name,
          })
        : formatMessage(messages.createSiteTitle);

    const breadcrumbPaths = [
      {
        name: messages.breadcrumbTitle1,
        path: `/v2/o/${organisationId}/settings/datamart/sites`,
      },
      {
        name: mobileName,
      },
    ];

    const actionBarProps: FormLayoutActionbarProps = {
      formId: FORM_ID,
      paths: breadcrumbPaths,
      onClose: this.onClose,
    };

    const datamartId = this.getDatamartId();

    return datamartId ? (
      <SiteEditForm
        initialValues={siteData}
        onSubmit={this.save}
        close={this.onClose}
        breadCrumbPaths={breadcrumbPaths}
        onSubmitFail={this.onSubmitFail}
        datamartId={datamartId}
      />
    ) : (
      <Layout className="edit-layout">
        <FormLayoutActionbar {...actionBarProps} />
        <DatamartSelector onSelect={this.onDatamartSelect} />
      </Layout>
    );
  }
}

const mapStateToProps = (state: any) => ({
  workspace: getWorkspace(state),
  hasFeature: FeatureSelectors.hasFeature(state),
});

export default compose(
  withRouter,
  injectIntl,
  injectDatamart,
  connect(mapStateToProps),
  injectNotifications,
)(SiteEditPage);

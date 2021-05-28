import * as React from 'react';
import _ from 'lodash';
import { compose } from 'recompose';
import queryString from 'query-string';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { Loading } from '@mediarithmics-private/mcs-components-library';
import AudienceBuilderContainer from './AudienceBuilderContainer';
import {
  AudienceBuilderFormData,
  AudienceBuilderParametricPredicateNode,
  AudienceBuilderQueryDocument,
  AudienceBuilderResource,
  AudienceBuilderParametricPredicateGroupNode,
} from '../../../models/audienceBuilder/AudienceBuilderResource';
import { UserQuerySegment } from '../../../models/audiencesegment/AudienceSegmentResource';
import { lazyInject } from '../../../config/inversify.config';
import { IAudienceBuilderService } from '../../../services/AudienceBuilderService';
import { TYPES } from '../../../constants/types';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import { INITIAL_AUDIENCE_BUILDER_FORM_DATA } from './constants';
import { IQueryService } from '../../../services/QueryService';
import { IAudienceFeatureService } from '../../../services/AudienceFeatureService';
import { IAudienceSegmentService } from '../../../services/AudienceSegmentService';
import { withRouter, RouteComponentProps } from 'react-router';
import { NewUserQuerySimpleFormData } from '../../QueryTool/SaveAs/NewUserQuerySegmentSimpleForm';
import AudienceBuilderActionbar from './AudienceBuilderActionbar';
import { calculateDefaultTtl } from '../Segments/Edit/domain';
import { InjectedWorkspaceProps, injectWorkspace } from '../../Datamart';
import { AudienceFeatureResource } from '../../../models/audienceFeature';
import { notifyError } from '../../../redux/Notifications/actions';
import { ITagService } from '../../../services/TagService';

interface State {
  selectedAudienceBuilder?: AudienceBuilderResource;
  formData: AudienceBuilderFormData;
  isLoading: boolean;
}

type Props = InjectedIntlProps &
  InjectedNotificationProps &
  InjectedWorkspaceProps &
  RouteComponentProps<{ organisationId: string }>;

class AudienceBuilderPage extends React.Component<Props, State> {
  @lazyInject(TYPES.IAudienceFeatureService)
  private _audienceFeatureService: IAudienceFeatureService;

  @lazyInject(TYPES.IAudienceSegmentService)
  private _audienceSegmentService: IAudienceSegmentService;

  @lazyInject(TYPES.IQueryService)
  private _queryService: IQueryService;

  @lazyInject(TYPES.IAudienceBuilderService)
  private _audienceBuilderService: IAudienceBuilderService;

  @lazyInject(TYPES.ITagService)
  private _tagService: ITagService;

  constructor(props: Props) {
    super(props);

    this.state = {
      isLoading: true,
      formData: INITIAL_AUDIENCE_BUILDER_FORM_DATA,
    };
  }

  componentDidMount() {
    const {
      location: { search },
    } = this.props;

    const audienceBuilderId = queryString.parse(search).audienceBuilderId;
    const datamartId = queryString.parse(search).datamartId;
    if (audienceBuilderId) {
      this.setAudienceBuilder(datamartId, audienceBuilderId);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      match: {
        params: { organisationId },
      },
      location: { search },
      history,
    } = this.props;
    const {
      match: {
        params: { organisationId: prevOrganisationId },
      },
      location: { search: prevSearch },
    } = prevProps;
    const audienceBuilderId = queryString.parse(search).audienceBuilderId;
    const datamartId = queryString.parse(search).datamartId;
    const prevAudienceBuilderId = queryString.parse(prevSearch).audienceBuilderId;
    const prevDatamartId = queryString.parse(prevSearch).datamartId;
    if (!audienceBuilderId || !datamartId || organisationId !== prevOrganisationId) {
      history.push(`/v2/o/${organisationId}/audience/segment-builder-selector`);
    } else if (datamartId !== prevDatamartId || audienceBuilderId !== prevAudienceBuilderId) {
      this.setAudienceBuilder(datamartId, audienceBuilderId);
    }
  }

  setAudienceBuilder = (datamartId: string, audienceBuilderId: string) => {
    this._audienceBuilderService
      .getAudienceBuilder(datamartId, audienceBuilderId)
      .then(res => {
        this.setState({
          selectedAudienceBuilder: res.data,
        });
        return res.data;
      })
      .then(audienceBuilder => {
        const demographicsFeaturePromises = audienceBuilder.demographics_features_ids.map(id => {
          return this._audienceFeatureService.getAudienceFeature(datamartId, id);
        });

        const setUpPredicate = (
          feature: AudienceFeatureResource,
        ): AudienceBuilderParametricPredicateNode => {
          return {
            type: 'PARAMETRIC_PREDICATE',
            parametric_predicate_id: feature.id,
            parameters: {},
          };
        };

        const setUpDefaultPredicates = (
          features: AudienceFeatureResource[],
        ): AudienceBuilderParametricPredicateGroupNode[] => {
          return features.map(feature => {
            return {
              expressions: [setUpPredicate(feature)],
            };
          });
        };

        Promise.all(demographicsFeaturePromises)
          .then(resp => {
            const defaultFeatures = resp.map(r => {
              return r.data;
            });

            this.setState({
              selectedAudienceBuilder: audienceBuilder,
              formData: {
                include: setUpDefaultPredicates(defaultFeatures),
                exclude: [],
              },
              isLoading: false,
            });
          })
          .catch(err => {
            this.setState({
              selectedAudienceBuilder: audienceBuilder,
              formData: INITIAL_AUDIENCE_BUILDER_FORM_DATA,
              isLoading: false,
            });
            notifyError(err);
          });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        });
        this.props.notifyError(error);
      });
  };

  audienceBuilderActionbar = (query: AudienceBuilderQueryDocument, datamartId: string) => {
    const { match, history } = this.props;
    const { selectedAudienceBuilder } = this.state;
    const saveAudience = (userQueryFormData: NewUserQuerySimpleFormData) => {
      const { name, technical_name, persisted } = userQueryFormData;

      return this._queryService
        .createQuery(
          datamartId,
          {
            query_language: 'JSON_OTQL',
            query_language_subtype: 'PARAMETRIC',
            query_text: JSON.stringify(query),
          },
          { parameterized: true },
        )
        .then(res => {
          const userQuerySegment: Partial<UserQuerySegment> = {
            datamart_id: datamartId,
            type: 'USER_QUERY',
            name,
            technical_name,
            persisted,
            default_ttl: calculateDefaultTtl(userQueryFormData),
            query_id: res.data.id,
            segment_editor: 'AUDIENCE_BUILDER',
            audience_builder_id: selectedAudienceBuilder?.id,
          };
          return this._audienceSegmentService.saveSegment(
            match.params.organisationId,
            userQuerySegment,
          );
        })
        .then(res => {
          this._tagService.sendEvent('create_segment', 'Segment Builder', 'Save Segment');
          history.push(`/v2/o/${match.params.organisationId}/audience/segments/${res.data.id}`);
        });
    };

    return (
      <AudienceBuilderActionbar save={saveAudience} audienceBuilder={selectedAudienceBuilder} />
    );
  };

  selectBuilderContainer(audienceBuilder: AudienceBuilderResource) {
    const { formData } = this.state;

    return (
      <AudienceBuilderContainer
        initialValues={formData}
        audienceBuilder={audienceBuilder}
        renderActionBar={this.audienceBuilderActionbar}
      />
    );
  }

  render() {
    const { selectedAudienceBuilder, isLoading } = this.state;

    if (isLoading) {
      return <Loading isFullScreen={true} />;
    }

    return selectedAudienceBuilder ? this.selectBuilderContainer(selectedAudienceBuilder) : null;
  }
}

export default compose(
  withRouter,
  injectIntl,
  injectNotifications,
  injectWorkspace,
)(AudienceBuilderPage);

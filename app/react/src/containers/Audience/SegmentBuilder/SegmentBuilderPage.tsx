import * as moment from 'moment';
import queryString from 'query-string';
import * as React from 'react';
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { UserQuerySegment } from '../../../models/audiencesegment/AudienceSegmentResource';
import { DatamartResource } from '../../../models/datamart/DatamartResource';
import { QueryDocument } from '../../../models/datamart/graphdb/QueryDocument';
import ExportService from '../../../services/Library/ExportService';
import { DatamartSelector } from '../../Datamart';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../Notifications/injectNotifications';
import JSONQLBuilderContainer from '../../QueryTool/JSONOTQL/JSONQLBuilderContainer';
import { QueryContainer } from '../../QueryTool/SelectorQL/AngularQueryToolWidget';
import SelectorQLBuilderContainer from '../../QueryTool/SelectorQL/SelectorQLBuilderContainer';
import { NewUserQuerySimpleFormData } from '../../QueryTool/SaveAs/NewUserQuerySegmentSimpleForm';
import SaveQueryAsActionBar from '../../QueryTool/SaveAs/SaveQueryAsActionBar';
import { NewExportSimpleFormData } from '../../QueryTool/SaveAs/NewExportSimpleForm';
import QueryService from '../../../services/QueryService';
import { IAudienceSegmentService } from '../../../services/AudienceSegmentService';
import { injectable } from 'inversify';
import { TYPES } from '../../../constants/types';
import { lazyInject } from '../../../config/inversify.config';

export interface QueryBuilderPageRouteParams {
  organisationId: string;
}

interface MapStateToProps {
  connectedUser: any;
}

type Props = RouteComponentProps<QueryBuilderPageRouteParams> &
  MapStateToProps &
  InjectedNotificationProps &
  InjectedIntlProps;

const messages = defineMessages({
  segmentBuilder: {
    id: 'segment-builder-page-actionbar-title',
    defaultMessage: 'Segment Builder',
  },
});

@injectable()
class SegmentBuilderPage extends React.Component<Props> {
  @lazyInject(TYPES.IAudienceSegmentService)
  private _audienceSegmentService: IAudienceSegmentService;

  render() {
    const { intl, connectedUser, location, history, match } = this.props;

    const handleOnSelectDatamart = (selection: DatamartResource) => {
      // this.setState({ datamart: selection });
      history.push({
        pathname: location.pathname,
        search: queryString.stringify({ datamartId: selection.id }),
      });
    };

    let selectedDatamart: DatamartResource | undefined;

    const orgWp = connectedUser.workspaces.find(
      (w: any) => w.organisation_id === this.props.match.params.organisationId,
    );

    const datamartIdQueryString = queryString.parse(location.search).datamartId;

    if (orgWp.datamarts && orgWp.datamarts.length === 1) {
      selectedDatamart = orgWp.datamarts[0];
    }

    if (datamartIdQueryString) {
      selectedDatamart = orgWp.datamarts.find(
        (d: DatamartResource) => d.id === datamartIdQueryString,
      );
    }

    const jsonQLActionbar = (query: QueryDocument, datamartId: string) => {
      const saveAsUserQuery = (segmentFormData: NewUserQuerySimpleFormData) => {
        const { name, technical_name, persisted } = segmentFormData;

        return QueryService.createQuery(datamartId, {
          query_language: 'JSON_OTQL',
          query_text: JSON.stringify(query),
        })
          .then(res => {
            const userQuerySegment: Partial<UserQuerySegment> = {
              datamart_id: datamartId,
              type: 'USER_QUERY',
              name,
              technical_name,
              persisted,
              default_ttl: calculateDefaultTtl(segmentFormData),
              query_id: res.data.id,
            };
            return this._audienceSegmentService.saveSegment(
              match.params.organisationId,
              userQuerySegment,
            );
          })
          .then(res => {
            history.push(
              `/v2/o/${match.params.organisationId}/audience/segments/${
                res.data.id
              }`,
            );
          });
      };
      return (
        <SaveQueryAsActionBar
          saveAsUserQuery={saveAsUserQuery}
          breadcrumb={[
            {
              name: intl.formatMessage(messages.segmentBuilder),
            },
          ]}
        />
      );
    };

    const selectorQLActionbar = (
      query: QueryContainer | null,
      datamartId: string,
    ) => {
      const saveAsUserQuery = (segmentFormData: NewUserQuerySimpleFormData) => {
        if (!query)
          return Promise.reject(
            new Error("angular query container isn't loaded correctly"),
          );
        return query.saveOrUpdate().then(queryResource => {
          const { name, technical_name, persisted } = segmentFormData;
          const userQuerySegment: Partial<UserQuerySegment> = {
            datamart_id: datamartId,
            type: 'USER_QUERY',
            name,
            technical_name,
            persisted,
            default_ttl: calculateDefaultTtl(segmentFormData),
            query_id: queryResource.id,
          };
          return this._audienceSegmentService
            .saveSegment(match.params.organisationId, userQuerySegment)
            .then(res => {
              history.push(
                `/v2/o/${match.params.organisationId}/audience/segments/${
                  res.data.id
                }`,
              );
            });
        });
      };
      const saveAsExport = (exportFormData: NewExportSimpleFormData) => {
        if (!query)
          return Promise.reject(
            new Error("angular query container isn't loaded correctly"),
          );
        return query.saveOrUpdate().then(queryResource => {
          return ExportService.createExport(match.params.organisationId, {
            name: exportFormData.name,
            output_format: exportFormData.outputFormat,
            query_id: queryResource.id,
            type: 'QUERY',
          }).then(res => {
            history.push(
              `/v2/o/${match.params.organisationId}/datastudio/exports/${
                res.data.id
              }`,
            );
          });
        });
      };
      return (
        <SaveQueryAsActionBar
          saveAsUserQuery={saveAsUserQuery}
          saveAsExort={saveAsExport}
          breadcrumb={[
            {
              name: intl.formatMessage(messages.segmentBuilder),
            },
          ]}
        />
      );
    };

    // TODO DatamartSelector could render React.Children({ selectedDatamart })
    const style: React.CSSProperties = { height: '100%', display: 'flex' };
    return (
      <div style={style}>
        {!selectedDatamart && (
          <DatamartSelector
            onSelectDatamart={handleOnSelectDatamart}
            actionbarProps={{
              paths: [
                {
                  name: intl.formatMessage(messages.segmentBuilder),
                },
              ],
            }}
          />
        )}
        {selectedDatamart &&
          selectedDatamart.storage_model_version === 'v201709' && (
            <JSONQLBuilderContainer
              datamartId={selectedDatamart.id}
              renderActionBar={jsonQLActionbar}
            />
          )}
        {selectedDatamart &&
          selectedDatamart.storage_model_version === 'v201506' && (
            <SelectorQLBuilderContainer
              datamartId={selectedDatamart.id}
              renderActionBar={selectorQLActionbar}
              title={intl.formatMessage(messages.segmentBuilder)}
            />
          )}
      </div>
    );
  }
}

export default compose(
  injectIntl,
  withRouter,
  injectNotifications,
  connect((state: any) => ({
    connectedUser: state.session.connectedUser,
  })),
)(SegmentBuilderPage);

function calculateDefaultTtl(formData: NewUserQuerySimpleFormData) {
  if (formData.defaultLifetime && formData.defaultLifetimeUnit) {
    return moment
      .duration(Number(formData.defaultLifetime), formData.defaultLifetimeUnit)
      .asMilliseconds();
  }
  return undefined;
}

import * as React from 'react';
import { IQueryService, QueryService } from '../../services/QueryService';
import _ from 'lodash';
import { Alert, Spin } from 'antd';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { QueryCreateRequest, QueryResource } from '../../models/datamart/DatamartResource';
import DashboardLayout from '../dashboard-layout';
import { DashboardContentSchema } from '../../models/customDashboards/customDashboards';
import {
  isStandardSegmentBuilderQueryDocument,
  StandardSegmentBuilderQueryDocument,
} from '../../models/standardSegmentBuilder/StandardSegmentBuilderResource';
import {
  AudienceSegmentShape,
  UserQuerySegment,
} from '../../models/audienceSegment/AudienceSegmentResource';
import { AbstractScope, QueryScope, SegmentScope } from '../../models/datamart/graphdb/Scope';
import { isAudienceSegmentShape, isUserQuerySegment } from '../../models/Segments/Edit/domain';
import messages from './messages';
import { InjectedDrawerProps } from '../..';
import { injectDrawer } from '../drawer';
import {
  QueryExecutionSource,
  QueryExecutionSubSource,
} from '../../models/platformMetrics/QueryExecutionSource';

interface ScopedDashboardLayoutProps {
  datamartId: string;
  organisationId: string;
  schema: DashboardContentSchema;
  source?: AudienceSegmentShape | StandardSegmentBuilderQueryDocument;
  editable: boolean;
  updateState?: (d: DashboardContentSchema) => void;
  onShowDashboard?: () => void;
  queryExecutionSource: QueryExecutionSource;
  queryExecutionSubSource: QueryExecutionSubSource;
}

type Props = ScopedDashboardLayoutProps & InjectedIntlProps & InjectedDrawerProps;

interface ScopedDashboardLayoutState {
  scope?: AbstractScope;
  isLoading: boolean;
  hasError: boolean;
}
type State = ScopedDashboardLayoutState;

class ScopedDashboardLayout extends React.Component<Props, State> {
  private _queryService: IQueryService = new QueryService();

  constructor(props: Props) {
    super(props);
    this.state = {
      scope: undefined,
      isLoading: true,
      hasError: false,
    };
  }

  private adaptScope(
    datamartId: string,
    source?: AudienceSegmentShape | StandardSegmentBuilderQueryDocument,
  ): Promise<AbstractScope | undefined> {
    if (!source) return Promise.resolve(undefined);

    if (isAudienceSegmentShape(source)) {
      if (isUserQuerySegment(source) && !source.persisted) {
        const userQuerySegment = source as UserQuerySegment;
        return this._queryService
          .getQuery(userQuerySegment.datamart_id, userQuerySegment.query_id as string)
          .then(res => {
            return {
              type: 'SEGMENT',
              segmentId: userQuerySegment.id,
              query: res.data,
            };
          });
      } else {
        const segmentSource = source as AudienceSegmentShape;
        const scope: SegmentScope = {
          type: 'SEGMENT',
          segmentId: segmentSource.id,
        };
        return Promise.resolve(scope);
      }
    } else if (isStandardSegmentBuilderQueryDocument(source)) {
      const standardSegmentBuilderQueryDocument = source as StandardSegmentBuilderQueryDocument;
      const queryResource: QueryCreateRequest = {
        datamart_id: datamartId,
        query_language: 'JSON_OTQL',
        query_text: JSON.stringify(standardSegmentBuilderQueryDocument),
        query_language_subtype: 'PARAMETRIC',
      };
      const scope: QueryScope = {
        type: 'QUERY',
        query: queryResource as QueryResource,
      };
      return Promise.resolve(scope);
    }
    return Promise.resolve(undefined);
  }

  private updateScope(
    datamartId: string,
    source?: AudienceSegmentShape | StandardSegmentBuilderQueryDocument,
  ) {
    this.adaptScope(datamartId, source)
      .then(res => {
        this.setState({
          isLoading: false,
          scope: res,
        });
      })
      .catch(e => {
        this.setState({
          isLoading: false,
          hasError: true,
        });
      });
  }

  componentDidMount() {
    const { source, datamartId } = this.props;
    this.updateScope(datamartId, source);
  }

  componentDidUpdate(prevProps: Props) {
    const { datamartId, source } = this.props;
    const { source: prevSource } = prevProps;
    if (!_.isEqual(source, prevSource)) {
      this.setState({
        isLoading: true,
      });
      this.updateScope(datamartId, source);
    }
  }

  render() {
    const {
      datamartId,
      organisationId,
      schema,
      intl,
      editable,
      updateState,
      onShowDashboard,
      queryExecutionSource,
      queryExecutionSubSource,
    } = this.props;
    const { scope, isLoading, hasError } = this.state;

    const handleOnShowDashboard = () => {
      if (onShowDashboard) onShowDashboard();
    };

    return hasError ? (
      <Alert type='error' message={intl.formatMessage(messages.errorLoadingScope)} />
    ) : isLoading ? (
      <Spin size={'small'} />
    ) : (
      <DashboardLayout
        intl={intl}
        editable={editable}
        updateState={updateState}
        datamart_id={datamartId}
        organisationId={organisationId}
        schema={schema}
        scope={scope}
        openNextDrawer={this.props.openNextDrawer}
        closeNextDrawer={this.props.closeNextDrawer}
        onShowDashboard={handleOnShowDashboard}
        queryExecutionSource={queryExecutionSource}
        queryExecutionSubSource={queryExecutionSubSource}
      />
    );
  }
}

export default compose<Props, ScopedDashboardLayoutProps>(
  injectIntl,
  injectDrawer,
)(ScopedDashboardLayout);

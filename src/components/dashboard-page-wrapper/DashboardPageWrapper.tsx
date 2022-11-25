import * as React from 'react';
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl';
import { compose } from 'recompose';
import { LabeledValue } from 'antd/lib/select';
import DashboardPage from './DashboardPage';
import { Loading, Error } from '@mediarithmics-private/mcs-components-library';
import { DataListResponse } from '../../services/ApiService';
import { InjectedFeaturesProps, injectFeatures } from '../Features';
import injectNotifications, {
  InjectedNotificationProps,
} from '../notifications/injectNotifications';
import {
  DashboardPageContent,
  DashboardWrapperProps,
  DataFileDashboardResource,
  DatamartUsersAnalyticsWrapperProps,
} from '../../models/dashboards/dashboardsModel';
import { StandardSegmentBuilderQueryDocument } from '../../models/standardSegmentBuilder/StandardSegmentBuilderResource';
import { AudienceSegmentShape } from '../../models/audienceSegment/AudienceSegmentResource';
import { InjectedDrawerProps } from '../..';
import { injectDrawer } from '../drawer';
import cuid from 'cuid';
import {
  QueryExecutionSource,
  QueryExecutionSubSource,
} from '../../models/platformMetrics/QueryExecutionSource';
import { DashboardContentSchema } from '../../models/customDashboards/customDashboards';

export const messages = defineMessages({
  comingSoon: {
    id: 'audience.home.dashboard',
    defaultMessage: 'Coming Soon...',
  },
});
interface DashboardPageWrapperProps {
  datamartId: string;
  organisationId: string;
  fetchDataFileDashboards?: () => Promise<DataListResponse<DataFileDashboardResource>>;
  fetchApiDashboards?: () => Promise<DashboardPageContent[]>;
  isFullScreenLoading?: boolean;
  datamartAnalyticsConfig?: DatamartUsersAnalyticsWrapperProps[];
  disableAllUserFilter?: boolean;
  defaultSegment?: LabeledValue;
  source?: AudienceSegmentShape | StandardSegmentBuilderQueryDocument;
  queryExecutionSource: QueryExecutionSource;
  queryExecutionSubSource: QueryExecutionSubSource;
  tabsClassname?: string;
  className?: string;
  segmentDashboardTechnicalInformation?: React.ReactNode;
  cohortLookalikeCalibration?: React.ReactNode;
  defaultDashboardContent?: DashboardContentSchema;
  DatamartUsersAnalyticsWrapper?: React.ComponentClass<DatamartUsersAnalyticsWrapperProps>;
  DashboardWrapper?: React.ComponentClass<DashboardWrapperProps>;
  contextualTargetingTab?: React.ReactNode;
  onShowDashboard?: (dpc: DashboardPageContent) => void;
  onFinishLoading?: (hasDashboards: boolean) => void;
  defaultDashboard?: DashboardPageContent;
}

type Props = DashboardPageWrapperProps &
  InjectedFeaturesProps &
  InjectedNotificationProps &
  WrappedComponentProps &
  InjectedDrawerProps;

interface State {
  isLoading: boolean;
  shouldDisplayComingSoon: boolean;
  dataFileDashboards: DataFileDashboardResource[];
  apiDashboards: DashboardPageContent[];
}

class DashboardPageWrapper extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      dataFileDashboards: [],
      isLoading: true,
      shouldDisplayComingSoon: true,
      apiDashboards: [],
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps: Props) {
    const { organisationId } = this.props;

    if (organisationId !== prevProps.organisationId) {
      this.setState(
        {
          dataFileDashboards: [],
          isLoading: true,
          apiDashboards: [],
        },
        () => this.loadData(),
      );
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { dataFileDashboards: currentDataFileDashboards, apiDashboards: currentApiDashboards } =
      this.state;
    const { dataFileDashboards: nextDataFileDashboards, apiDashboards: nextApiDashboards } =
      nextState;
    const {
      source: currentSource,
      defaultSegment: currentDefaultSegment,
      organisationId: currentOrganisationId,
    } = this.props;
    const {
      source: nextSource,
      defaultSegment: nextDefaultSegment,
      organisationId: nextOganisationId,
    } = nextProps;

    const shouldUpdate =
      currentDataFileDashboards !== nextDataFileDashboards ||
      currentApiDashboards !== nextApiDashboards ||
      currentSource !== nextSource ||
      currentDefaultSegment !== nextDefaultSegment ||
      currentOrganisationId !== nextOganisationId;

    return shouldUpdate;
  }

  loadData = () => {
    const {
      hasFeature,
      defaultDashboardContent,
      datamartId,
      onFinishLoading,
      fetchDataFileDashboards,
      fetchApiDashboards,
    } = this.props;
    const defaultContentForApiDashboards = datamartId === '1500';

    const promises: Array<
      Promise<DataListResponse<DataFileDashboardResource> | DashboardPageContent[]>
    > = fetchDataFileDashboards ? [fetchDataFileDashboards()] : [];

    if (hasFeature('dashboards-new-engine') && fetchApiDashboards)
      promises.push(fetchApiDashboards());

    Promise.all(promises)
      .then(res => {
        const filteredApiDashboards = hasFeature('dashboards-new-engine')
          ? (res[res.length > 1 ? 1 : 0] as DashboardPageContent[]).map(dpc => {
              if (!dpc.dashboardContent && defaultContentForApiDashboards) {
                const defaultContent: DashboardPageContent = {
                  dashboardRegistrationId: dpc.dashboardRegistrationId,
                  scopes: dpc.scopes,
                  title: dpc.title,
                  dashboardContent: defaultDashboardContent,
                };
                return defaultContent;
              } else return dpc;
            })
          : [];

        const shouldDisplayComingSoon = this.shouldDisplayComingSoon(
          false,
          (res[0] as DataListResponse<DataFileDashboardResource>).data,
          filteredApiDashboards,
        );

        if (onFinishLoading) onFinishLoading(!shouldDisplayComingSoon);

        this.setState({
          isLoading: false,
          dataFileDashboards: (res[0] as DataListResponse<DataFileDashboardResource>).data,
          shouldDisplayComingSoon: shouldDisplayComingSoon,
          apiDashboards: filteredApiDashboards,
        });
      })
      .catch(err => {
        this.props.notifyError(err);
        this.setState({
          isLoading: false,
          shouldDisplayComingSoon: false,
        });
      });
  };

  shouldDisplayComingSoon = (
    isLoading: boolean,
    dataFileDashboards: DataFileDashboardResource[],
    apiDashboards: DashboardPageContent[],
  ): boolean => {
    const { hasFeature, contextualTargetingTab, cohortLookalikeCalibration } = this.props;

    const shouldDisplayAnalyticsFeature = hasFeature(
      'audience-dashboards-datamart_users_analytics',
    );

    const shouldDisplayContextualFeature =
      hasFeature('segments-contextual-targeting') && contextualTargetingTab !== undefined;

    const shouldDisplayCohortFeature =
      hasFeature('audience-segments-cohort-lookalike') && cohortLookalikeCalibration !== undefined;

    return (
      !isLoading &&
      dataFileDashboards &&
      dataFileDashboards.length === 0 &&
      !shouldDisplayAnalyticsFeature &&
      !shouldDisplayContextualFeature &&
      !shouldDisplayCohortFeature &&
      (apiDashboards && apiDashboards.length) === 0
    );
  };

  render() {
    const {
      hasFeature,
      datamartId,
      organisationId,
      source,
      tabsClassname,
      disableAllUserFilter,
      defaultSegment,
      className,
      isFullScreenLoading,
      datamartAnalyticsConfig,
      intl,
      segmentDashboardTechnicalInformation,
      cohortLookalikeCalibration,
      DatamartUsersAnalyticsWrapper,
      DashboardWrapper,
      contextualTargetingTab,
      onShowDashboard,
      defaultDashboard,
      queryExecutionSource,
      queryExecutionSubSource,
    } = this.props;

    const { isLoading, dataFileDashboards, apiDashboards, shouldDisplayComingSoon } = this.state;

    if (shouldDisplayComingSoon) {
      if (segmentDashboardTechnicalInformation) return segmentDashboardTechnicalInformation;

      return <Error message={intl.formatMessage(messages.comingSoon)} />;
    }

    if (isLoading) {
      if (isFullScreenLoading)
        return <Loading className='m-t-20' isFullScreen={isFullScreenLoading} />;
      else return <Loading isFullScreen={!!isFullScreenLoading} />;
    } else {
      let dataFileDashboardsOpt: DataFileDashboardResource[] | undefined = dataFileDashboards
        ? dataFileDashboards.map(d => {
            d.name = '';
            return d;
          })
        : undefined;
      let apiDashboardsOpt: DashboardPageContent[] | undefined;

      if (hasFeature('dashboards-new-engine')) {
        dataFileDashboardsOpt = dataFileDashboards;
        apiDashboardsOpt = apiDashboards;
      }

      const handleOnShowDashboard = (d: DashboardPageContent) => {
        if (onShowDashboard) onShowDashboard(d);
      };

      return (
        <DashboardPage
          uid={cuid()}
          className={`mcs-dashboardPageContainer ${className}`}
          datamartId={datamartId}
          organisationId={organisationId}
          apiDashboards={apiDashboardsOpt}
          dataFileDashboards={dataFileDashboardsOpt}
          datamartAnalyticsConfig={
            hasFeature('audience-dashboards-datamart_users_analytics')
              ? datamartAnalyticsConfig
              : []
          }
          source={source}
          queryExecutionSource={queryExecutionSource}
          queryExecutionSubSource={queryExecutionSubSource}
          tabsClassname={tabsClassname}
          disableAllUserFilter={disableAllUserFilter}
          defaultSegment={defaultSegment}
          segmentDashboardTechnicalInformation={segmentDashboardTechnicalInformation}
          cohortLookalikeCalibration={cohortLookalikeCalibration}
          DashboardWrapper={DashboardWrapper}
          DatamartUsersAnalyticsWrapper={DatamartUsersAnalyticsWrapper}
          contextualTargetingTab={contextualTargetingTab}
          onShowDashboard={handleOnShowDashboard}
          defaultDashboard={defaultDashboard}
        />
      );
    }
  }
}

export default compose<Props, DashboardPageWrapperProps>(
  injectFeatures,
  injectIntl,
  injectNotifications,
  injectDrawer,
)(DashboardPageWrapper);

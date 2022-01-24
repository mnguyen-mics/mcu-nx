import * as React from 'react';
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl';
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
  DashboardContentSections,
  DashboardPageContent,
  DashboardWrapperProps,
  DataFileDashboardResource,
  DatamartUsersAnalyticsWrapperProps,
} from '../../models/dashboards/old-dashboards-model';
import { StandardSegmentBuilderQueryDocument } from '../../models/standardSegmentBuilder/StandardSegmentBuilderResource';
import { AudienceSegmentShape } from '../../models/audienceSegment/AudienceSegmentResource';
import { InjectedDrawerProps } from '../..';
import { injectDrawer } from '../drawer';

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
  tabsClassname?: string;
  className?: string;
  segmentDashboardTechnicalInformation?: React.ReactNode;
  defaultDashboardContent?: DashboardContentSections;
  DatamartUsersAnalyticsWrapper?: React.ComponentClass<DatamartUsersAnalyticsWrapperProps>;
  DashboardWrapper?: React.ComponentClass<DashboardWrapperProps>;
}

type Props = DashboardPageWrapperProps &
  InjectedFeaturesProps &
  InjectedNotificationProps &
  InjectedIntlProps &
  InjectedDrawerProps;

interface State {
  isLoading: boolean;
  dataFileDashboards: DataFileDashboardResource[];
  apiDashboards: DashboardPageContent[];
}

class DashboardPageWrapper extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      dataFileDashboards: [],
      isLoading: true,
      apiDashboards: [],
    };
  }

  componentDidMount() {
    const { datamartId, fetchDataFileDashboards, fetchApiDashboards } = this.props;
    this.loadData(datamartId === '1500', fetchDataFileDashboards, fetchApiDashboards);
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { dataFileDashboards: currentDataFileDashboards, apiDashboards: currentApiDashboards } =
      this.state;
    const { dataFileDashboards: nextDataFileDashboards, apiDashboards: nextApiDashboards } =
      nextState;
    const { source: currentSource, defaultSegment: currentDefaultSegment } = this.props;
    const { source: nextSource, defaultSegment: nextDefaultSegment } = nextProps;

    const shouldUpdate =
      currentDataFileDashboards !== nextDataFileDashboards ||
      currentApiDashboards !== nextApiDashboards ||
      currentSource !== nextSource ||
      currentDefaultSegment !== nextDefaultSegment;

    return shouldUpdate;
  }

  loadData = (
    defaultContentForApiDashboards: boolean,
    fetchDataFileDashboardsFunc?: () => Promise<DataListResponse<DataFileDashboardResource>>,
    fetchApiDashboardsFunc?: () => Promise<DashboardPageContent[]>,
  ) => {
    const { hasFeature, defaultDashboardContent } = this.props;

    const promises: Array<
      Promise<DataListResponse<DataFileDashboardResource> | DashboardPageContent[]>
    > = fetchDataFileDashboardsFunc ? [fetchDataFileDashboardsFunc()] : [];

    if (hasFeature('dashboards-new-engine') && fetchApiDashboardsFunc)
      promises.push(fetchApiDashboardsFunc());

    Promise.all(promises)
      .then(res => {
        const filteredApiDashboards = hasFeature('dashboards-new-engine')
          ? (res[res.length > 1 ? 1 : 0] as DashboardPageContent[]).map(dpc => {
              if (!dpc.dashboardContent && defaultContentForApiDashboards) {
                const defaultContent: DashboardPageContent = {
                  title: dpc.title,
                  dashboardContent: defaultDashboardContent,
                };
                return defaultContent;
              } else return dpc;
            })
          : [];

        if (filteredApiDashboards && filteredApiDashboards.length === 0)
          this.setState({
            isLoading: false,
            dataFileDashboards: (res[0] as DataListResponse<DataFileDashboardResource>).data,
          });
        else {
          this.setState({
            dataFileDashboards: (res[0] as DataListResponse<DataFileDashboardResource>).data,
            apiDashboards: filteredApiDashboards,
            isLoading: false,
          });
        }
      })
      .catch(err => {
        this.props.notifyError(err);
        this.setState({
          isLoading: false,
        });
      });
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
      DatamartUsersAnalyticsWrapper,
      DashboardWrapper,
    } = this.props;

    const { isLoading, dataFileDashboards, apiDashboards } = this.state;

    const shouldDisplayAnalyticsFeature = hasFeature(
      'audience-dashboards-datamart_users_analytics',
    );

    if (
      !isLoading &&
      dataFileDashboards &&
      dataFileDashboards.length === 0 &&
      !shouldDisplayAnalyticsFeature &&
      (apiDashboards && apiDashboards.length) === 0
    ) {
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

      return (
        <DashboardPage
          className={className}
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
          tabsClassname={tabsClassname}
          disableAllUserFilter={disableAllUserFilter}
          defaultSegment={defaultSegment}
          segmentDashboardTechnicalInformation={segmentDashboardTechnicalInformation}
          DashboardWrapper={DashboardWrapper}
          DatamartUsersAnalyticsWrapper={DatamartUsersAnalyticsWrapper}
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

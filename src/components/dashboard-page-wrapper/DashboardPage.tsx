import * as React from 'react';
import { compose } from 'recompose';
import { McsTabs } from '@mediarithmics-private/mcs-components-library';
import { LabeledValue } from 'antd/lib/select';
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';
import ScopedDashboardLayout from '../dashboard-page-wrapper/ScopedDashboardLayout';
import { InjectedFeaturesProps, injectFeatures } from '../Features';
import {
  DashboardPageContent,
  DashboardWrapperProps,
  DataFileDashboardResource,
  DatamartUsersAnalyticsWrapperProps,
} from '../../models/dashboards/old-dashboards-model';
import { StandardSegmentBuilderQueryDocument } from '../../models/standardSegmentBuilder/StandardSegmentBuilderResource';
import { AudienceSegmentShape } from '../../models/audienceSegment/AudienceSegmentResource';
import { injectDrawer } from '../drawer';
import { InjectedDrawerProps } from '../..';
import {
  QueryExecutionSource,
  QueryExecutionSubSource,
} from '../../models/platformMetrics/QueryExecutionSource';
import { McsTabsItem } from '@mediarithmics-private/mcs-components-library/lib/components/mcs-tabs/McsTabs';
import { RouteComponentProps, withRouter } from 'react-router';

export interface DashboardPageProps {
  dataFileDashboards?: DataFileDashboardResource[];
  datamartAnalyticsConfig?: DatamartUsersAnalyticsWrapperProps[];
  apiDashboards?: DashboardPageContent[];
  datamartId: string;
  organisationId: string;
  disableAllUserFilter?: boolean;
  defaultSegment?: LabeledValue;
  source?: AudienceSegmentShape | StandardSegmentBuilderQueryDocument;
  tabsClassname?: string;
  className?: string;
  segmentDashboardTechnicalInformation?: React.ReactNode;
  cohortLookalikeCalibration?: React.ReactNode;
  DatamartUsersAnalyticsWrapper?: React.ComponentClass<DatamartUsersAnalyticsWrapperProps>;
  DashboardWrapper?: React.ComponentClass<DashboardWrapperProps>;
  contextualTargetingTab?: React.ReactNode;
  onShowDashboard?: (dpc: DashboardPageContent) => void;
  defaultDashboard?: DashboardPageContent;
  uid?: string;
  queryExecutionSource: QueryExecutionSource;
  queryExecutionSubSource: QueryExecutionSubSource;
}
const messagesDashboardPage = defineMessages({
  technicalInformationTab: {
    id: 'dashboard.page.technical.information.tab',
    defaultMessage: 'Technical information',
  },
  cohortLookalikeCalibrationTab: {
    id: 'dashboard.page.cohort.calibration.tab',
    defaultMessage: 'Lookalike calibration',
  },
});

type Tabs = 'COHORT';

const TabMapKeys: { [t in Tabs]: string } = { COHORT: 'cohort_tab' };

type Props = DashboardPageProps &
  InjectedFeaturesProps &
  InjectedIntlProps &
  InjectedDrawerProps &
  RouteComponentProps<{}, {}, { tab?: Tabs }>;

type State = {
  activeKey?: string;
};

class DashboardPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { uid } = this.props;

    return (
      uid === undefined || uid !== nextProps.uid || nextState.activeKey !== this.state.activeKey
    );
  }

  componentDidUpdate(prevProps: Props) {
    const { location, history } = prevProps;

    if (location.state && location.state.tab) {
      this.setState({
        activeKey: TabMapKeys[location.state.tab as Tabs],
      });

      history.replace({ state: {} });
    }
  }

  getDashboardPageContent = (
    datamartId: string,
    organisationId: string,
    dataFileDashboards?: DataFileDashboardResource[],
    datamartAnalyticsConfig?: DatamartUsersAnalyticsWrapperProps[],
    apiDashboards?: DashboardPageContent[],
    disableAllUserFilter?: boolean,
    defaultSegment?: LabeledValue,
    tabsClassname?: string,
    source?: AudienceSegmentShape | StandardSegmentBuilderQueryDocument,
    segmentDashboardTechnicalInformation?: React.ReactNode,
    cohortLookalikeCalibration?: React.ReactNode,
  ) => {
    const {
      intl: { formatMessage },
      DashboardWrapper,
      DatamartUsersAnalyticsWrapper,
      contextualTargetingTab,
      onShowDashboard,
      defaultDashboard,
      queryExecutionSource,
      queryExecutionSubSource,
    } = this.props;

    const { activeKey } = this.state;

    const onTabClick = (key: string) => {
      this.setState({
        activeKey: key,
      });
    };

    const defaultContent = (
      <div>
        {DashboardWrapper &&
          dataFileDashboards &&
          dataFileDashboards.length > 0 &&
          dataFileDashboards.map(d => (
            <DashboardWrapper
              key={d.id}
              layout={d.components}
              title={d.name}
              datamartId={d.datamart_id}
              organisationId={organisationId}
              source={source}
              queryExecutionSource={queryExecutionSource}
              queryExecutionSubSource={queryExecutionSubSource}
            />
          ))}
        {DatamartUsersAnalyticsWrapper &&
          datamartAnalyticsConfig &&
          dataFileDashboards &&
          dataFileDashboards.length === 0 &&
          datamartAnalyticsConfig.map((conf, i) => {
            return (
              <DatamartUsersAnalyticsWrapper
                key={i.toString()}
                title={conf.title}
                subTitle={conf.subTitle}
                datamartId={conf.datamartId}
                organisationId={conf.organisationId}
                config={conf.config}
                showFilter={conf.showFilter}
                showDateRangePicker={conf.showDateRangePicker}
                disableAllUserFilter={disableAllUserFilter}
                defaultSegment={defaultSegment}
              />
            );
          })}
      </div>
    );

    if (apiDashboards) {
      apiDashboards.sort((a, b) => a.title.localeCompare(b.title));
    }
    // We want to place defaultDashboard in last position if it is defined
    // So sorting has to be done before
    if (defaultDashboard) {
      apiDashboards = apiDashboards ? apiDashboards.concat(defaultDashboard) : [defaultDashboard];
    }

    if (apiDashboards && apiDashboards.length > 0) {
      const dashboardTabs: McsTabsItem[] = apiDashboards
        .filter(dashboard => !!dashboard.dashboardContent)
        .map(dashboard => {
          const handleShowDashboard = () => {
            if (onShowDashboard) {
              onShowDashboard(dashboard);
            }
          };

          return {
            title: dashboard.title,
            display: dashboard.dashboardContent ? (
              <ScopedDashboardLayout
                datamartId={datamartId}
                schema={dashboard.dashboardContent}
                source={source}
                organisationId={organisationId}
                editable={false}
                onShowDashboard={handleShowDashboard}
                queryExecutionSource={queryExecutionSource}
                queryExecutionSubSource={queryExecutionSubSource}
              />
            ) : (
              <div />
            ),
          };
        });

      if (
        apiDashboards.length === 1 &&
        dataFileDashboards?.length === 0 &&
        datamartAnalyticsConfig?.length === 0 &&
        !segmentDashboardTechnicalInformation
      ) {
        const handleShowDashboard = () => {
          if (onShowDashboard && apiDashboards) onShowDashboard(apiDashboards[0]);
        };

        return apiDashboards[0].dashboardContent ? (
          <div className='m-t-40'>
            <ScopedDashboardLayout
              datamartId={datamartId}
              organisationId={organisationId}
              schema={apiDashboards[0].dashboardContent}
              source={source}
              editable={false}
              onShowDashboard={handleShowDashboard}
              queryExecutionSource={queryExecutionSource}
              queryExecutionSubSource={queryExecutionSubSource}
            />
          </div>
        ) : (
          <div />
        );
      }
      if (cohortLookalikeCalibration) {
        dashboardTabs.unshift({
          key: 'cohort_tab',
          title: formatMessage(messagesDashboardPage.cohortLookalikeCalibrationTab),
          display: <div>{cohortLookalikeCalibration}</div>,
        });
      }
      if (segmentDashboardTechnicalInformation) {
        dashboardTabs.unshift({
          title: formatMessage(messagesDashboardPage.technicalInformationTab),
          display: <div>{segmentDashboardTechnicalInformation}</div>,
        });
      }
      if (
        (dataFileDashboards && dataFileDashboards.length > 0) ||
        (datamartAnalyticsConfig && datamartAnalyticsConfig.length > 0)
      )
        dashboardTabs.push({
          title: dataFileDashboards?.length === 0 ? 'Activities analytics' : 'Old OTQL dashboard',
          display: defaultContent,
        });
      if (contextualTargetingTab) {
        dashboardTabs.push({
          title: 'Contextual Targeting',
          display: <div>{contextualTargetingTab}</div>,
        });
      }

      return dashboardTabs.length === 1 ? (
        <div>
          <h1>{dashboardTabs[0].title}</h1>
          {dashboardTabs[0].display}
        </div>
      ) : (
        <McsTabs
          destroyInactiveTabPane={true}
          items={dashboardTabs}
          className={tabsClassname}
          animated={false}
          activeKey={activeKey}
          onTabClick={onTabClick}
        />
      );
    } else if (segmentDashboardTechnicalInformation) {
      const dashboardTabs = [];
      dashboardTabs.push({
        title: 'Technical information',
        display: <div>{segmentDashboardTechnicalInformation}</div>,
      });
      if (cohortLookalikeCalibration) {
        dashboardTabs.push({
          key: 'cohort_tab',
          title: formatMessage(messagesDashboardPage.cohortLookalikeCalibrationTab),
          display: <div>{cohortLookalikeCalibration}</div>,
        });
      }
      if (contextualTargetingTab) {
        dashboardTabs.push({
          title: 'Contextual Targeting',
          display: <div>{contextualTargetingTab}</div>,
        });
      }

      if (
        (dataFileDashboards && dataFileDashboards.length > 0) ||
        (datamartAnalyticsConfig && datamartAnalyticsConfig.length > 0)
      ) {
        dashboardTabs.push({
          title: dataFileDashboards?.length === 0 ? 'Activities analytics' : 'Old OTQL dashboard',
          display: defaultContent,
        });

        // Move Contextual tab at the end of array
        // (Contextual tab has index #1)
        dashboardTabs.push(dashboardTabs.splice(1, 1)[0]);

        return (
          <McsTabs
            destroyInactiveTabPane={true}
            items={dashboardTabs}
            className={tabsClassname}
            animated={false}
            activeKey={activeKey}
            onTabClick={onTabClick}
          />
        );
      } else
        return dashboardTabs.length === 1 ? (
          <div>{segmentDashboardTechnicalInformation}</div>
        ) : (
          <McsTabs
            destroyInactiveTabPane={true}
            items={dashboardTabs}
            className={tabsClassname}
            activeKey={activeKey}
            animated={false}
            onTabClick={onTabClick}
          />
        );
    } else return defaultContent;
  };

  render() {
    const {
      dataFileDashboards,
      datamartAnalyticsConfig,
      apiDashboards,
      datamartId,
      organisationId,
      disableAllUserFilter,
      defaultSegment,
      tabsClassname,
      source,
      className,
      segmentDashboardTechnicalInformation,
      cohortLookalikeCalibration,
    } = this.props;

    return (
      <div className={className}>
        {this.getDashboardPageContent(
          datamartId,
          organisationId,
          dataFileDashboards,
          datamartAnalyticsConfig,
          apiDashboards,
          disableAllUserFilter,
          defaultSegment,
          tabsClassname,
          source,
          segmentDashboardTechnicalInformation,
          cohortLookalikeCalibration,
        )}
      </div>
    );
  }
}

export default compose<Props, DashboardPageProps>(
  injectFeatures,
  injectIntl,
  withRouter,
  injectDrawer,
)(DashboardPage);

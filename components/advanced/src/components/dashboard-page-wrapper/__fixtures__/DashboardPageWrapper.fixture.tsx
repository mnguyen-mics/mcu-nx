import React from 'react';
import { FetchMock } from '@react-mock/fetch';
import { LocalStorageMock } from '@react-mock/localstorage';
import { Provider } from 'react-redux';
import { container } from '../../../inversify/inversify.config';
import { IocProvider } from '../../../inversify/inversify.react';
import { HashRouter as Router } from 'react-router-dom';
import config from '../../../react-configuration';
import configureStore from '../../../redux/store';
import DashboardPageWrapper from '../DashboardPageWrapper';
import {
  MockedAnalytics,
  MockedAnalytics2,
  MockedAnalyticsMetrics,
  MockedCollectionMetrics,
  MockedData,
  MockedFetchDashboard,
  MockedFetchDashboardContent,
  MockedMetricData,
} from '../../chart-engine/MockedData';
import { IntlProvider } from 'react-intl';
import CustomDashboardService from '../../../services/CustomDashboardService';
import { DashboardContentSchema } from '../../../models/customDashboards/customDashboards';
const fetchmockOptions = [
  {
    matcher:
      'glob:/undefined/v1/dashboards?archived=false&searching_organisation_id=*&organisation_id=*',
    response: MockedFetchDashboard,
  },
  {
    matcher:
      'https://api.mediarithmics.com/v1/dashboards?archived=false&searching_organisation_id=1445&organisation_id=1445',
    response: MockedFetchDashboardContent,
  },
  {
    matcher: 'https://api.mediarithmics.com/v1/datamarts/555/queries/18',
    response: { data: { query_text: 'Select @count() from UserPoint', query_language: 'OTQL' } },
  },
  {
    matcher: 'glob:/undefined/v1/datamarts/1414/query_executions/otql?use_cache=true*',
    response: MockedData,
  },
  {
    matcher:
      'glob:/undefined/v1/datamarts/1415/query_executions/otql?precision=LOWER_PRECISION&use_cache=true*',
    response: MockedMetricData,
  },
  {
    matcher: 'glob:/undefined/v1/datamarts/1415/query_executions/otql?use_cache=true*',
    response: MockedMetricData,
  },
  {
    matcher: 'glob:/undefined/v1/datamarts/1414/user_activities_analytics*',
    response: MockedAnalytics,
  },
  {
    matcher: 'glob:/undefined/v1/datamarts/1417/user_activities_analytics*',
    response: MockedAnalytics2,
  },
  {
    matcher: 'glob:/undefined/v1/datamarts/1416/user_activities_analytics*',
    response: MockedAnalyticsMetrics,
  },
  {
    matcher: 'glob:/undefined/v1/platform_monitoring/collections*',
    response: MockedCollectionMetrics,
  },
];

export const defaultDashboardContent: DashboardContentSchema = {
  sections: [
    {
      title: 'General Information',
      cards: [
        {
          x: 0,
          y: 0,
          w: 12,
          h: 3,
          layout: 'vertical',
          charts: [
            {
              title: 'Device form factors',
              type: 'bars',
              dataset: {
                type: 'otql',
                query_id: '50171',
              } as any,
              options: {
                xKey: 'key',
                format: 'count',
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Demographics',
      cards: [
        {
          x: 0,
          y: 0,
          w: 12,
          h: 3,
          charts: [
            {
              title: 'Gender',
              type: 'pie',
              dataset: {
                type: 'otql',
                query_id: '50168',
              } as any,
              options: {
                legend: {
                  enabled: true,
                  position: 'right',
                },
                xKey: 'key',
                format: 'count',
              },
            },
          ],
        },
        {
          x: 0,
          y: 0,
          w: 6,
          h: 3,
          charts: [
            {
              title: 'Age range',
              type: 'pie',
              dataset: {
                type: 'otql',
                query_id: '50172',
              } as any,
            },
          ],
        },
        {
          x: 6,
          y: 0,
          w: 6,
          h: 3,
          charts: [
            {
              title: 'Social class',
              type: 'bars',
              dataset: {
                type: 'otql',
                query_id: '50169',
              } as any,
              options: {
                type: 'bars',
                xKey: 'key',
                format: 'count',
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Behavioral',
      cards: [
        {
          x: 0,
          y: 0,
          w: 6,
          h: 3,
          charts: [
            {
              title: 'Top 10 interests',
              type: 'radar',
              dataset: {
                type: 'otql',
                query_id: '50167',
              } as any,
              options: {
                xKey: 'key',
                format: 'count',
              },
            },
          ],
        },
        {
          x: 6,
          y: 0,
          w: 6,
          h: 3,
          charts: [
            {
              title: 'Top 10 purchase intents',
              type: 'bars',
              dataset: {
                type: 'otql',
                query_id: '50173',
              } as any,
              options: {
                xKey: 'key',
                format: 'count',
              },
            },
          ],
        },
      ],
    },
  ],
};

const _dashboardService = new CustomDashboardService();
const fetchApiDashboards = () => {
  return _dashboardService.getDashboardsPageContents('1445', { archived: false }, 'home');
};

(global as any).window.MCS_CONSTANTS = config;
const store = configureStore();
export default (
  <Provider store={store}>
    <IocProvider container={container}>
      <IntlProvider locale='en'>
        <Router>
          <LocalStorageMock items={{ access_token: 're4lt0k3n' }}>
            <FetchMock mocks={fetchmockOptions}>
              <DashboardPageWrapper
                datamartId={'555'}
                organisationId='504'
                defaultDashboardContent={defaultDashboardContent}
                fetchApiDashboards={fetchApiDashboards}
                queryExecutionSource='DASHBOARD'
                queryExecutionSubSource='ADVANCED_SEGMENT_BUILDER_DASHBOARD'
              />
            </FetchMock>
          </LocalStorageMock>
        </Router>
      </IntlProvider>
    </IocProvider>
  </Provider>
);

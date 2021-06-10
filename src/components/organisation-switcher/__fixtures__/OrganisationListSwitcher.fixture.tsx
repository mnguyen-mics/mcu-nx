import 'reflect-metadata';
import * as React from 'react';
import OrganisationListSwitcher from '../OrganisationListSwitcher';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import { ReduxMock } from 'react-cosmos-redux';
import { IocProvider } from '../../../inversify/inversify.react';
import { container } from "../../../inversify/inversify.config"
import configureStore from '../../../redux/store';
import config from '../../../react-configuration';

(global as any).window.MCS_CONSTANTS = config;
const store = configureStore();

const myMockedReduxState = {

  features: {
    organisation: [
      'audience-segment_exports',
      'audience-segments',
      'audience-partitions',
      'audience-segment_builder',
      'audience-user_client_segment',
      'audience-monitoring',
      'campaigns-display',
      'campaigns-goals',
      'creatives-display',
      'creatives-email',
      'library-catalog',
      'library-assets',
      'library-zone',
      'datastudio-imports',
      'datastudio-query_tool',
      'datastudio-exports',
      'datastudio-report',
      'campaignsSettings-attribution_models',
      'campaignsSettings-email_routers',
      'campaignsSettings-recommenders',
      'organisationSettings-labels',
      'organisationSettings-users',
      'organisationSettings-settings',
      'datamartSettings-visit_analyzers',
      'datamartSettings-sites',
      'datamartSettings-mobile_applications',
      'datamartSettings-datamarts',
      'datamartSettings-service_usage_report',
      'accountSettings-profile',
      'accountSettings-api_tokens',
      'servicesSettings-subscribed_offers',
      'servicesSettings-my_offers',
      'audience-segment_builder-reference_table',
      'features-ui_feature_flag',
      'datamartSettings-mlAlgorithms',
      'datamartSettings-ml_function',
      'datamartSettings-audience_partitions',
      'audience-feeds',
      'plugins-presets',
      'datamartSettings-compartments',
      'datamartSettings-channels',
      null
    ],
    client: {
      isBrowserClient: true
    }
  },
  notifications: [],
  login: {
    hasError: false,
    error: {}
  },
  session: {
    workspace: {
      organisation_id: '1185',
      customer_type: 'ENTERPRISE',
      organisation_name: 'FNAC-DARTY',
      administrator: false,
      role: 'READER',
      community_id: '1185',
      administrator_id: null,
      datamarts: [
        {
          id: '1139',
          name: 'Fnac-Darty',
          organisation_id: '1185',
          token: 'fnacdarty17',
          creation_date: 1507113271992,
          time_zone: 'Europe/Paris',
          type: 'DATAMART',
          datafarm: 'DF_EU_2017_09',
          storage_model_version: 'v201709',
          user_point_system_version: 'v201709',
          region: 'EUROPE',
          archived: false,
          audience_segment_metrics: []
        }
      ]
    },
    connectedUser: {
      id: '2276',
      first_name: 'Oussama',
      last_name: 'Assassi',
      email: 'oassassi@mediarithmics.com',
      locale: null,
      workspaces: [
        {
          organisation_id: '1185',
          customer_type: 'ENTERPRISE',
          organisation_name: 'FNAC-DARTY',
          administrator: false,
          role: 'READER',
          community_id: '1185',
          administrator_id: null,
          datamarts: [
            {
              id: '1139',
              name: 'Fnac-Darty',
              organisation_id: '1185',
              token: 'fnacdarty17',
              creation_date: 1507113271992,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2017_09',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201709',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
      ],
      default_workspace: 12
    },
    cookies: {
      mics_vid: '41414',
      mics_lts: '454545',
      mics_uaid: 'web:1:ca838b18-c5c3-431e-a5af-454455445'
    },
    connectedUserLoaded: true,
    isFechingCookies: false,
    isFetchingWorkspace: false,
    isUploadingLogo: false,
    logoUrl: 'https://navigator.mediarithmics.com/react/src/assets/images/logo.png'
  },
  labels: {
    labelsApi: {
      isFetching: false,
      data: [
        {
          id: '42',
          organisation_id: '1185',
          name: 'FNAC',
          creation_ts: 1518618213394
        },
      ],
      total: 11,
      status: 'ok',
      count: 11,
      first_result: 0,
      max_result: 2147483647,
      max_results: 2147483647
    }
  },
}

 
export default (
  <ReduxMock
    configureStore={configureStore}
    initialState={myMockedReduxState}
  >
    <IocProvider container={container}>
      <IntlProvider locale="en">
      <MemoryRouter initialEntries={["/o/1185"]}>
          <OrganisationListSwitcher />
        </MemoryRouter>
      </IntlProvider>
    </IocProvider>
    </ReduxMock>

)
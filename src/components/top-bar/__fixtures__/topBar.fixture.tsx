import 'reflect-metadata';
import * as React from 'react';
import TopBar from '../topBar';
import { IntlProvider } from 'react-intl';
import { HashRouter as Router } from 'react-router-dom';
import { IocProvider } from '../../../inversify/inversify.react';
import { container } from "../../../inversify/inversify.config"
import configureStore from '../../../redux/store';
import config from '../../../react-configuration';
import { ReduxMock } from 'react-cosmos-redux';

(global as any).window.MCS_CONSTANTS = config;

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
          organisation_id: '1337',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Channel 4',
          administrator: false,
          role: 'EDITOR',
          community_id: '1337',
          administrator_id: null,
          datamarts: [
            {
              id: '1444',
              name: 'Channel 4',
              organisation_id: '1337',
              token: 'channel4-20',
              creation_date: 1582031749723,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_UK_2019_09',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1551',
                  datafarm_key: 'DF_UK_2019_09',
                  datamart_id: '1444',
                  query_id: '43989',
                  technical_name: 'user_accounts',
                  display_name: 'Accounts',
                  icon: 'user',
                  status: 'LIVE',
                  creation_date: 1603292228845,
                  last_modified_date: 1603292228845,
                  last_published_date: null
                },
                {
                  id: '1550',
                  datafarm_key: 'DF_UK_2019_09',
                  datamart_id: '1444',
                  query_id: '43964',
                  technical_name: 'emails',
                  display_name: 'Profiles',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1603289554896,
                  last_modified_date: 1603289554896,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1411',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Rouge Gorge (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1497',
              name: 'Datamart Rouge Gorge',
              organisation_id: '1411',
              token: 'vlz-rgo-20',
              creation_date: 1597681569219,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
        {
          organisation_id: '1158',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Monoprix (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: [
            {
              id: '1190',
              name: 'Monoprix_DFV2',
              organisation_id: '1158',
              token: 'mono_d18',
              creation_date: 1527264944657,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2017_09',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201709',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1573',
                  datafarm_key: 'DF_EU_2017_09',
                  datamart_id: '1190',
                  query_id: '51537',
                  technical_name: 'user_accounts',
                  display_name: 'Users Accounts',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1615204250475,
                  last_modified_date: 1615204250475,
                  last_published_date: null
                },
                {
                  id: '1572',
                  datafarm_key: 'DF_EU_2017_09',
                  datamart_id: '1190',
                  query_id: '51536',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1615203829644,
                  last_modified_date: 1615203829644,
                  last_published_date: null
                },
                {
                  id: '1574',
                  datafarm_key: 'DF_EU_2017_09',
                  datamart_id: '1190',
                  query_id: '51538',
                  technical_name: 'emails',
                  display_name: 'Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1615204322386,
                  last_modified_date: 1615204322386,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1233',
          customer_type: 'ENTERPRISE',
          organisation_name: 'courir (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: []
        },
        {
          organisation_id: '1327',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Ceetrus (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1382',
              name: 'Datamart Ceetrus',
              organisation_id: '1327',
              token: 'cee19',
              creation_date: 1559836863660,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1467',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1382',
                  query_id: '22241',
                  technical_name: 'user_accounts',
                  display_name: 'User Profiles',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1564499008234,
                  last_modified_date: 1564499008234,
                  last_published_date: null
                },
                {
                  id: '1469',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1382',
                  query_id: '22242',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1564499453734,
                  last_modified_date: 1564499453734,
                  last_published_date: null
                },
                {
                  id: '1503',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1382',
                  query_id: '30624',
                  technical_name: 'emails',
                  display_name: 'User Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1576262508342,
                  last_modified_date: 1576262508342,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1441',
          customer_type: 'ENTERPRISE',
          organisation_name: 'TF1 (POC)',
          administrator: false,
          role: 'EDITOR',
          community_id: '1441',
          administrator_id: null,
          datamarts: [
            {
              id: '1519',
              name: 'Datamart TF1 - POC',
              organisation_id: '1441',
              token: 'tf1-poc-20',
              creation_date: 1607329627070,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2020_02',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
        {
          organisation_id: '1366',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Jules (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1458',
              name: 'Datamart Jules (Valiuz)',
              organisation_id: '1366',
              token: 'vlz-jules-20',
              creation_date: 1588674279635,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
        {
          organisation_id: '504',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Yellow Velvet',
          administrator: false,
          role: 'EDITOR',
          community_id: '504',
          administrator_id: null,
          datamarts: [
            {
              id: '1383',
              name: 'Yellow Velvet test',
              organisation_id: '504',
              token: 'sweet-arizona',
              creation_date: 1559845052224,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2017_09',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            },
            {
              id: '1449',
              name: 'test',
              organisation_id: '504',
              token: 'coffee-arizona',
              creation_date: 1585931929543,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            },
            {
              id: '1446',
              name: 'YV Pionus - March \'20',
              organisation_id: '504',
              token: 'yvpionusmarch20',
              creation_date: 1583514133146,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2017_09',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            },
            {
              id: '1407',
              name: 'Datamart C4 - Test',
              organisation_id: '504',
              token: 'c4test',
              creation_date: 1568975293882,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2017_09',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            },
            {
              id: '1393',
              name: 'TEST v201901',
              organisation_id: '504',
              token: 'test-19',
              creation_date: 1562928006763,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2017_09',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            },
            {
              id: '1438',
              name: 'Datamart with only a draft schema',
              organisation_id: '504',
              token: 'poulpi-test-19',
              creation_date: 1580824528111,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            },
            {
              id: '1406',
              name: 'testyolo1',
              organisation_id: '504',
              token: 'yolo-19',
              creation_date: 1567792626521,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            },
            {
              id: '1304',
              name: 'Test poulpi - BidSwitch - 22',
              organisation_id: '504',
              token: 'kkk-poulpi-20',
              creation_date: 1553621291545,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_LEGACY',
              storage_model_version: 'v201506',
              user_point_system_version: 'v201506',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1454',
                  datafarm_key: 'DF_EU_LEGACY',
                  datamart_id: '1304',
                  query_id: null,
                  technical_name: 'emails',
                  display_name: 'Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1553770339913,
                  last_modified_date: 1553770339913,
                  last_published_date: 1553770339913
                },
                {
                  id: '1453',
                  datafarm_key: 'DF_EU_LEGACY',
                  datamart_id: '1304',
                  query_id: null,
                  technical_name: 'user_accounts',
                  display_name: 'User Accounts',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1553770339913,
                  last_modified_date: 1553770339913,
                  last_published_date: 1553770339913
                },
                {
                  id: '1455',
                  datafarm_key: 'DF_EU_LEGACY',
                  datamart_id: '1304',
                  query_id: null,
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Desktop Cookie Ids',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1553770339913,
                  last_modified_date: 1553770339913,
                  last_published_date: 1553770339913
                },
                {
                  id: '1456',
                  datafarm_key: 'DF_EU_LEGACY',
                  datamart_id: '1304',
                  query_id: null,
                  technical_name: 'mobile_cookie_ids',
                  display_name: 'Mobile Cookie Ids',
                  icon: 'phone',
                  status: 'LIVE',
                  creation_date: 1553770339913,
                  last_modified_date: 1553770339913,
                  last_published_date: 1553770339913
                }
              ]
            },
            {
              id: '1508',
              name: 'YV Lambda knights Test FB server-to-server',
              organisation_id: '504',
              token: 'YV-datamart-20',
              creation_date: 1600871336179,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_11',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            },
            {
              id: '1414',
              name: 'YV - Pionus - test user consent',
              organisation_id: '504',
              token: 'london-asparagus',
              creation_date: 1572878129907,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_11',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            },
            {
              id: '1162',
              name: 'YV Pionus',
              organisation_id: '504',
              token: 'yv18-pionus',
              creation_date: 1516989403780,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2017_09',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201709',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1',
                  datafarm_key: 'DF_EU_2017_09',
                  datamart_id: '1162',
                  query_id: '18483',
                  technical_name: 'user_accounts',
                  display_name: 'My Count',
                  icon: 'video',
                  status: 'LIVE',
                  creation_date: 1550585580858,
                  last_modified_date: 1550585580858,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1279',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Valiuz',
          administrator: true,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: null,
          datamarts: [
            {
              id: '1442',
              name: 'Valiuz User Profiles Reference',
              organisation_id: '1279',
              token: 'vlz-cross-20',
              creation_date: 1581503299330,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            },
            {
              id: '1307',
              name: 'Valiuz User Id Graph',
              organisation_id: '1279',
              token: 'vlz-2019-03',
              creation_date: 1553690580708,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1492',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1307',
                  query_id: '22266',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1564499731969,
                  last_modified_date: 1564499731969,
                  last_published_date: null
                },
                {
                  id: '1482',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1307',
                  query_id: '22256',
                  technical_name: 'user_accounts',
                  display_name: 'User Profiles',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1564499729425,
                  last_modified_date: 1564499729425,
                  last_published_date: null
                },
                {
                  id: '1504',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1307',
                  query_id: '30625',
                  technical_name: 'emails',
                  display_name: 'User Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1576262581226,
                  last_modified_date: 1576262581226,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1087',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Wanimo (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: [
            {
              id: '1194',
              name: 'Wanimo_DFV2',
              organisation_id: '1087',
              token: 'wani_d18',
              creation_date: 1527265419995,
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
        {
          organisation_id: '1319',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Flunch (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1365',
              name: 'Datamart Flunch',
              organisation_id: '1319',
              token: 'flu-19',
              creation_date: 1557431186923,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1488',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1365',
                  query_id: '22262',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1564499731721,
                  last_modified_date: 1564499731721,
                  last_published_date: null
                },
                {
                  id: '1479',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1365',
                  query_id: '22253',
                  technical_name: 'user_accounts',
                  display_name: 'User Profiles',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1564499729373,
                  last_modified_date: 1564499729373,
                  last_published_date: null
                },
                {
                  id: '1506',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1365',
                  query_id: '30627',
                  technical_name: 'emails',
                  display_name: 'User Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1576262594600,
                  last_modified_date: 1576262594600,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1373',
          customer_type: 'ENTERPRISE',
          organisation_name: 'CMAX (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: [
            {
              id: '1463',
              name: 'CMAX (3W.relevanC)',
              organisation_id: '1373',
              token: 'cmax2020',
              creation_date: 1591983142653,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2017_09',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
        {
          organisation_id: '1',
          customer_type: 'ENTERPRISE',
          organisation_name: 'MEDIARITHMICS Platform',
          administrator: true,
          role: 'READER',
          community_id: '1',
          administrator_id: null,
          datamarts: []
        },
        {
          organisation_id: '1438',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Leader Price (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: [
            {
              id: '1515',
              name: 'Leader Price (3W.relevanC)',
              organisation_id: '1438',
              token: 'leaderprice-20',
              creation_date: 1606476788730,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2017_09',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
        {
          organisation_id: '1311',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Top Office (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1299',
              name: 'Datamart Top Office Valiuz',
              organisation_id: '1311',
              token: 'vlz-top-19',
              creation_date: 1553084257153,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1471',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1299',
                  query_id: '22245',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1564499523061,
                  last_modified_date: 1564499523061,
                  last_published_date: null
                },
                {
                  id: '1470',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1299',
                  query_id: '22244',
                  technical_name: 'user_accounts',
                  display_name: 'User Profiles',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1564499521948,
                  last_modified_date: 1564499521948,
                  last_published_date: null
                },
                {
                  id: '1511',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1299',
                  query_id: '30632',
                  technical_name: 'emails',
                  display_name: 'User Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1576262646762,
                  last_modified_date: 1576262646762,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1163',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Franprix (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: [
            {
              id: '1188',
              name: 'Franprix_DFV2',
              organisation_id: '1163',
              token: 'fran_d18',
              creation_date: 1527264769760,
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
        {
          organisation_id: '1238',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Naturalia (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: [
            {
              id: '1219',
              name: 'Naturalia (3W.relevanC) DFV2',
              organisation_id: '1238',
              token: 'natu_d18',
              creation_date: 1528799798342,
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
        {
          organisation_id: '1296',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Hachette',
          administrator: true,
          role: 'EDITOR',
          community_id: '1296',
          administrator_id: null,
          datamarts: [
            {
              id: '1280',
              name: 'Datamart Hachette',
              organisation_id: '1296',
              token: 'hachette18',
              creation_date: 1544461111025,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_11',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1576',
                  datafarm_key: 'DF_EU_2018_11',
                  datamart_id: '1280',
                  query_id: '52668',
                  technical_name: 'user_accounts',
                  display_name: 'User Profiles',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1617785649731,
                  last_modified_date: 1617785649731,
                  last_published_date: null
                },
                {
                  id: '1575',
                  datafarm_key: 'DF_EU_2018_11',
                  datamart_id: '1280',
                  query_id: '52633',
                  technical_name: 'mobile_cookie_ids',
                  display_name: 'Cookies web & mobile',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1617729891121,
                  last_modified_date: 1617729891121,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1159',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Geant Casino (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: []
        },
        {
          organisation_id: '1259',
          customer_type: 'ENTERPRISE',
          organisation_name: '1001pneus (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: [
            {
              id: '1242',
              name: '1001pneus (3W.relevanC) DFV2',
              organisation_id: '1259',
              token: 'pneus_d18',
              creation_date: 1537191606016,
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
        {
          organisation_id: '1227',
          customer_type: 'ENTERPRISE',
          organisation_name: 'DCF (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: [
            {
              id: '1187',
              name: 'DCF',
              organisation_id: '1227',
              token: 'dcf_d18',
              creation_date: 1527263701116,
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
        {
          organisation_id: '1118',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Casino (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: []
        },
        {
          organisation_id: '1160',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Supercasino (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: []
        },
        {
          organisation_id: '1461',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Pimkie (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1534',
              name: 'Datamart Pimkie',
              organisation_id: '1461',
              token: 'vlz-pimkie21',
              creation_date: 1610715930880,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
        {
          organisation_id: '1333',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Sens Critique',
          administrator: false,
          role: 'EDITOR',
          community_id: '1296',
          administrator_id: '1296',
          datamarts: [
            {
              id: '1399',
              name: 'Sens Critique',
              organisation_id: '1333',
              token: 'sens_critique19',
              creation_date: 1565013668175,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_11',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
        {
          organisation_id: '1318',
          customer_type: 'ENTERPRISE',
          organisation_name: '3Brasseurs (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1364',
              name: 'Datamart 3Brasseurs',
              organisation_id: '1318',
              token: '3br-19',
              creation_date: 1557430848141,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1486',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1364',
                  query_id: '22260',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1564499731673,
                  last_modified_date: 1564499731673,
                  last_published_date: null
                },
                {
                  id: '1476',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1364',
                  query_id: '22249',
                  technical_name: 'user_accounts',
                  display_name: 'User Profiles',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1564499729196,
                  last_modified_date: 1564499729196,
                  last_published_date: null
                },
                {
                  id: '1499',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1364',
                  query_id: '30620',
                  technical_name: 'emails',
                  display_name: 'User Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1576261701104,
                  last_modified_date: 1576261701104,
                  last_published_date: null
                }
              ]
            }
          ]
        },
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
              audience_segment_metrics: [
                {
                  id: '1526',
                  datafarm_key: 'DF_EU_2017_09',
                  datamart_id: '1139',
                  query_id: '32543',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1580978791630,
                  last_modified_date: 1580978791630,
                  last_published_date: null
                },
                {
                  id: '1515',
                  datafarm_key: 'DF_EU_2017_09',
                  datamart_id: '1139',
                  query_id: '32466',
                  technical_name: 'emails',
                  display_name: 'User Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1580753473871,
                  last_modified_date: 1580753473871,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1301',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Kiabi (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1287',
              name: 'Datamart Kiabi',
              organisation_id: '1301',
              token: 'vlz-kia-18',
              creation_date: 1546614589458,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1481',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1287',
                  query_id: '22255',
                  technical_name: 'user_accounts',
                  display_name: 'User Profiles',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1564499729422,
                  last_modified_date: 1564499729422,
                  last_published_date: null
                },
                {
                  id: '1490',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1287',
                  query_id: '22265',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1564499731887,
                  last_modified_date: 1564499731887,
                  last_published_date: null
                },
                {
                  id: '1507',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1287',
                  query_id: '30628',
                  technical_name: 'emails',
                  display_name: 'User Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1576262599832,
                  last_modified_date: 1576262599832,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1125',
          customer_type: 'ENTERPRISE',
          organisation_name: 'mediarithmics - Dogfooding',
          administrator: false,
          role: 'EDITOR',
          community_id: '1125',
          administrator_id: null,
          datamarts: [
            {
              id: '1398',
              name: 'mediarithmics - Dogfooding - Pionus',
              organisation_id: '1125',
              token: 'meddf19',
              creation_date: 1564076651347,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_11',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
        {
          organisation_id: '1226',
          customer_type: 'ENTERPRISE',
          organisation_name: 'relevanC',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: [
            {
              id: '1185',
              name: 'relevanC',
              organisation_id: '1226',
              token: 'relevanC18',
              creation_date: 1527260304529,
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
        {
          organisation_id: '1312',
          customer_type: 'ENTERPRISE',
          organisation_name: 'alinea (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1300',
              name: 'Datamart Alinea Valiuz',
              organisation_id: '1312',
              token: 'vlz-ali-19',
              creation_date: 1553084712398,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1485',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1300',
                  query_id: '22259',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1564499731615,
                  last_modified_date: 1564499731615,
                  last_published_date: null
                },
                {
                  id: '1474',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1300',
                  query_id: '22248',
                  technical_name: 'user_accounts',
                  display_name: 'User Profiles',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1564499729184,
                  last_modified_date: 1564499729184,
                  last_published_date: null
                },
                {
                  id: '1500',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1300',
                  query_id: '30621',
                  technical_name: 'emails',
                  display_name: 'User Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1576262473474,
                  last_modified_date: 1576262473474,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1224',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Cdiscount',
          administrator: false,
          role: 'EDITOR',
          community_id: '1224',
          administrator_id: null,
          datamarts: [
            {
              id: '1182',
              name: 'Cdiscount',
              organisation_id: '1224',
              token: 'CD_2018',
              creation_date: 1527187896051,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2017_09',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201709',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1553',
                  datafarm_key: 'DF_EU_2017_09',
                  datamart_id: '1182',
                  query_id: '47259',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1607015228095,
                  last_modified_date: 1607015228095,
                  last_published_date: null
                },
                {
                  id: '1552',
                  datafarm_key: 'DF_EU_2017_09',
                  datamart_id: '1182',
                  query_id: '47258',
                  technical_name: 'emails',
                  display_name: 'User Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1607014251543,
                  last_modified_date: 1607014251543,
                  last_published_date: null
                },
                {
                  id: '1554',
                  datafarm_key: 'DF_EU_2017_09',
                  datamart_id: '1182',
                  query_id: '47260',
                  technical_name: 'user_accounts',
                  display_name: 'User Profiles',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1607015365631,
                  last_modified_date: 1607015365631,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1356',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Tape à l\'oeil (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1433',
              name: 'Datamart Tape à l\'Oeil',
              organisation_id: '1356',
              token: 'vlz-tao2-19',
              creation_date: 1579041351083,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1538',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1433',
                  query_id: '34929',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1585326624041,
                  last_modified_date: 1585326624041,
                  last_published_date: null
                },
                {
                  id: '1537',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1433',
                  query_id: '34928',
                  technical_name: 'user_accounts',
                  display_name: 'User Profiles',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1585326605399,
                  last_modified_date: 1585326605399,
                  last_published_date: null
                },
                {
                  id: '1539',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1433',
                  query_id: '34930',
                  technical_name: 'emails',
                  display_name: 'User Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1585326640727,
                  last_modified_date: 1585326640727,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1282',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Leroy Merlin (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1265',
              name: 'Datamart Leroy Merlin',
              organisation_id: '1282',
              token: 'vlz-lr18',
              creation_date: 1541611336760,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1494',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1265',
                  query_id: '22268',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1564499892360,
                  last_modified_date: 1564499892360,
                  last_published_date: null
                },
                {
                  id: '1466',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1265',
                  query_id: '22238',
                  technical_name: 'user_accounts',
                  display_name: 'User Profiles',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1564487265035,
                  last_modified_date: 1564487265035,
                  last_published_date: null
                },
                {
                  id: '1495',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1265',
                  query_id: '22269',
                  technical_name: 'emails',
                  display_name: 'User Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1564500179700,
                  last_modified_date: 1564500179700,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1460',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Bizzbee (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1537',
              name: 'Datamart Bizzbee',
              organisation_id: '1460',
              token: 'vlz-bizzbee21',
              creation_date: 1610716065306,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
        {
          organisation_id: '1364',
          customer_type: 'ENTERPRISE',
          organisation_name: 'M6 (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: [
            {
              id: '1448',
              name: 'M6_relevanC',
              organisation_id: '1364',
              token: 'm6-relevanc-20',
              creation_date: 1585327890045,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2017_09',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
        {
          organisation_id: '1304',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Norauto (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1291',
              name: 'Datamart Norauto',
              organisation_id: '1304',
              token: 'nor-19',
              creation_date: 1549384787974,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1484',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1291',
                  query_id: '22258',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1564499731448,
                  last_modified_date: 1564499731448,
                  last_published_date: null
                },
                {
                  id: '1473',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1291',
                  query_id: '22247',
                  technical_name: 'user_accounts',
                  display_name: 'User Profiles',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1564499729116,
                  last_modified_date: 1564499729116,
                  last_published_date: null
                },
                {
                  id: '1508',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1291',
                  query_id: '30629',
                  technical_name: 'emails',
                  display_name: 'User Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1576262608660,
                  last_modified_date: 1576262608660,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1230',
          customer_type: 'ENTERPRISE',
          organisation_name: 'TF1 (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: [
            {
              id: '1202',
              name: 'TF1 (3W.relevanC)',
              organisation_id: '1230',
              token: 'tf1_d18',
              creation_date: 1527266910154,
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
        {
          organisation_id: '1353',
          customer_type: 'ENTERPRISE',
          organisation_name: 'LaPresse',
          administrator: false,
          role: 'EDITOR',
          community_id: '1353',
          administrator_id: null,
          datamarts: [
            {
              id: '1430',
              name: 'LaPresse (Prod)',
              organisation_id: '1353',
              token: 'lp-prod-19',
              creation_date: 1578401207255,
              time_zone: 'America/Toronto',
              type: 'DATAMART',
              datafarm: 'DF_CA_2019_12',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'AMERICA',
              archived: false,
              audience_segment_metrics: []
            },
            {
              id: '1429',
              name: 'LaPresse (Test)',
              organisation_id: '1353',
              token: 'lp-test-19',
              creation_date: 1576663952445,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_CA_2019_12',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1516',
                  datafarm_key: 'DF_CA_2019_12',
                  datamart_id: '1429',
                  query_id: '32468',
                  technical_name: 'emails',
                  display_name: 'User Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1580754623186,
                  last_modified_date: 1580754623186,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1412',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Grain de Malice (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1498',
              name: 'Datamart Grain de Malice',
              organisation_id: '1412',
              token: 'vlz-gdm-20',
              creation_date: 1597681751652,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
        {
          organisation_id: '1476',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Next Media (POC)',
          administrator: false,
          role: 'READER',
          community_id: '1',
          administrator_id: '1',
          datamarts: [
            {
              id: '1555',
              name: 'Datamart Next Media',
              organisation_id: '1476',
              token: 'nextms-poc',
              creation_date: 1614172387737,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2020_02',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
        {
          organisation_id: '1062',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Cdiscount (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: [
            {
              id: '1191',
              name: 'Cdiscount_DFV2',
              organisation_id: '1062',
              token: 'cdis_d18',
              creation_date: 1527265044371,
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
        {
          organisation_id: '1294',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Auchan (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1277',
              name: 'Datamart Auchan',
              organisation_id: '1294',
              token: 'auchan18',
              creation_date: 1544092837957,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1478',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1277',
                  query_id: '22252',
                  technical_name: 'user_accounts',
                  display_name: 'User Profiles',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1564499729347,
                  last_modified_date: 1564499729347,
                  last_published_date: null
                },
                {
                  id: '1491',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1277',
                  query_id: '22264',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1564499731917,
                  last_modified_date: 1564499731917,
                  last_published_date: null
                },
                {
                  id: '1501',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1277',
                  query_id: '30622',
                  technical_name: 'emails',
                  display_name: 'User Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1576262490473,
                  last_modified_date: 1576262490473,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1308',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Saint Maclou (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1296',
              name: 'Datamart Saint Maclou',
              organisation_id: '1308',
              token: 'saintmaclou19',
              creation_date: 1550769478428,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1493',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1296',
                  query_id: '22267',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1564499732018,
                  last_modified_date: 1564499732018,
                  last_published_date: null
                },
                {
                  id: '1480',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1296',
                  query_id: '22254',
                  technical_name: 'user_accounts',
                  display_name: 'User Profiles',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1564499729423,
                  last_modified_date: 1564499729423,
                  last_published_date: null
                },
                {
                  id: '1509',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1296',
                  query_id: '30630',
                  technical_name: 'emails',
                  display_name: 'User Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1576262615672,
                  last_modified_date: 1576262615672,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1077',
          customer_type: 'ENTERPRISE',
          organisation_name: '3W.relevanC',
          administrator: true,
          role: 'READER',
          community_id: '1077',
          administrator_id: null,
          datamarts: [
            {
              id: '1186',
              name: '3WR-relevanC cross DMP',
              organisation_id: '1077',
              token: 'three-arizona',
              creation_date: 1527260793483,
              time_zone: 'Europe/Paris',
              type: 'CROSS_DATAMART',
              datafarm: 'DF_EU_2017_09',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201709',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1512',
                  datafarm_key: 'DF_EU_2017_09',
                  datamart_id: '1186',
                  query_id: '32443',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1580739375926,
                  last_modified_date: 1580739375926,
                  last_published_date: null
                },
                {
                  id: '1513',
                  datafarm_key: 'DF_EU_2017_09',
                  datamart_id: '1186',
                  query_id: '32459',
                  technical_name: 'user_accounts',
                  display_name: 'Accounts',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1580743401381,
                  last_modified_date: 1580743401381,
                  last_published_date: null
                },
                {
                  id: '1514',
                  datafarm_key: 'DF_EU_2017_09',
                  datamart_id: '1186',
                  query_id: '32460',
                  technical_name: 'emails',
                  display_name: 'Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1580743533387,
                  last_modified_date: 1580743533387,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1309',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Demo (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1297',
              name: 'Datamart Demo Valiuz',
              organisation_id: '1309',
              token: 'vlzdemo19',
              creation_date: 1551366100271,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
        {
          organisation_id: '1348',
          customer_type: 'ENTERPRISE',
          organisation_name: 'S3V (Courchevel)',
          administrator: false,
          role: 'EDITOR',
          community_id: '1344',
          administrator_id: '1344',
          datamarts: [
            {
              id: '1451',
              name: 'Datamart S3V - 2',
              organisation_id: '1348',
              token: 'courch-s3v-20',
              creation_date: 1588514947699,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_11',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
        {
          organisation_id: '1314',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Electro Depot (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1309',
              name: 'Datamart Electro Depot',
              organisation_id: '1314',
              token: 'eld-19',
              creation_date: 1555429352441,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1487',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1309',
                  query_id: '22261',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1564499731678,
                  last_modified_date: 1564499731678,
                  last_published_date: null
                },
                {
                  id: '1475',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1309',
                  query_id: '22250',
                  technical_name: 'user_accounts',
                  display_name: 'User Profiles',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1564499729184,
                  last_modified_date: 1564499729184,
                  last_published_date: null
                },
                {
                  id: '1505',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1309',
                  query_id: '30626',
                  technical_name: 'emails',
                  display_name: 'User Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1576262588988,
                  last_modified_date: 1576262588988,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1410',
          customer_type: 'ENTERPRISE',
          organisation_name: 'ChronoDrive (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1496',
              name: 'Datamart ChronoDrive',
              organisation_id: '1410',
              token: 'vlz-chronodrive20',
              creation_date: 1597681087223,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
        {
          organisation_id: '1288',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Boulanger (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1271',
              name: 'Datamart Boulanger',
              organisation_id: '1288',
              token: 'vlz-blg-18',
              creation_date: 1542910113313,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: [
                {
                  id: '1489',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1271',
                  query_id: '22263',
                  technical_name: 'desktop_cookie_ids',
                  display_name: 'Cookies',
                  icon: 'display',
                  status: 'LIVE',
                  creation_date: 1564499731808,
                  last_modified_date: 1564499731808,
                  last_published_date: null
                },
                {
                  id: '1477',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1271',
                  query_id: '22251',
                  technical_name: 'user_accounts',
                  display_name: 'User Profiles',
                  icon: 'users',
                  status: 'LIVE',
                  creation_date: 1564499729219,
                  last_modified_date: 1564499729219,
                  last_published_date: null
                },
                {
                  id: '1502',
                  datafarm_key: 'DF_EU_2018_10',
                  datamart_id: '1271',
                  query_id: '30623',
                  technical_name: 'emails',
                  display_name: 'User Emails',
                  icon: 'email-inverted',
                  status: 'LIVE',
                  creation_date: 1576262497267,
                  last_modified_date: 1576262497267,
                  last_published_date: null
                }
              ]
            }
          ]
        },
        {
          organisation_id: '1268',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Campaign Tracking (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: [
            {
              id: '1251',
              name: 'Campaign Tracking DFV2',
              organisation_id: '1268',
              token: 'cmptrck_3wr',
              creation_date: 1539185107572,
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
        {
          organisation_id: '1120',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Troc (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: [
            {
              id: '1198',
              name: 'Troc_DFV2',
              organisation_id: '1120',
              token: 'troc_d18',
              creation_date: 1527265701915,
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
        {
          organisation_id: '1320',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Conforama (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: [
            {
              id: '1375',
              name: 'Conforama_DFV2',
              organisation_id: '1320',
              token: 'confo19',
              creation_date: 1557759308345,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2017_09',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
        {
          organisation_id: '1463',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Decathlon (VALIUZ)',
          administrator: false,
          role: 'ORGANISATION_ADMIN',
          community_id: '1279',
          administrator_id: '1279',
          datamarts: [
            {
              id: '1542',
              name: 'Datamart Decathlon',
              organisation_id: '1463',
              token: 'vlz-dec21',
              creation_date: 1612280664270,
              time_zone: 'Europe/Paris',
              type: 'DATAMART',
              datafarm: 'DF_EU_2018_10',
              storage_model_version: 'v201709',
              user_point_system_version: 'v201901',
              region: 'EUROPE',
              archived: false,
              audience_segment_metrics: []
            }
          ]
        },
        {
          organisation_id: '1088',
          customer_type: 'ENTERPRISE',
          organisation_name: 'Go Sport (3W.relevanC)',
          administrator: false,
          role: 'READER',
          community_id: '1077',
          administrator_id: '1077',
          datamarts: [
            {
              id: '1197',
              name: 'GoSport_DFV2',
              organisation_id: '1088',
              token: 'go_s_d18',
              creation_date: 1527265626739,
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
        }
      ],
      default_workspace: 12
    },
    cookies: {
      mics_vid: '17563317028',
      mics_lts: '1621867165373',
      mics_uaid: 'web:1:ca838b18-c5c3-431e-a5af-d6d4678aa22b'
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
        {
          id: '43',
          organisation_id: '1185',
          name: 'DARTY',
          creation_ts: 1518618217874
        },
        {
          id: '62',
          organisation_id: '1185',
          name: 'GROUPE',
          creation_ts: 1524566976540
        },
        {
          id: '63',
          organisation_id: '1185',
          name: 'FNAC SPECTACLE',
          creation_ts: 1524566994971
        },
        {
          id: '64',
          organisation_id: '1185',
          name: 'FRANCE BILLET',
          creation_ts: 1524567003336
        },
        {
          id: '108',
          organisation_id: '1185',
          name: 'RETAILINK',
          creation_ts: 1559039015516
        },
        {
          id: '122',
          organisation_id: '1185',
          name: 'MEDIA',
          creation_ts: 1570640021549
        },
        {
          id: '123',
          organisation_id: '1185',
          name: 'CRM',
          creation_ts: 1571754407761
        },
        {
          id: '124',
          organisation_id: '1185',
          name: 'ACQUISITION',
          creation_ts: 1571754416431
        },
        {
          id: '128',
          organisation_id: '1185',
          name: 'HAVAS',
          creation_ts: 1573661874191
        },
        {
          id: '133',
          organisation_id: '1185',
          name: 'Customer Match Adwords - temp',
          creation_ts: 1574698902912
        }
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
        <Router>
          <TopBar organisationId={'545'}/>
        </Router>
      </IntlProvider>
    </IocProvider>
  </ReduxMock>

)

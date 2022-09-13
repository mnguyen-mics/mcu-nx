import { OTQLResultType, QueryPrecisionMode } from '../../models/datamart/graphdb/OTQLResult';

export const MockedMetricData = {
  status: 'ok',
  data: {
    took: 401,
    timed_out: false,
    offset: null,
    limit: null,
    result_type: 'COUNT',
    precision: 'FULL_PRECISION',
    sampling_ratio: null,
    rows: [
      {
        count: 469582500,
      },
    ],
    cache_hit: false,
  },
};

export const MockedDataActivityEventNature = {
  status: 'ok',
  data: {
    took: 41396,
    timed_out: false,
    offset: null,
    limit: null,
    result_type: 'AGGREGATION',
    precision: 'FULL_PRECISION',
    sampling_ratio: null,
    rows: [
      {
        aggregations: {
          bucket_aggregations: [
            {
              name: 'map_nature',
              field_name: 'nature',
              path: 'activity_events',
              type: 'map',
              buckets: [
                { key: 'item_view', count: 1298429159 },
                { key: '$set_user_profile_properties', count: 1022688613 },
                { key: 'navigation', count: 1898685200 },
                { key: 'search', count: 1065794655 },
                { key: 'home', count: 127178688 },
                { key: '$ad_view', count: 111695368 },
                { key: 'user_identifiers_association', count: 165816430 },
                { key: 'basket_view', count: 135723390 },
                { key: 'offline_order', count: 164167310 },
                { key: '$quit_while_running', count: 105356062 },
                { key: 'transaction_confirmed', count: 10682105 },
                { key: 'editorials', count: 14077987 },
                { key: '$conversion', count: 16347167 },
                { key: 'online_order', count: 16131453 },
                { key: 'artist_view', count: 15922742 },
                { key: 'services', count: 13674901 },
                { key: 'set_user_profile_properties', count: 12556969 },
              ],
            },
          ],
          buckets: [
            {
              name: 'map_nature',
              field_name: 'nature',
              path: 'activity_events',
              type: 'map',
              buckets: [
                { key: 'item_view', count: 1298429159 },
                { key: '$set_user_profile_properties', count: 1022688613 },
                { key: 'navigation', count: 1898685200 },
                { key: 'search', count: 1065794655 },
                { key: 'home', count: 127178688 },
                { key: '$ad_view', count: 111695368 },
                { key: 'user_identifiers_association', count: 165816430 },
                { key: 'basket_view', count: 135723390 },
                { key: 'offline_order', count: 164167310 },
                { key: '$quit_while_running', count: 105356062 },
              ],
            },
          ],
          metrics: [],
        },
      },
    ],
    cache_hit: false,
    warning_message: null,
  },
};

export const MockedData = {
  status: 'ok',
  data: {
    took: 35647,
    timed_out: false,
    offset: null,
    limit: null,
    result_type: 'AGGREGATION' as OTQLResultType,
    precision: 'FULL_PRECISION' as QueryPrecisionMode,
    sampling_ratio: null,
    rows: [
      {
        aggregations: {
          bucket_aggregations: [
            {
              name: 'map_nature',
              field_name: 'nature',
              path: 'activity_events',
              type: 'map',
              buckets: [
                {
                  key: 'item_view',
                  count: 2061861759,
                },
                {
                  key: '$set_user_profile_properties',
                  count: 1879809579,
                },
                {
                  key: 'navigation',
                  count: 1711861375,
                },
                {
                  key: 'search',
                  count: 968938644,
                },
                {
                  key: 'home',
                  count: 865440106,
                },
                {
                  key: '$ad_view',
                  count: 662437456,
                },
                {
                  key: 'user_identifiers_association',
                  count: 412896957,
                },
                {
                  key: 'basket_view',
                  count: 306154024,
                },
                {
                  key: 'offline_order',
                  count: 146434077,
                },
                {
                  key: '$quit_while_running',
                  count: 103539522,
                },
                {
                  key: 'transaction_confirmed',
                  count: 35372196,
                },
                {
                  key: 'editorials',
                  count: 23228163,
                },
                {
                  key: 'online_order',
                  count: 14965317,
                },
                {
                  key: '$conversion',
                  count: 14814680,
                },
                {
                  key: 'artist_view',
                  count: 14105875,
                },
                {
                  key: 'services',
                  count: 13407881,
                },
                {
                  key: 'set_user_profile_properties',
                  count: 12541016,
                },
                {
                  key: 'transaction confirmed',
                  count: 8547354,
                },
                {
                  key: '$email_mapping',
                  count: 8357670,
                },
                {
                  key: '$ad_click',
                  count: 4178144,
                },
                {
                  key: '$email_sent',
                  count: 3913705,
                },
                {
                  key: 'offline_order_return',
                  count: 2206333,
                },
                {
                  key: 'festival_view',
                  count: 1334529,
                },
                {
                  key: '$unknown',
                  count: 252113,
                },
                {
                  key: '$error',
                  count: 70352,
                },
                {
                  key: 'online_order_return',
                  count: 56223,
                },
              ],
            },
          ],
          buckets: [
            {
              name: 'map_nature',
              field_name: 'nature',
              path: 'activity_events',
              type: 'map',
              buckets: [
                {
                  key: 'item_view',
                  count: 2061861759,
                },
                {
                  key: '$set_user_profile_properties',
                  count: 1879809579,
                },
                {
                  key: 'navigation',
                  count: 1711861375,
                },
                {
                  key: 'search',
                  count: 968938644,
                },
                {
                  key: 'home',
                  count: 865440106,
                },
                {
                  key: '$ad_view',
                  count: 662437456,
                },
                {
                  key: 'user_identifiers_association',
                  count: 412896957,
                },
                {
                  key: 'basket_view',
                  count: 306154024,
                },
                {
                  key: 'offline_order',
                  count: 146434077,
                },
                {
                  key: '$quit_while_running',
                  count: 103539522,
                },
                {
                  key: 'transaction_confirmed',
                  count: 35372196,
                },
                {
                  key: 'editorials',
                  count: 23228163,
                },
                {
                  key: 'online_order',
                  count: 14965317,
                },
                {
                  key: '$conversion',
                  count: 14814680,
                },
                {
                  key: 'artist_view',
                  count: 14105875,
                },
                {
                  key: 'services',
                  count: 13407881,
                },
                {
                  key: 'set_user_profile_properties',
                  count: 12541016,
                },
                {
                  key: 'transaction confirmed',
                  count: 8547354,
                },
                {
                  key: '$email_mapping',
                  count: 8357670,
                },
                {
                  key: '$ad_click',
                  count: 4178144,
                },
                {
                  key: '$email_sent',
                  count: 3913705,
                },
                {
                  key: 'offline_order_return',
                  count: 2206333,
                },
                {
                  key: 'festival_view',
                  count: 1334529,
                },
                {
                  key: '$unknown',
                  count: 252113,
                },
              ],
            },
          ],
          metrics: [],
        },
      },
    ],
    cache_hit: false,
  },
};

export const MockedAnalytics = {
  status: 'ok',
  data: {
    report_view: {
      items_per_page: 100,
      total_items: 31,
      columns_headers: ['date_yyyy_mm_dd', 'sessions'],
      rows: [
        ['2021-09-22', 3520226],
        ['2021-09-23', 2049463],
        ['2021-09-24', 2406401],
        ['2021-09-25', 2361219],
        ['2021-09-26', 2213647],
        ['2021-09-27', 2326351],
        ['2021-09-28', 1868697],
        ['2021-09-29', 1846098],
        ['2021-09-30', 1722518],
        ['2021-10-01', 1288777],
        ['2021-10-02', 1363517],
        ['2021-10-03', 1233798],
        ['2021-10-04', 1297185],
        ['2021-10-05', 1271393],
        ['2021-10-06', 1280845],
        ['2021-10-07', 1140951],
        ['2021-10-08', 1213418],
        ['2021-10-09', 1224446],
        ['2021-10-10', 1074310],
        ['2021-10-11', 1158405],
        ['2021-10-12', 1182565],
        ['2021-10-13', 1140571],
        ['2021-10-14', 1174990],
        ['2021-10-15', 1180444],
        ['2021-10-16', 1251985],
        ['2021-10-17', 1139252],
        ['2021-10-18', 1260364],
        ['2021-10-19', 1184099],
        ['2021-10-20', 1299478],
        ['2021-10-21', 1295183],
        ['2021-10-22', 704348],
      ],
    },
  },
};
export const MockedAnalytics2 = {
  status: 'ok',
  data: {
    report_view: {
      items_per_page: 100,
      total_items: 31,
      columns_headers: ['city', 'date_yyyy_mm_dd', 'sessions'],
      rows: [
        ['Paris', '2021-09-22', 3520226],
        ['Paris', '2021-09-23', 2049463],
        ['Paris', '2021-09-24', 2406401],
        ['Paris', '2021-09-25', 2361219],
        ['Paris', '2021-09-26', 2213647],
        ['Paris', '2021-09-27', 2326351],
        ['Paris', '2021-09-28', 1868697],
        ['Paris', '2021-09-29', 1846098],
        ['Paris', '2021-09-30', 1722518],
        ['Paris', '2021-10-01', 1288777],
        ['Paris', '2021-10-02', 1363517],
        ['Paris', '2021-10-03', 1233798],
        ['Paris', '2021-10-04', 1297185],
        ['London', '2021-09-22', 1140351],
        ['London', '2021-09-23', 1213418],
        ['London', '2021-09-24', 1224446],
        ['London', '2021-09-25', 1074310],
        ['London', '2021-09-26', 2152205],
        ['London', '2021-09-27', 1182565],
        ['London', '2021-09-28', 1140571],
        ['London', '2021-09-29', 1114990],
        ['London', '2021-09-30', 1180444],
        ['London', '2021-10-01', 1251985],
        ['London', '2021-10-02', 1139252],
        ['London', '2021-10-03', 1260364],
        ['London', '2021-10-04', 1184099],
      ],
    },
  },
};

export const MockedAnalyticsMetrics = {
  status: 'ok',
  data: {
    report_view: {
      items_per_page: 100,
      total_items: 1,
      columns_headers: ['users'],
      rows: [[13661544]],
    },
  },
};

export const MockedCollectionMetrics = {
  status: 'ok',
  data: {
    report_view: {
      items_per_page: 100,
      total_items: 1,
      columns_headers: ['count'],
      rows: [[13661544]],
    },
  },
};

export const MockedFetchDashboard = {
  status: 'ok',
  data: [
    {
      id: '18',
      title: 'General Information',
      scopes: ['home'],
      segment_ids: [],
      builder_ids: [],
      archived: false,
      dashboard_content_id: '468',
      organisation_id: '1185',
      community_id: '1185',
      created_ts: 1634910365921,
      created_by: '2886',
      last_modified_ts: 1634910365921,
      last_modified_by: '2886',
    },
  ],
  count: 1,
  total: 1,
  first_result: 0,
  max_results: 50,
};

export const MockedFetchDashboardContent = {
  status: 'ok',
  data: {
    id: '468',
    content:
      '{"sections":[{"title":"","cards":[{"x":0,"charts":[{"title":"Active users","type":"Metric","dataset":{"type":"activities_analytics","query_json":{"dimensions":[],"metrics":[{"expression":"users"}]}},"options":{}},{"title":"Site visits per day per channel","type":"Bars","dataset":{"type":"activities_analytics","query_json":{"dimensions":[{"name":"date_yyyy_mm_dd"},{"name":"channel_id"}],"dimension_filter_clauses":{"operator":"OR","filters":[{"dimension_name":"type","operator":"EXACT","expressions":["SITE_VISIT"]}]},"metrics":[{"expression":"sessions"}]}},"options":{"stacking":true,"hide_x_axis":true}}],"y":0,"h":5,"layout":"vertical","w":4},{"x":4,"charts":[{"title":"Offline transactions per day","type":"Bars","dataset":{"type":"activities_analytics","query_json":{"dimensions":[{"name":"date_yyyy_mm_dd"},{"name":"channel_id"}],"dimension_filter_clauses":{"operator":"OR","filters":[{"dimension_name":"channel_id","operator":"IN_LIST","expressions":["2825","2833"]}]},"metrics":[{"expression":"number_of_transactions"}]}},"options":{"stacking":true,"hide_x_axis":true,"hide_y_axis":true,"legend":{"enabled":true,"position":"right"}}},{"title":"Online transactions per day","type":"Bars","dataset":{"type":"activities_analytics","query_json":{"dimensions":[{"name":"date_yyyy_mm_dd"},{"name":"channel_id"}],"dimension_filter_clauses":{"operator":"OR","filters":[{"dimension_name":"channel_id","operator":"IN_LIST","expressions":["2417","2416","2418","2419"]}]},"metrics":[{"expression":"number_of_transactions"}]}},"options":{"stacking":true,"hide_x_axis":true,"hide_y_axis":true,"legend":{"enabled":true,"position":"right"}}}],"y":0,"h":5,"layout":"vertical","w":8}]},{"title":"Collections","cards":[{"x":0,"charts":[{"title":"Volumes per collection (last 30 days)","type":"Bars","dataset":{"type":"collection_volumes","query_json":{"dimensions":[{"name":"date_time"},{"name":"collection"}],"dimension_filter_clauses":{"operator":"AND","filters":[{"dimension_name":"datamart_id","operator":"EXACT","expressions":[1139]}]},"metrics":[{"expression":"count"}]}}}],"y":0,"h":3,"layout":"vertical","w":12}]}]}',
    organisation_id: '1185',
    created_ts: 1638957231389,
    created_by: '2886',
  },
};

export const MockedFetchChannels = {
  status: 'ok',
  data: [
    {
      type: 'SITE',
      id: '2416',
      name: 'Site 1',
      datamart_id: '1139',
      token: 'fd-test17',
      creation_ts: 1507113432277,
      organisation_id: '1185',
      domain: 'test.com',
      enable_analytics: false,
      enable_installation_id_aggregation: false,
    },
    {
      type: 'SITE',
      id: '2417',
      name: 'Site 2',
      datamart_id: '1139',
      token: 'fd-probe17',
      creation_ts: 1507113514325,
      organisation_id: '1185',
      domain: 'probe.com',
      enable_analytics: false,
      enable_installation_id_aggregation: false,
    },
    {
      type: 'SITE',
      id: '2418',
      name: 'Site 3',
      datamart_id: '1139',
      token: 'fd-fncspctl17',
      creation_ts: 1507117883680,
      organisation_id: '1185',
      domain: 'testspectacles.com',
      enable_analytics: false,
      enable_installation_id_aggregation: false,
    },
    {
      type: 'SITE',
      id: '2419',
      name: 'Site 4',
      datamart_id: '1139',
      token: 'fd-frblt17',
      creation_ts: 1507117933327,
      organisation_id: '1185',
      domain: 'francebillet.com',
      enable_analytics: false,
      enable_installation_id_aggregation: false,
    },
    {
      type: 'SITE',
      id: '2825',
      name: 'Site 5',
      datamart_id: '1139',
      token: 'fd-teststores18',
      creation_ts: 1532110811149,
      organisation_id: '1185',
      domain: 'test.com',
      enable_analytics: false,
      enable_installation_id_aggregation: false,
    },
    {
      type: 'SITE',
      id: '2833',
      name: 'Site 6',
      datamart_id: '1139',
      token: 'fd-probestores18',
      creation_ts: 1533666971826,
      organisation_id: '1185',
      domain: 'probe.com',
      enable_analytics: false,
      enable_installation_id_aggregation: false,
    },
    {
      type: 'SITE',
      id: '2834',
      name: 'Site 7',
      datamart_id: '1139',
      token: 'fd-fncspctlstores18',
      creation_ts: 1533667008653,
      organisation_id: '1185',
      domain: 'testspectacles.com',
      enable_analytics: false,
      enable_installation_id_aggregation: false,
    },
    {
      type: 'SITE',
      id: '2835',
      name: 'Site 8',
      datamart_id: '1139',
      token: 'fd-frbltofflinedata18',
      creation_ts: 1533667056271,
      organisation_id: '1185',
      domain: 'francebillet.com',
      enable_analytics: false,
      enable_installation_id_aggregation: false,
    },
    {
      type: 'SITE',
      id: '2843',
      name: 'Site 9',
      datamart_id: '1139',
      token: 'fd-testcomimport18',
      creation_ts: 1537285606330,
      organisation_id: '1185',
      domain: 'test.com',
      enable_analytics: false,
      enable_installation_id_aggregation: false,
    },
    {
      type: 'SITE',
      id: '2844',
      name: 'Site 10',
      datamart_id: '1139',
      token: 'fd-probecomimport18',
      creation_ts: 1537285678480,
      organisation_id: '1185',
      domain: 'probe.com',
      enable_analytics: false,
      enable_installation_id_aggregation: false,
    },
    {
      type: 'SITE',
      id: '3533',
      name: 'Site 11',
      datamart_id: '1139',
      token: 'fd-testpro19',
      creation_ts: 1573577918371,
      organisation_id: '1185',
      domain: 'testpro.com',
      enable_analytics: false,
      enable_installation_id_aggregation: false,
    },
    {
      type: 'SITE',
      id: '4097',
      name: 'Site 12',
      datamart_id: '1139',
      token: 'fd-probepro21',
      creation_ts: 1612349085022,
      organisation_id: '1185',
      domain: 'pro.probe.com',
      enable_analytics: false,
      enable_installation_id_aggregation: false,
    },
  ],
  count: 12,
  total: 12,
  first_result: 0,
  max_results: 50,
};

export const MockedFetchSessionsByChannels = {
  status: 'ok',
  data: {
    report_view: {
      items_per_page: 100,
      total_items: 100,
      columns_headers: ['date_yyyy_mm_dd', 'channel_id', 'sessions'],
      rows: [
        ['2021-12-20', 2416, 128506],
        ['2021-12-20', 2417, 121372],
        ['2021-12-20', 2418, 16179],
        ['2021-12-20', 2419, 1826],
        ['2021-12-20', 2825, 13544],
        ['2021-12-20', 2833, 10846],
        ['2021-12-20', 2844, 10691],
        ['2021-12-21', 2416, 155081],
        ['2021-12-21', 2417, 190235],
        ['2021-12-21', 2418, 17419],
        ['2021-12-21', 2419, 1753],
        ['2021-12-21', 2825, 186191],
        ['2021-12-21', 2833, 1995],
        ['2021-12-21', 2844, 1102],
        ['2021-12-22', 2416, 187576],
        ['2021-12-22', 2417, 158701],
        ['2021-12-22', 2418, 10818],
        ['2021-12-22', 2419, 1542],
        ['2021-12-22', 2825, 183431],
        ['2021-12-22', 2833, 16066],
        ['2021-12-22', 2844, 1819],
        ['2021-12-23', 2416, 181948],
        ['2021-12-23', 2417, 127456],
        ['2021-12-23', 2418, 18906],
        ['2021-12-23', 2419, 1210],
        ['2021-12-23', 2825, 190412],
        ['2021-12-23', 2833, 15215],
        ['2021-12-23', 2844, 1945],
        ['2021-12-24', 2416, 198311],
        ['2021-12-24', 2417, 135862],
        ['2021-12-24', 2418, 18978],
        ['2021-12-24', 2419, 1287],
        ['2021-12-24', 2825, 146194],
        ['2021-12-24', 2833, 17831],
        ['2021-12-24', 2844, 1877],
        ['2021-12-25', 2416, 186212],
        ['2021-12-25', 2417, 165536],
        ['2021-12-25', 2418, 19310],
        ['2021-12-25', 2419, 1419],
        ['2021-12-25', 2825, 19],
        ['2021-12-25', 2833, 10],
        ['2021-12-25', 2844, 1538],
        ['2021-12-26', 2416, 159313],
        ['2021-12-26', 2417, 147822],
        ['2021-12-26', 2418, 13341],
        ['2021-12-26', 2419, 1226],
        ['2021-12-26', 2825, 13484],
        ['2021-12-26', 2833, 1347],
        ['2021-12-26', 2844, 1906],
        ['2021-12-27', 2416, 125694],
        ['2021-12-27', 2417, 111603],
        ['2021-12-27', 2418, 15082],
        ['2021-12-27', 2419, 1382],
        ['2021-12-27', 2825, 107024],
        ['2021-12-27', 2833, 15584],
        ['2021-12-27', 2844, 1909],
        ['2021-12-28', 2416, 153568],
        ['2021-12-28', 2417, 174666],
        ['2021-12-28', 2418, 15367],
        ['2021-12-28', 2419, 1278],
        ['2021-12-28', 2825, 14752],
        ['2021-12-28', 2833, 19586],
        ['2021-12-28', 2844, 1377],
        ['2021-12-29', 2416, 133058],
        ['2021-12-29', 2417, 148664],
        ['2021-12-29', 2418, 16530],
        ['2021-12-29', 2419, 1014],
        ['2021-12-29', 2825, 13517],
        ['2021-12-29', 2833, 17619],
        ['2021-12-29', 2844, 1070],
        ['2021-12-30', 2416, 160259],
        ['2021-12-30', 2417, 104520],
        ['2021-12-30', 2418, 16831],
        ['2021-12-30', 2419, 145],
        ['2021-12-30', 2825, 17997],
        ['2021-12-30', 2833, 16291],
        ['2021-12-30', 2844, 1390],
        ['2021-12-31', 2416, 121360],
        ['2021-12-31', 2417, 113096],
        ['2021-12-31', 2418, 10742],
        ['2021-12-31', 2419, 195],
        ['2021-12-31', 2825, 17285],
        ['2021-12-31', 2833, 10073],
        ['2021-12-31', 2844, 1274],
        ['2022-01-01', 2416, 129262],
        ['2022-01-01', 2417, 112205],
        ['2022-01-01', 2418, 13086],
        ['2022-01-01', 2419, 16375],
        ['2022-01-01', 2825, 13],
        ['2022-01-01', 2833, 10],
        ['2022-01-01', 2844, 1071],
        ['2022-01-02', 2416, 142292],
        ['2022-01-02', 2417, 190250],
        ['2022-01-02', 2418, 13280],
        ['2022-01-02', 2419, 1016],
        ['2022-01-02', 2825, 12577],
        ['2022-01-02', 2833, 1586],
        ['2022-01-02', 2844, 1685],
        ['2022-01-03', 2416, 189144],
        ['2022-01-03', 2417, 115547],
      ],
    },
  },
};

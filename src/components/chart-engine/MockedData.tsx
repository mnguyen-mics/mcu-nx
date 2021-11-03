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

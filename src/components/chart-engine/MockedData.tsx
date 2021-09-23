import { OTQLResultType, QueryPrecisionMode } from "../../models/datamart/graphdb/OTQLResult";

export const MockedData = {
  status: "ok",
  data: {
    took: 35647,
    timed_out: false,
    offset: null,
    limit: null,
    result_type: "AGGREGATION" as OTQLResultType,
    precision: "FULL_PRECISION" as QueryPrecisionMode,
    sampling_ratio: null,
    rows: [
      {
        aggregations: {
          bucket_aggregations: [
            {
              name: "map_nature",
              field_name: "nature",
              path: "activity_events",
              type: "map",
              buckets: [
                {
                  key: "item_view",
                  count: 2061861759,
                },
                {
                  key: "$set_user_profile_properties",
                  count: 1879809579,
                },
                {
                  key: "navigation",
                  count: 1711861375,
                },
                {
                  key: "search",
                  count: 968938644,
                },
                {
                  key: "home",
                  count: 865440106,
                },
                {
                  key: "$ad_view",
                  count: 662437456,
                },
                {
                  key: "user_identifiers_association",
                  count: 412896957,
                },
                {
                  key: "basket_view",
                  count: 306154024,
                },
                {
                  key: "offline_order",
                  count: 146434077,
                },
                {
                  key: "$quit_while_running",
                  count: 103539522,
                },
                {
                  key: "transaction_confirmed",
                  count: 35372196,
                },
                {
                  key: "editorials",
                  count: 23228163,
                },
                {
                  key: "online_order",
                  count: 14965317,
                },
                {
                  key: "$conversion",
                  count: 14814680,
                },
                {
                  key: "artist_view",
                  count: 14105875,
                },
                {
                  key: "services",
                  count: 13407881,
                },
                {
                  key: "set_user_profile_properties",
                  count: 12541016,
                },
                {
                  key: "transaction confirmed",
                  count: 8547354,
                },
                {
                  key: "$email_mapping",
                  count: 8357670,
                },
                {
                  key: "$ad_click",
                  count: 4178144,
                },
                {
                  key: "$email_sent",
                  count: 3913705,
                },
                {
                  key: "offline_order_return",
                  count: 2206333,
                },
                {
                  key: "festival_view",
                  count: 1334529,
                },
                {
                  key: "$unknown",
                  count: 252113,
                },
                {
                  key: "$error",
                  count: 70352,
                },
                {
                  key: "online_order_return",
                  count: 56223,
                }
              ],
            },
          ],
          buckets: [
            {
              name: "map_nature",
              field_name: "nature",
              path: "activity_events",
              type: "map",
              buckets: [
                {
                  key: "item_view",
                  count: 2061861759,
                },
                {
                  key: "$set_user_profile_properties",
                  count: 1879809579,
                },
                {
                  key: "navigation",
                  count: 1711861375,
                },
                {
                  key: "search",
                  count: 968938644,
                },
                {
                  key: "home",
                  count: 865440106,
                },
                {
                  key: "$ad_view",
                  count: 662437456,
                },
                {
                  key: "user_identifiers_association",
                  count: 412896957,
                },
                {
                  key: "basket_view",
                  count: 306154024,
                },
                {
                  key: "offline_order",
                  count: 146434077,
                },
                {
                  key: "$quit_while_running",
                  count: 103539522,
                },
                {
                  key: "transaction_confirmed",
                  count: 35372196,
                },
                {
                  key: "editorials",
                  count: 23228163,
                },
                {
                  key: "online_order",
                  count: 14965317,
                },
                {
                  key: "$conversion",
                  count: 14814680,
                },
                {
                  key: "artist_view",
                  count: 14105875,
                },
                {
                  key: "services",
                  count: 13407881,
                },
                {
                  key: "set_user_profile_properties",
                  count: 12541016,
                },
                {
                  key: "transaction confirmed",
                  count: 8547354,
                },
                {
                  key: "$email_mapping",
                  count: 8357670,
                },
                {
                  key: "$ad_click",
                  count: 4178144,
                },
                {
                  key: "$email_sent",
                  count: 3913705,
                },
                {
                  key: "offline_order_return",
                  count: 2206333,
                },
                {
                  key: "festival_view",
                  count: 1334529,
                },
                {
                  key: "$unknown",
                  count: 252113,
                }
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

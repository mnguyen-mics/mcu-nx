import React from 'react';
import AreaChart, { AreaChartProps } from '../AreaChart';

const propsForDayMode: AreaChartProps = {
  dataset: [
    { day: '2020-02-27', data_1: 120, data_2: 20 },
    { day: '2020-02-28', data_1: 3451, data_2: 561 },
    { day: '2020-02-29', data_1: 3000, data_2: 651 },
    { day: '2020-03-01', data_1: 2132, data_2: 261 },
    { day: '2020-03-02', data_1: 889, data_2: 53 },
  ],
  format: 'count',
  type: 'area',
  legend: {
    enabled: true,
    position: 'bottom',
    layout: 'horizontal',
  },
  yKeys: [
    {
      key: 'data_1',
      message: 'Data 1',
    },
    {
      key: 'data_2',
      message: 'Data 2',
    },
  ],
  xKey: { key: 'day', mode: 'DAY' },
};

const propsForDayModeDoubleYAxis: AreaChartProps = {
  dataset: [
    { day: '2020-02-27', data_1: 1, data_2: 20, data_3: 344, data_4: 2456 },
    { day: '2020-02-28', data_1: 3, data_2: 56, data_3: 641, data_4: 4456 },
    { day: '2020-02-29', data_1: 8, data_2: 65, data_3: 842, data_4: 6456 },
    { day: '2020-03-01', data_1: 6, data_2: 26, data_3: 145, data_4: 6956 },
    { day: '2020-03-02', data_1: 3, data_2: 53, data_3: 241, data_4: 3456 },
  ],
  format: 'count',
  type: 'area',
  doubleYAxis: true,
  plotLineValue: 100,
  hideYAxis: false,
  legend: {
    enabled: true,
    position: 'bottom',
    layout: 'horizontal',
  },
  yKeys: [
    {
      key: 'data_1',
      message: 'Data 1',
    },
    {
      key: 'data_2',
      message: 'Data 2',
    },
    {
      key: 'data_3',
      message: 'Data 3',
    },
    {
      key: 'data_4',
      message: 'Data 4',
    },
  ],
  xKey: { key: 'day', mode: 'DAY' },
};

const propsForHourLineMode: AreaChartProps = {
  dataset: [
    {
      day: '2021-04-29 03:00:00',
      user_points_count: 9,
    },
    {
      day: '2021-04-29 04:00:00',
      user_points_count: 16,
    },
    {
      day: '2021-04-29 05:00:00',
      user_points_count: 25,
    },
    {
      day: '2021-04-29 06:00:00',
      user_points_count: 36,
    },
    {
      day: '2021-04-29 07:00:00',
      user_points_count: 49,
    },
    {
      day: '2021-04-29 08:00:00',
      user_points_count: 64,
    },
    {
      day: '2021-04-29 09:00:00',
      user_points_count: 81,
    },
    {
      day: '2021-04-29 10:00:00',
      user_points_count: 100,
    },
    {
      day: '2021-04-29 11:00:00',
      user_points_count: 121,
    },
    {
      day: '2021-04-29 12:00:00',
      user_points_count: 144,
    },
    {
      day: '2021-04-29 13:00:00',
      user_points_count: 169,
    },
    {
      day: '2021-04-29 14:00:00',
      user_points_count: 196,
    },
    {
      day: '2021-04-29 15:00:00',
      user_points_count: 225,
    },
    {
      day: '2021-04-29 16:00:00',
      user_points_count: 256,
    },
    {
      day: '2021-04-29 17:00:00',
      user_points_count: 289,
    },
    {
      day: '2021-04-29 18:00:00',
      user_points_count: 324,
    },
    {
      day: '2021-04-29 19:00:00',
      user_points_count: 361,
    },
    {
      day: '2021-04-29 20:00:00',
      user_points_count: 400,
    },
    {
      day: '2021-04-29 21:00:00',
      user_points_count: 441,
    },
    {
      day: '2021-04-29 22:00:00',
      user_points_count: 484,
    },
    {
      day: '2021-04-29 23:00:00',
      user_points_count: 529,
    },
    {
      day: '2021-04-30 00:00:00',
      user_points_count: 441,
    },
    {
      day: '2021-04-30 01:00:00',
      user_points_count: 484,
    },
    {
      day: '2021-04-30 02:00:00',
      user_points_count: 529,
    },
  ],
  type: 'line',
  legend: {
    enabled: true,
    position: 'right',
  },
  yKeys: [
    {
      key: 'user_points_count',
      message: 'Users',
    },
  ],
  xKey: { key: 'day', mode: 'HOUR' },
  format: 'count',
};

const propsForDefaultMode: AreaChartProps = {
  dataset: [
    { category: 'a', y: 1 },
    { category: 'b', y: 2 },
    { category: 'c', y: 1 },
    { category: 'd', y: 2 },
    { category: 'e', y: 3 },
    { category: 'f', y: 2 },
    { category: 'g', y: 1 },
    { category: 'h', y: 2 },
    { category: 'i', y: 3 },
    { category: 'j', y: 4 },
    { category: 'k', y: 3 },
    { category: 'l', y: 2 },
    { category: 'm', y: 1 },
    { category: 'n', y: 2 },
    { category: 'o', y: 3 },
    { category: 'p', y: 4 },
    { category: 'q', y: 5 },
    { category: 'r', y: 4 },
    { category: 's', y: 3 },
    { category: 't', y: 2 },
    { category: 'u', y: 1 },
    { category: 'v', y: 2 },
    { category: 'w', y: 3 },
    { category: 'x', y: 4 },
    { category: 'y', y: 5 },
    { category: 'z', y: 6 },
  ],
  format: 'count',
  yKeys: [
    {
      key: 'y',
      message: 'Data',
    },
  ],
  xKey: { key: 'category', mode: 'DEFAULT' },
};

const propsForSimpleXKeyWithCategoryMode: AreaChartProps = {
  dataset: [
    {
      key: 'WINDOWS',
      count: 1427,
    },
    {
      key: 'MAC_OS',
      count: 460,
    },
    {
      key: 'LINUX',
      count: 303,
    },
    {
      key: 'OTHER',
      count: 251,
    },
    {
      key: 'IOS',
      count: 20,
    },
    {
      key: 'ANDROID',
      count: 17,
    },
  ],
  xKey: 'key',
  yKeys: [
    {
      key: 'count',
      message: 'count',
    },
  ],
  legend: {
    enabled: false,
  },
  format: 'count',
  type: 'area',
};

const propsForSimpleXKeyWithDateMode: AreaChartProps = {
  dataset: [
    {
      key: '2021-04-21 03:00:00',
      count: 9,
    },
    {
      key: '2021-04-22 04:00:00',
      count: 16,
    },
    {
      key: '2021-04-23 05:00:00',
      count: 25,
    },
    {
      key: '2021-04-24 06:00:00',
      count: 36,
    },
    {
      key: '2021-04-25 07:00:00',
      count: 49,
    },
    {
      key: '2021-04-26 08:00:00',
      count: 64,
    },
    {
      key: '2021-04-27 09:00:00',
      count: 81,
    },
    {
      key: '2021-04-28 10:00:00',
      count: 100,
    },
    {
      key: '2021-04-29 11:00:00',
      count: 121,
    },
    {
      key: '2021-04-30 12:00:00',
      count: 144,
    },
  ],
  xKey: 'key',
  yKeys: [
    {
      key: 'count',
      message: 'count',
    },
  ],
  legend: {
    enabled: false,
  },
  format: 'count',
  type: 'area',
};

export default {
  'Day mode': <AreaChart {...propsForDayMode} />,
  'Day mode Double Y axis': <AreaChart {...propsForDayModeDoubleYAxis} />,
  'Hour Line mode': <AreaChart {...propsForHourLineMode} />,
  'Default mode': <AreaChart {...propsForDefaultMode} />,
  'Simple xkey with date key': <AreaChart {...propsForSimpleXKeyWithDateMode} />,
  'Simple xkey with string key': <AreaChart {...propsForSimpleXKeyWithCategoryMode} />,
};

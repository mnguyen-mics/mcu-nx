import * as React from 'react';
import RadarSpiderPlot, { RadarSpiderPlotProps } from '../RadarSpiderPlot';

const props: RadarSpiderPlotProps = {
  dataset: [
    { 'yKey-count': 1000, yKey: 10.96, xKey: 'careers_education' },
    { 'yKey-count': 1000, yKey: 12.63, xKey: 'sports_outdoors' },
    { 'yKey-count': 1000, yKey: 11.15, xKey: 'arts_entertainment' },
    { 'yKey-count': 1000, yKey: 11.47, xKey: 'business' },
    { 'yKey-count': 1000, yKey: 10.53, xKey: 'science' },
    { 'yKey-count': 1000, yKey: 2.66, xKey: 'food_drink' },
    { 'yKey-count': 1000, yKey: 10.18, xKey: 'society' },
    { 'yKey-count': 1000, yKey: 11.01, xKey: 'automotive' },
    { 'yKey-count': 1000, yKey: 7.35, xKey: 'news' },
    { 'yKey-count': 1000, yKey: 1.09, xKey: 'travel' },
    { 'yKey-count': 405, yKey: 5.06, xKey: 'events' },
    { 'yKey-count': 91, yKey: 1.14, xKey: 'hobbies_creative_arts' },
    { 'yKey-count': 36, yKey: 6.45, xKey: 'shopping' },
    { 'yKey-count': 105, yKey: 1.31, xKey: 'technology_video_games' },
    { 'yKey-count': 25, yKey: 5.31, xKey: 'pets' },
    { 'yKey-count': 99, yKey: 1.24, xKey: 'family_parenting' },
    { 'yKey-count': 26, yKey: 8.32, xKey: 'health_beauty' },
    { 'yKey-count': 15, yKey: 8.19, xKey: 'style_fashion' },
    { 'yKey-count': 75, yKey: 3.94, xKey: 'home_garden_kitchen' },
  ],
  options: {
    xKey: 'xKey',
    yKeys: [{ key: 'yKey', message: '' }],
    colors: ['#00a1df'],
    tooltip: { formatter: '{point.y}%' },
  },
};

export default <RadarSpiderPlot {...props} />;

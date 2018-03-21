import messages from './messages';
import { NavigatorMenuElement } from './domain';

export const itemDisplayedOnlyIfDatamart = ['audience', 'library.catalog', 'library.exports', 'automations', 'campaigns.email', 'datastudio.query_tool'];

// ATTENTION : ALL KEYS MUST BE UNIQUE !
// AND MATCHED FEATURE FLAGS
const audienceMenu: NavigatorMenuElement = {
  key: 'audience',
  iconType: 'users',
  path: '/audience',
  translation: messages.audienceTitle,
  subMenuItems: [
    {
      key: 'audience.segments',
      path: '/audience/segments',
      translation: messages.audienceSegment,
      legacyPath: false,
    },
    {
      key: 'audience.partitions',
      path: '/audience/partitions',
      translation: messages.audiencePartitions,
      legacyPath: false,
    },
    {
      key: 'audience.segment_builder',
      path: '/audience/segment-builder',
      translation: messages.audienceSegmentBuilder,
      legacyPath: false,
    },
    {
      key: 'audience.monitoring',
      path: '/audience/timeline',
      translation: messages.audienceMonitoring,
      legacyPath: false,
    },
  ],
};

const campaignsMenu: NavigatorMenuElement = {
  key: 'campaigns',
  iconType: 'display',
  path: '/campaigns',
  translation: messages.campaignTitle,
  subMenuItems: [
    {
      key: 'campaigns.display',
      path: '/campaigns/display',
      translation: messages.campaignDisplay,
      legacyPath: false,
    },
    {
      key: 'campaigns.email',
      path: '/campaigns/email',
      translation: messages.campaignEmail,
      legacyPath: false,
    },
    {
      key: 'campaigns.goals',
      path: '/campaigns/goals',
      translation: messages.campaignGoals,
      legacyPath: false,
    },
  ],
};

const analyticsMenu: NavigatorMenuElement = {
  key: 'analytics',
  iconType: 'display',
  path: '/analytics',
  translation: messages.analyticsTitle,
  subMenuItems: [
    {
      key: 'analytics.overview',
      path: '/analytics/overview',
      translation: messages.analyticsOverview,
    },
  ]
};

const automationsMenu: NavigatorMenuElement = {
  key: 'automations',
  iconType: 'automation',
  path: '/automations',
  translation: messages.automationTitle,
  subMenuItems: [],
};

const creativesMenu: NavigatorMenuElement = {
  key: 'creatives',
  iconType: 'creative',
  path: '/creatives',
  translation: messages.creativesTitle,
  subMenuItems: [
    {
      key: 'creatives.display',
      path: '/creatives/display',
      translation: messages.creativesDisplay,
      legacyPath: false,
    },
    {
      key: 'creatives.email',
      path: '/creatives/email',
      translation: messages.creativesEmails,
      legacyPath: false,
    },
  ],
};

const libraryMenu: NavigatorMenuElement = {
  key: 'library',
  iconType: 'library',
  path: '/library',
  translation: messages.libraryTitle,
  subMenuItems: [
    {
      key: 'library.placements',
      path: '/library/placements',
      translation: messages.libraryPlacement,
      legacyPath: false,
    },
    {
      key: 'library.keywords',
      path: '/library/keywordslists',
      translation: messages.libraryKeyword,
      legacyPath: false,
    },
   
    {
      key: 'library.catalog',
      path: '/library/catalog',
      translation: messages.libraryCatalog,
      legacyPath: false,
    },
    // TO REMOVE WHEN AD RENDERER ARE CREATED
    {
      key: 'library.ad_layouts',
      path: '/library/adlayouts',
      translation: messages.libraryAdLayouts,
      legacyPath: true,
    },
    {
      key: 'library.stylesheets',
      path: '/library/stylesheets',
      translation: messages.libraryStylesheets,
      legacyPath: true,
    },
    {
      key: 'library.assets',
      path: '/library/assets',
      translation: messages.libraryAssets,
      legacyPath: false,
    },
   
  ],
};

const dataStudio: NavigatorMenuElement = {
  key: 'datastudio',
  iconType: 'data',
  path: '/datastudio',
  translation: messages.dataStudioTitle,
  subMenuItems: [
    {
      key: 'datastudio.query_tool',
      path: '/datastudio/query-tool',
      translation: messages.dataStudioQuery,
      legacyPath: false,
    },
    {
      key: 'datastudio.report',
      path: '/datastudio/report',
      translation: messages.dataStudioReport,
      legacyPath: false,
    },
    {
      key: 'datastudio.exports',
      path: '/datastudio/exports',
      translation: messages.libraryExports,
      legacyPath: false,
    },
  ],
};

export const menuDefinitions: NavigatorMenuElement[] = [
  audienceMenu,
  analyticsMenu,
  campaignsMenu,
  automationsMenu,
  creativesMenu,
  libraryMenu,
  dataStudio,
  analyticsMenu,
];

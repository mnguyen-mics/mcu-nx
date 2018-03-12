import messages from './messages';

export const itemDisplayedOnlyIfDatamart = ['audience', 'library.catalog', 'library.exports', 'automations', 'campaigns.email', 'datastudio.query_tool'];

export interface Menu {
  key: string;
  iconType?: string;
  path: string;
  translation: {id: string, defaultMessage: string};
  translationId?: string;
  legacyPath?: boolean;
  subMenuItems?: Menu[];
}
// ATTENTION : ALL KEYS MUST BE UNIQUE !
// AND MATCHED FEATURE FLAGS
const audienceMenu: Menu = {
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

const campaignsMenu: Menu = {
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
      path: '/campaigns/goal',
      translation: messages.campaignGoals,
      legacyPath: false,
    },
  ],
};

const analyticsMenu: Menu = {
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

const automationsMenu: Menu = {
  key: 'automations',
  iconType: 'automation',
  path: '/automations',
  translation: messages.automationTitle,
  subMenuItems: [],
};

const creativesMenu: Menu = {
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

const libraryMenu: Menu = {
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
    {
      key: 'library.exports',
      path: '/library/exports',
      translation: messages.libraryExports,
      legacyPath: false,
    },
  ],
};

const dataStudio: Menu = {
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
    }
  ],
};

export const itemDefinitions: Menu[] = [
  audienceMenu,
  analyticsMenu,
  campaignsMenu,
  automationsMenu,
  creativesMenu,
  libraryMenu,
  dataStudio,
  analyticsMenu,
];

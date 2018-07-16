import { campaignsDefinition } from './campaignRoutes';
import { automationDefinition } from './automationRoutes';
import { audienceDefinition } from './audienceRoutes';
import { creativesDefinition } from './creativeRoutes';
import { libraryDefinition } from './libraryRoutes';
import { datastudioDefinition } from './datastudioRoutes';
import { analyticsDefinition } from './analyticsRoutes';
import { NavigatorMenuDefinition, generateMissingdefinitionItemFromRoute } from './domain';
import messages from '../containers/Menu/messages'



const audienceMenuDefinition: NavigatorMenuDefinition = {
  iconType: 'users',
  translation: messages.audienceTitle,
  type: 'multi',
  subMenuItems: [
    {
      ...generateMissingdefinitionItemFromRoute(audienceDefinition.audienceSegmentList),
      translation: messages.audienceSegment
    },
    {
      ...generateMissingdefinitionItemFromRoute(audienceDefinition.audiencePartitionsList),
      translation: messages.audiencePartitions
    },
    {
      ...generateMissingdefinitionItemFromRoute(audienceDefinition.audienceSegmentBuilder),
      translation: messages.audienceSegmentBuilder
    },
    {
      ...generateMissingdefinitionItemFromRoute(audienceDefinition.audienceTimeline),
      translation: messages.audienceMonitoring
    },
  ]
}

const campaignsMenuDefinition: NavigatorMenuDefinition = {
  iconType: 'display',
  translation: messages.campaignTitle,
  type: 'multi',
  subMenuItems: [
    {
      ...generateMissingdefinitionItemFromRoute(campaignsDefinition.campaignDisplayList),
      translation: messages.campaignDisplay
    },
    {
      ...generateMissingdefinitionItemFromRoute(campaignsDefinition.campaignEmailList),
      translation: messages.campaignEmail
    },
    {
      ...generateMissingdefinitionItemFromRoute(campaignsDefinition.campaignGoalList),
      translation: messages.campaignGoals
    },
  ]
}

const automationsMenuDefinition: NavigatorMenuDefinition = {
  iconType: 'automation',
  translation: messages.automationTitle,
  type: 'simple',
  ...generateMissingdefinitionItemFromRoute(automationDefinition.automationsList),
}

const analyticsMenuDefinition: NavigatorMenuDefinition = {
  iconType: 'automation',
  translation: messages.analyticsTitle,
  type: 'multi',
  subMenuItems: [
    {
      ...generateMissingdefinitionItemFromRoute(analyticsDefinition.analyticsOverview),
      translation: messages.analyticsOverview,
    }
  ]
}

const creativesMenuDefinition: NavigatorMenuDefinition = {
  iconType: 'creative',
  translation: messages.creativesTitle,
  type: 'multi',
  subMenuItems: [
    {
      ...generateMissingdefinitionItemFromRoute(creativesDefinition.creativeDisplayList),
      translation: messages.creativesDisplay,
    },
    {
      ...generateMissingdefinitionItemFromRoute(creativesDefinition.creativeNativeList),
      translation: messages.creativesNative,
    },
    {
      ...generateMissingdefinitionItemFromRoute(creativesDefinition.creativeEmailList),
      translation: messages.creativesEmails,
    },
  ]
}

const libraryMenuDefinition: NavigatorMenuDefinition = {
  iconType: 'library',
  translation: messages.libraryTitle,
  type: 'multi',
  subMenuItems: [
    {
      ...generateMissingdefinitionItemFromRoute(libraryDefinition.libraryPlacementList),
      translation: messages.libraryPlacement,
    },
    {
      ...generateMissingdefinitionItemFromRoute(libraryDefinition.libraryKeywordList),
      translation: messages.libraryKeyword,
    },
    {
      path: '/library/adlayouts',
      requiredFeature: 'library.ad_layouts',
      translation: messages.libraryAdLayouts,
      legacyPath: true,
    },
    {
      requiredFeature: 'library.stylesheets',
      path: '/library/stylesheets',
      translation: messages.libraryStylesheets,
      legacyPath: true,
    },
    {
      ...generateMissingdefinitionItemFromRoute(libraryDefinition.libraryDealList),
      translation: messages.libraryDealList,
    },
    {
      ...generateMissingdefinitionItemFromRoute(libraryDefinition.libraryCatalogList),
      translation: messages.libraryCatalog,
    },
    {
      ...generateMissingdefinitionItemFromRoute(libraryDefinition.libraryAssetList),
      translation: messages.libraryAssets,
    },
  ]
}

const datastudioMenuDefinition: NavigatorMenuDefinition = {
  iconType: 'data',
  translation: messages.dataStudioTitle,
  type: 'multi',
  subMenuItems: [
    {
      ...generateMissingdefinitionItemFromRoute(datastudioDefinition.datastudioQueryTool),
      translation: messages.dataStudioQuery,
    },
    {
      ...generateMissingdefinitionItemFromRoute(datastudioDefinition.datastudioReport),
      translation: messages.dataStudioReport,
    },
    {
      ...generateMissingdefinitionItemFromRoute(datastudioDefinition.datastudioExportList),
      translation: messages.libraryExports,
    },
  ]
}



export const menuDefinitions: NavigatorMenuDefinition[] = [
  audienceMenuDefinition,
  analyticsMenuDefinition,
  campaignsMenuDefinition,
  automationsMenuDefinition,
  creativesMenuDefinition,
  libraryMenuDefinition,
  datastudioMenuDefinition
];
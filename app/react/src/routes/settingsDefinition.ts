import { settingsDefinition } from './settingsRoutes';
import messages from '../containers/Menu/messages';
import { NavigatorMenuDefinition, generateMissingdefinitionItemFromRoute } from './domain';


const accountSettingsDefinition: NavigatorMenuDefinition = {
  iconType: 'users',
  translation: messages.accountSettingsTitle,
  type: 'multi',
  subMenuItems: [
    {
      ...generateMissingdefinitionItemFromRoute(
        settingsDefinition.settingsAccountProfileList,
      ),
      translation: messages.accountSettingsProfile,
    },
    {
      ...generateMissingdefinitionItemFromRoute(
        settingsDefinition.settingsAccountApiTokenList,
      ),
      translation: messages.accountSettingsApiToken,
    },
    
  ],
};

const datamartSettingsDefinition: NavigatorMenuDefinition = {
  iconType: 'data',
  translation: messages.datamartSettingsTitle,
  type: 'multi',
  subMenuItems: [
    {
      ...generateMissingdefinitionItemFromRoute(
        settingsDefinition.settingsDatamartSitesList,
      ),
      translation: messages.siteSettingsTitle,
    },
    {
      ...generateMissingdefinitionItemFromRoute(
        settingsDefinition.settingsDatamartMobileAppList,
      ),
      translation: messages.mobileAppsSettingsTitle,
    },
    {
      ...generateMissingdefinitionItemFromRoute(
        settingsDefinition.settingsDatamartVisitAnalyzerList,
      ),
      translation: messages.visitAnalyzerSettingsTitle,
    },
    {
      ...generateMissingdefinitionItemFromRoute(
        settingsDefinition.settingsDatamartDatamartList,
      ),
      translation: messages.myDatamartSettingsTitle,
    },
  ],
};

const organisationSettingsDefinition: NavigatorMenuDefinition = {
  iconType: 'settings',
  translation: messages.organisationSettingsTitle,
  type: 'multi',
  subMenuItems: [
    {
      ...generateMissingdefinitionItemFromRoute(
        settingsDefinition.settingsOrganisationLabelsList,
      ),
      translation: messages.labelsSettingsTitle,
    },
    {
      ...generateMissingdefinitionItemFromRoute(
        settingsDefinition.settingsOrganisationProfileList,
      ),
      translation: messages.orgSettingsTitle,
    },
    {
      ...generateMissingdefinitionItemFromRoute(
        settingsDefinition.settingsOrganisationUserList,
      ),
      translation: messages.usersSettingsTitle,
    },
  ],
};

const campaignSettingsDefinition: NavigatorMenuDefinition = {
  iconType: 'display',
  translation: messages.campaignSettingsTitle,
  type: 'multi',
  subMenuItems: [
    {
      ...generateMissingdefinitionItemFromRoute(
        settingsDefinition.settingsCampaignBidOptimizerList,
      ),
      translation: messages.campaignSettingsbidOptimizer,
    },
    {
      ...generateMissingdefinitionItemFromRoute(
        settingsDefinition.settingsCampaignAttributionModelList,
      ),
      translation: messages.campaignSettingsAttributionModels,
    },
    {
      ...generateMissingdefinitionItemFromRoute(
        settingsDefinition.settingsCampaignEmailRouterList,
      ),
      translation: messages.campaignSettingsEmailRouters,
    },
    {
      ...generateMissingdefinitionItemFromRoute(
        settingsDefinition.settingsCampaignRecommenderList,
      ),
      translation: messages.campaignSettingsRecommenders,
    },
  ],
};

const serviceSettingsDefinition: NavigatorMenuDefinition = {
  iconType: 'file',
  translation: messages.serviceOffersSettingsTitle,
  type: 'multi',
  subMenuItems: [
    {
      ...generateMissingdefinitionItemFromRoute(
        settingsDefinition.settingsSubscribedOffersList,
      ),
      translation: messages.subscribedOffersSettingsList,
    },
    {
      ...generateMissingdefinitionItemFromRoute(
        settingsDefinition.settingsServiceCatalog,
      ),
      translation: messages.serviceCatalogSettingsList,
    },
    {
      ...generateMissingdefinitionItemFromRoute(
        settingsDefinition.settingsMyOffers,
      ),
      translation: messages.offersSettingsList,
    },
  ],
};


export const settingsDefinitions: NavigatorMenuDefinition[] = [
  accountSettingsDefinition,
  organisationSettingsDefinition,
  datamartSettingsDefinition,
  campaignSettingsDefinition,
  serviceSettingsDefinition
];

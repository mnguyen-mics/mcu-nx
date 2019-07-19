import { SitesListPage } from '../containers/Settings/DatamartSettings/Sites/List';
import { DatamartsListPage } from '../containers/Settings/DatamartSettings/Datamarts/List';
import { MobileApplicationsListPage } from '../containers/Settings/DatamartSettings/MobileApplications/List';

import { LabelsListPage } from '../containers/Settings/OrganisationSettings/Labels';
import UserListPage from '../containers/Settings/OrganisationSettings/Users/List/UserPage';
import OrganisationAccount from '../containers/Settings/OrganisationSettings/OrganisationAccount/OrganisationAccount';

import { ProfileSettingsPage } from '../containers/Settings/ProfileSettings/Profile';

import MobileApplicationEditPage from '../containers/Settings/DatamartSettings/MobileApplications/Edit/MobileApplicationEditPage';
import SiteEditPage from '../containers/Settings/DatamartSettings/Sites/Edit/SiteEditPage';
import DatamartEditPage from '../containers/Settings/DatamartSettings/Datamarts/Edit/DatamartEditPage';

import { BidOptimizerContent } from '../containers/Settings/CampaignSettings/BidOptimizer/List';
import { CreateEditBidOptimizer } from '../containers/Settings/CampaignSettings/BidOptimizer/Edit';

import { AttributionModelContent } from '../containers/Settings/CampaignSettings/AttributionModel/List'
import EditAttributionModelPage from '../containers/Settings/CampaignSettings/AttributionModel/Edit/EditAttributionModelPage'

import { EmailRouterContent } from '../containers/Settings/CampaignSettings/EmailRouter/List';
import { CreateEditEmailRouter } from '../containers/Settings/CampaignSettings/EmailRouter/Edit';

import { RecommenderContent } from '../containers/Settings/CampaignSettings/Recommender/List';
import { CreateEditRecommender } from '../containers/Settings/CampaignSettings/Recommender/Edit';

import { VisitAnalyzerContent } from '../containers/Settings/DatamartSettings/VisitAnalyzer/List';
import { CreateEditVisitAnalyzer } from '../containers/Settings/DatamartSettings/VisitAnalyzer/Edit';
import {
  NavigatorRoute,
  NavigatorDefinition,
  generateRoutesFromDefinition,
} from './domain';

import ServiceUsageReportListPage from '../containers/Settings/DatamartSettings/ServiceUsageReport/List/ServiceUsageReportListPage';
import EditUserPage from '../containers/Settings/OrganisationSettings/Users/Edit/EditUserPage';
import ApiTokenListPage from '../containers/Settings/ProfileSettings/ApiToken/List/ApiTokenListPage';
import EditApiTokenPage from '../containers/Settings/ProfileSettings/ApiToken/Edit/EditApiTokenPage';
import SubscribedOffersListPage from '../containers/Settings/ServicesSettings/SubscribedOffers/List/SubscribedOffersListPage';
import MyOffersPage from '../containers/Settings/ServicesSettings/MyOffers/MyOffersPage';
import SubscribedOfferServiceItemListPage from '../containers/Settings/ServicesSettings/SubscribedOffers/List/SubscribedOfferServiceItemListPage';
import MyOfferServiceItemListPage from '../containers/Settings/ServicesSettings/MyOffers/MyOfferServiceItemListPage';
import CreateOfferPage from '../containers/Settings/ServicesSettings/MyOffers/CreateOfferPage';
import SourcesListPage from '../containers/Settings/DatamartSettings/Sources/List/SourcesListPage';
import DatamartViewPage from '../containers/Settings/DatamartSettings/Datamarts/Dashboard/DatamartDashboardPage';
import MlAlgorithmsPage from '../containers/Settings/OrganisationSettings/MlAlgorithms/List/MlAlgorithmsPage';
import MlAlgorithmEditPage from '../containers/Settings/OrganisationSettings/MlAlgorithms/Edit/MlAlgorithmEditPage';
import MlModelsPage from '../containers/Settings/OrganisationSettings/MlAlgorithms/MlModels/MlAlgorithmModelsPage';
import { StoredProceduresContent } from '../containers/Settings/DatamartSettings/StoredProcedures/List';
import CreateEditStoredProcedure from '../containers/Settings/DatamartSettings/StoredProcedures/Edit/EditStoredProcedurePage';
// import ServiceCatalogPage from '../containers/Settings/ServicesSettings/MyServiceCatalog/MyServiceCatalogPage';
// import MyOffersPage from '../containers/Settings/ServicesSettings/MyOffers/MyOffersPage';

export const settingsDefinition: NavigatorDefinition = {
  /*
  *
  * DATAMART SETTINGS 
  */

  // sites
  settingsDatamartSitesList: {
    path: '/settings/datamart/sites',
    layout: 'settings',
    contentComponent: SitesListPage,
    requiredFeature: 'datamartSettings.sites',
    requireDatamart: true,
  },

  settingsDatamartSitesCreation: {
    path: '/settings/datamart/sites/create',
    layout: 'edit',
    editComponent: SiteEditPage,
    requiredFeature: 'datamartSettings.sites',
    requireDatamart: true,
  },

  settingsDatamartSitesEdition: {
    path: '/settings/datamart/:datamartId/sites/:siteId/edit',
    layout: 'edit',
    editComponent: SiteEditPage,
    requiredFeature: 'datamartSettings.sites',
    requireDatamart: true,
  },

  // mobile apps
  settingsDatamartMobileAppList: {
    path: '/settings/datamart/mobile_applications',
    layout: 'settings',
    contentComponent: MobileApplicationsListPage,
    requiredFeature: 'datamartSettings.mobile_applications',
    requireDatamart: true,
  },
  settingsDatamartMobileAppCreation: {
    path: '/settings/datamart/mobile_application/create',
    layout: 'edit',
    editComponent: MobileApplicationEditPage,
    requiredFeature: 'datamartSettings.mobile_applications',
    requireDatamart: true,
  },
  settingsDatamartMobileAppEdition: {
    path: '/settings/datamart/:datamartId/mobile_application/:mobileApplicationId/edit',
    layout: 'edit',
    editComponent: MobileApplicationEditPage,
    requiredFeature: 'datamartSettings.mobile_applications',
    requireDatamart: true,
  },
  // datamart
  settingsDatamartDatamartList: {
    path: '/settings/datamart/my_datamart',
    layout: 'settings',
    contentComponent: DatamartsListPage,
    requiredFeature: 'datamartSettings.datamarts',
    requireDatamart: true,
  },
  settingsDatamartDatamartView: {
    path: '/settings/datamart/my_datamart/:datamartId',
    layout: 'settings',
    contentComponent: DatamartViewPage,
    requiredFeature: 'datamartSettings.datamarts',
    requireDatamart: true,
  },
  settingsDatamartDatamartEdition: {
    path: '/settings/datamart/my_datamart/:datamartId/edit',
    layout: 'edit',
    editComponent: DatamartEditPage,
    requiredFeature: 'datamartSettings.datamarts',
    requireDatamart: true,
  },
  settingsDatamartServiceUsageReport: {
    path: '/settings/datamart/my_datamart/:datamartId/service_usage_report',
    layout: 'settings',
    contentComponent: ServiceUsageReportListPage,
    requiredFeature: 'datamartSettings.service_usage_report',
    requireDatamart: true,
  },
  settingsDatamartSources: {
    path: '/settings/datamart/my_datamart/:datamartId/sources',
    layout: 'settings',
    contentComponent: SourcesListPage,
    requiredFeature: 'datamartSettings.datamarts',
    requireDatamart: true,
  },

  // visit analyzer
  settingsDatamartVisitAnalyzerList: {
    path: '/settings/datamart/visit_analyzers',
    layout: 'settings',
    contentComponent: VisitAnalyzerContent,
    requiredFeature: 'datamartSettings.visit_analyzers',
    requireDatamart: true,
  },
  settingsDatamartVisitAnalyzerEdition: {
    path: '/settings/datamart/visit_analyzers/:visitAnalyzerId(\\d+)/edit',
    layout: 'edit',
    editComponent: CreateEditVisitAnalyzer,
    requiredFeature: 'datamartSettings.visit_analyzers',
    requireDatamart: true,
  },
  settingsDatamartVisitAnalyzerCreation: {
    path: '/settings/datamart/visit_analyzers/create',
    layout: 'edit',
    editComponent: CreateEditVisitAnalyzer,
    requiredFeature: 'datamartSettings.visit_analyzers',
    requireDatamart: true,
  },

  // stored procedure 
  settingsDatamartStoredProcedureList: {
    path: '/settings/datamart/stored_procedures',
    layout: 'settings',
    contentComponent: StoredProceduresContent,
    requiredFeature: 'datamartSettings.stored_procedure',
    requireDatamart: true,
  },
  settingsDatamartStoredProcedureEdition: {
    path: '/settings/datamart/stored_procedures/:storedProcedureId(\\d+)/edit',
    layout: 'edit',
    editComponent: CreateEditStoredProcedure,
    requiredFeature: 'datamartSettings.stored_procedure',
    requireDatamart: true,
  },
  settingsDatamartStoredProcedureCreation: {
    path: '/settings/datamart/stored_procedures/create',
    layout: 'edit',
    editComponent: CreateEditStoredProcedure,
    requiredFeature: 'datamartSettings.stored_procedure',
    requireDatamart: true,
  },


  settingsDatamartMlAlgorithmList: {
    path: '/settings/datamart/ml_algorithms',
    layout: 'settings',
    contentComponent: MlAlgorithmsPage,
    requiredFeature: 'datamartSettings.mlAlgorithms'
  },
  settingsDatamartMlAlgorithmCreation: {
    path: '/settings/datamart/ml_algorithms/create',
    layout: 'edit',
    editComponent: MlAlgorithmEditPage,
    requiredFeature: 'datamartSettings.mlAlgorithms'
  },
  settingsDatamartMlAlgorithmEdit: {
    path: '/settings/datamart/ml_algorithms/:mlAlgorithmId/edit',
    layout: 'edit',
    editComponent: MlAlgorithmEditPage,
    requiredFeature: 'datamartSettings.mlAlgorithms'
  },
  settingsDatamartMlModelsList: {
    path: '/settings/datamart/ml_algorithms/:mlAlgorithmId/models',
    layout: 'settings',
    contentComponent: MlModelsPage,
    requiredFeature: 'datamartSettings.mlAlgorithms'
  },


  /*
  ORGANISATION SETTINGS
  */

  // labels
  settingsOrganisationLabelsList: {
    path: '/settings/organisation/labels',
    layout: 'settings',
    contentComponent: LabelsListPage,
    requiredFeature: 'organisationSettings.labels',
  },

  // profile
  settingsOrganisationProfileList: {
    path: '/settings/organisation/profile',
    layout: 'settings',
    contentComponent: OrganisationAccount,
    requiredFeature: 'organisationSettings.settings',
  },

  // users
  settingsOrganisationUserList: {
    path: '/settings/organisation/users',
    layout: 'settings',
    contentComponent: UserListPage,
    requiredFeature: 'organisationSettings.users',
  },
  settingsOrganisationUserEdition: {
    path: '/settings/organisation/users/:userId/edit',
    layout: 'edit',
    editComponent: EditUserPage,
    requiredFeature: 'organisationSettings.users',
  },
  settingsOrganisationUserCreation: {
    path: '/settings/organisation/users/create',
    layout: 'edit',
    editComponent: EditUserPage,
    requiredFeature: 'organisationSettings.users',
  },
  /*
  ACCOUNT SETTINGS
  
  */

  settingsAccountProfileList: {
    path: '/settings/account/my_profile',
    layout: 'settings',
    contentComponent: ProfileSettingsPage,
    requiredFeature: 'accountSettings.profile',
  },
  settingsAccountApiTokenList: {
    path: '/settings/account/api_tokens',
    layout: 'settings',
    contentComponent: ApiTokenListPage,
    requiredFeature: 'accountSettings.api_tokens',
  },
  settingsAccountApiTokenEdition: {
    path: '/settings/account/api_tokens/:apiTokenId/edit',
    layout: 'edit',
    editComponent: EditApiTokenPage,
    requiredFeature: 'accountSettings.api_tokens',
  },
  settingsAccountApiTokenCreation: {
    path: '/settings/account/api_tokens/create',
    layout: 'edit',
    editComponent: EditApiTokenPage,
    requiredFeature: 'accountSettings.api_tokens',
  },

  /*
  
    CAMPAIGNS SETTINGS
  
  */

  // bid optimizer
  settingsCampaignBidOptimizerList: {
    path: '/settings/campaigns/bid_optimizer',
    layout: 'settings',
    contentComponent: BidOptimizerContent,
    requiredFeature: 'campaignsSettings.bid_optimizers',
  },

  settingsCampaignBidOptimizerEdition: {
    path: '/settings/campaigns/bid_optimizer/:bidOptimizerId(\\d+)/edit',
    layout: 'edit',
    editComponent: CreateEditBidOptimizer,
    requiredFeature: 'campaignsSettings.bid_optimizers',
  },
  settingsCampaignBidOptimizerCreation: {
    path: '/settings/campaigns/bid_optimizer/create',
    layout: 'edit',
    editComponent: CreateEditBidOptimizer,
    requiredFeature: 'campaignsSettings.bid_optimizers',
  },

  // attribution model
  settingsCampaignAttributionModelList: {
    path: '/settings/campaigns/attribution_models',
    layout: 'settings',
    contentComponent: AttributionModelContent,
    requiredFeature: 'campaignsSettings.attribution_models',
  },

  settingsCampaignAttributionModelEdition: {
    path:
      '/settings/campaigns/attribution_models/:attributionModelId(\\d+)/edit',
    layout: 'edit',
    editComponent: EditAttributionModelPage,
    requiredFeature: 'campaignsSettings.attribution_models',
  },
  settingsCampaignAttributionModelCreation: {
    path: '/settings/campaigns/attribution_models/create',
    layout: 'edit',
    editComponent: EditAttributionModelPage,
    requiredFeature: 'campaignsSettings.attribution_models',
  },

  // email routers
  settingsCampaignEmailRouterList: {
    path: '/settings/campaigns/email_routers',
    layout: 'settings',
    contentComponent: EmailRouterContent,
    requiredFeature: 'campaignsSettings.email_routers',
  },
  settingsCampaignEmailRouterEdition: {
    path: '/settings/campaigns/email_routers/:emailRouterId(\\d+)/edit',
    layout: 'edit',
    editComponent: CreateEditEmailRouter,
    requiredFeature: 'campaignsSettings.email_routers',
  },
  settingsCampaignEmailRouterCreation: {
    path: '/settings/campaigns/email_routers/create',
    layout: 'edit',
    editComponent: CreateEditEmailRouter,
    requiredFeature: 'campaignsSettings.email_routers',
  },

  // recommenders
  settingsCampaignRecommenderList: {
    path: '/settings/campaigns/recommenders',
    layout: 'settings',
    contentComponent: RecommenderContent,
    requiredFeature: 'campaignsSettings.recommenders',
  },
  settingsCampaignRecommenderEdition: {
    path: '/settings/campaigns/recommenders/:recommenderId(\\d+)/edit',
    layout: 'edit',
    editComponent: CreateEditRecommender,
    requiredFeature: 'campaignsSettings.recommenders',
  },
  settingsCampaignRecommenderCreation: {
    path: '/settings/campaigns/recommenders/create',
    layout: 'edit',
    editComponent: CreateEditRecommender,
    requiredFeature: 'campaignsSettings.recommenders',
  },

  /*
  
    SERVICE OFFERS SETTINGS
  
  */

  settingsSubscribedOffersList: {
    path: '/settings/services/subscribed_offers',
    layout: 'settings',
    contentComponent: SubscribedOffersListPage,
    requiredFeature: 'servicesSettings.subscribed_offers',
  },
  settingsMyOffersList: {
    path: '/settings/services/my_offers',
    layout: 'settings',
    contentComponent: MyOffersPage,
    requiredFeature: 'servicesSettings.my_offers',
  },
  settingsSubscribedOfferServiceItemConditionList: {
    path:
      '/settings/services/subscribed_offers/:offerId/service_item_conditions',
    layout: 'settings',
    contentComponent: SubscribedOfferServiceItemListPage,
    requiredFeature: 'servicesSettings.subscribed_offers',
  },
  settingsMyOfferServiceItemConditionList: {
    path:
      '/settings/services/my_offers/:offerId/service_item_conditions',
    layout: 'settings',
    contentComponent: MyOfferServiceItemListPage,
    requiredFeature: 'servicesSettings.my_offers',
  },
  settingsMyOffersCreate: {
    path: '/settings/services/my_offers/create',
    layout: 'edit',
    editComponent: CreateOfferPage,
    requiredFeature: 'servicesSettings.my_offers',
  },
  settingsMyOffersEdit: {
    path: '/settings/services/my_offers/:offerId/edit',
    layout: 'edit',
    editComponent: CreateOfferPage,
    requiredFeature: 'servicesSettings.my_offers',
  },  
  // settingsServiceCatalog: {
  //   path: '/settings/services/service_catalog',
  //   layout: 'settings',
  //   contentComponent: ServiceCatalogPage,
  //   requiredFeature: 'servicesSettings.my_service_catalog',
  // },
  // settingsMyOffers: {
  //   path: '/settings/services/my_offers',
  //   layout: 'settings',
  //   contentComponent: MyOffersPage,
  //   requiredFeature: 'servicesSettings.my_offers',
  // },
};

export const settingsRoutes: NavigatorRoute[] = generateRoutesFromDefinition(
  settingsDefinition,
);

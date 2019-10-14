import { EmailRouterService } from './../services/Library/EmailRoutersService';
import {
  VisitAnalyzerService,
  IVisitAnalyzerService,
} from './../services/Library/VisitAnalyzerService';
import AudienceSegmentFeedService, {
  IAudienceSegmentFeedService,
  AudienceFeedType,
} from './../services/AudienceSegmentFeedService';
import {
  DisplayCampaignService,
  IDisplayCampaignService,
} from './../services/DisplayCampaignService';
import AdGroupFormService, {
  IAdGroupFormService,
} from './../containers/Campaigns/Display/Edit/AdGroup/AdGroupFormService';
import {
  IDisplayCreativeFormService,
  DisplayCreativeFormService,
} from './../containers/Creative/DisplayAds/Edit/DisplayCreativeFormService';
import {
  NavigatorService,
  INavigatorService,
} from './../services/NavigatorService';
import { GeonameService, IGeonameService } from './../services/GeonameService';
import { ConsentService, IConsentService } from './../services/ConsentService';
import {
  CommunityService,
  ICommunityService,
} from './../services/CommunityServices';
import UserDataService, {
  IUserDataService,
} from './../services/UserDataService';
import { QueryService, IQueryService } from './../services/QueryService';
import { AutomationFormService } from './../containers/Automations/Edit/AutomationFormService';
import {
  IAudienceFeedFormService,
  AudienceFeedFormService,
} from './../containers/Audience/Segments/Edit/AudienceFeedForm/AudienceFeedFormService';
import {
  OverlapInterval,
  IOverlapInterval,
} from './../containers/Audience/Segments/Dashboard/OverlapServices';
import {
  IAudienceSegmentFormService,
  AudienceSegmentFormService,
} from './../containers/Audience/Segments/Edit/AudienceSegmentFormService';
import {
  IAudiencePartitionsService,
  AudiencePartitionsService,
} from './../services/AudiencePartitionsService';
import {
  AudienceSegmentService,
  IAudienceSegmentService,
} from './../services/AudienceSegmentService';
import getDecorators from 'inversify-inject-decorators';
import { Container, interfaces } from 'inversify';
import {
  IKeywordListService,
  KeywordListService,
} from '../services/Library/KeywordListsService';
import {
  IKeywordListFormService,
  KeywordListFormService,
} from '../containers/Library/Keyword/Edit/KeywordListFormService';
import {
  IDisplayCampaignFormService,
  DisplayCampaignFormService,
} from './../containers/Campaigns/Display/Edit/DisplayCampaignFormService';
import { IImportService, ImportService } from '../services/ImportService';
import { TYPES } from '../constants/types';
import {
  IAudienceExternalFeedService,
  AudienceExternalFeedService,
} from '../services/AudienceExternalFeedService';
import {
  IAudienceTagFeedService,
  AudienceTagFeedService,
} from '../services/AudienceTagFeedService';
import {
  IDisplayNetworkService,
  DisplayNetworkService,
} from '../services/DisplayNetworkService';
import {
  IDealListService,
  DealListService,
} from '../services/Library/DealListService';
import {
  IDealListFormService,
  DealListFormService,
} from '../containers/Library/Deal/Edit/DealListFormService';
import CompartmentService, {
  IComparmentService,
} from '../services/CompartmentService';
import { IScenarioService, ScenarioService } from '../services/ScenarioService';
import { IAutomationFormService } from '../containers/Automations/Edit/AutomationFormService';
import {
  IGoalFormService,
  GoalFormService,
} from '../containers/Campaigns/Goal/Edit/GoalFormService';
import {
  IExportService,
  ExportService,
} from '../services/Library/ExportService';
import { IUsersService, UsersService } from '../services/UsersService';
import {
  IMonitoringService,
  MonitoringService,
} from '../containers/Audience/Timeline/MonitoringService';
import {
  MlAlgorithmService,
  IMlAlgorithmService,
} from '../services/MlAlgorithmService';
import {
  IMlAlgorithmModelService,
  MlAlgorithmModelService,
} from '../services/MlAlgorithmModelService';

import {
  IMlFunctionService,
  MlFunctionService,
} from '../services/MlFunctionService';
import { ApiTokenService, IApiTokenService } from '../services/ApiTokenService';
import { ChannelService, IChannelService } from './../services/ChannelService';
import { ISettingsService, SettingsService } from '../services/SettingsService';
import { IDashboardService, DashboardService } from '../services/DashboardServices';
import {
  IAssetFileService,
  AssetFileService,
} from '../services/Library/AssetFileService';
import { PluginService, IPluginService } from '../services/PluginService';
import { CreativeService, ICreativeService } from '../services/CreativeService';
import { IEmailRouterService } from '../services/Library/EmailRoutersService';

const container = new Container();

container
  .bind<IKeywordListService>(TYPES.IKeywordListService)
  .to(KeywordListService);
container
  .bind<IKeywordListFormService>(TYPES.IKeywordListFormService)
  .to(KeywordListFormService);
container
  .bind<IAudienceSegmentService>(TYPES.IAudienceSegmentService)
  .to(AudienceSegmentService);
container
  .bind<IAudienceFeedFormService>(TYPES.IAudienceFeedFormService)
  .to(AudienceFeedFormService);
container
  .bind<IAudienceSegmentFormService>(TYPES.IAudienceSegmentFormService)
  .to(AudienceSegmentFormService);
container
  .bind<IAudiencePartitionsService>(TYPES.IAudiencePartitionsService)
  .to(AudiencePartitionsService);
container.bind<IOverlapInterval>(TYPES.IOverlapInterval).to(OverlapInterval);
container
  .bind<IDisplayCampaignFormService>(TYPES.IDisplayCampaignFormService)
  .to(DisplayCampaignFormService);
container
  .bind<IAudienceExternalFeedService>(TYPES.IAudienceExternalFeedService)
  .to(AudienceExternalFeedService);
container
  .bind<IAudienceSegmentFeedService>(TYPES.IAudienceSegmentFeedService)
  .to(AudienceSegmentFeedService);
container
  .bind<IAudienceTagFeedService>(TYPES.IAudienceTagFeedService)
  .toConstructor(AudienceTagFeedService);
container.bind<IImportService>(TYPES.IImportService).to(ImportService);
container.bind<IExportService>(TYPES.IExportService).to(ExportService);
container.bind<IScenarioService>(TYPES.IScenarioService).to(ScenarioService);
container
  .bind<IDisplayNetworkService>(TYPES.IDisplayNetworkService)
  .to(DisplayNetworkService);
container.bind<IDealListService>(TYPES.IDealListService).to(DealListService);
container
  .bind<IDealListFormService>(TYPES.IDealListFormService)
  .to(DealListFormService);
container
  .bind<IComparmentService>(TYPES.ICompartmentService)
  .to(CompartmentService);
container
  .bind<IAutomationFormService>(TYPES.IAutomationFormService)
  .to(AutomationFormService);
container.bind<IQueryService>(TYPES.IQueryService).to(QueryService);
container.bind<IGoalFormService>(TYPES.IGoalFormService).to(GoalFormService);
container.bind<IUserDataService>(TYPES.IUserDataService).to(UserDataService);
container.bind<IUsersService>(TYPES.IUsersService).to(UsersService);
container
  .bind<IMonitoringService>(TYPES.IMonitoringService)
  .to(MonitoringService);
container
  .bind<IMlFunctionService>(TYPES.IMlFunctionService)
  .to(MlFunctionService);

container
  .bind<IMlAlgorithmService>(TYPES.IMlAlgorithmService)
  .to(MlAlgorithmService);
container
  .bind<IMlAlgorithmModelService>(TYPES.IMlAlgorithmModelService)
  .to(MlAlgorithmModelService);
container.bind<INavigatorService>(TYPES.INavigatorService).to(NavigatorService);
container.bind<IApiTokenService>(TYPES.IApiTokenService).to(ApiTokenService);
container.bind<IChannelService>(TYPES.IChannelService).to(ChannelService);
container.bind<ICommunityService>(TYPES.ICommunityService).to(CommunityService);
container.bind<IConsentService>(TYPES.IConsentService).to(ConsentService);
container.bind<IGeonameService>(TYPES.IGeonameService).to(GeonameService);
container.bind<ISettingsService>(TYPES.ISettingsService).to(SettingsService);
container.bind<IDashboardService>(TYPES.IDashboardService).to(DashboardService);
container.bind<IAssetFileService>(TYPES.IAssetFileService).to(AssetFileService);
container.bind<IPluginService>(TYPES.IPluginService).to(PluginService);
container
  .bind<ICreativeService<any>>(TYPES.ICreativeService)
  .to(CreativeService);
container
  .bind<IDisplayCreativeFormService>(TYPES.IDisplayCreativeFormService)
  .to(DisplayCreativeFormService);
container
  .bind<IAdGroupFormService>(TYPES.IAdGroupFormService)
  .to(AdGroupFormService);
container
  .bind<IDisplayCampaignService>(TYPES.IDisplayCampaignService)
  .to(DisplayCampaignService);
container
  .bind<IVisitAnalyzerService>(TYPES.IVisitAnalyzerService)
  .to(VisitAnalyzerService);
container
  .bind<IEmailRouterService>(TYPES.IEmailRouterService)
  .to(EmailRouterService);

container
  .bind<interfaces.Factory<IAudienceExternalFeedService>>(
    TYPES.IAudienceExternalFeedServiceFactory,
  )
  .toFactory<IAudienceExternalFeedService>((context: interfaces.Context) => {
    return (segmentId: string) => {
      const audienceExternalFeedService = context.container.get<
        IAudienceExternalFeedService
      >(TYPES.IAudienceExternalFeedService);
      audienceExternalFeedService.segmentId = segmentId;
      return audienceExternalFeedService;
    };
  });
container
  .bind<interfaces.Factory<IAudienceTagFeedService>>(
    TYPES.IAudienceTagFeedServiceFactory,
  )
  .toFactory<IAudienceTagFeedService>((context: interfaces.Context) => {
    return (segmentId: string) => {
      const audienceTagFeedService = context.container.get<
        IAudienceTagFeedService
      >(TYPES.IAudienceTagFeedService);
      audienceTagFeedService.segmentId = segmentId;
      return audienceTagFeedService;
    };
  });
container
  .bind<interfaces.Factory<IAudienceSegmentFeedService>>(
    TYPES.IAudienceSegmentFeedServiceFactory,
  )
  .toFactory<IAudienceSegmentFeedService>((context: interfaces.Context) => {
    return (segmentId: string, feedType: AudienceFeedType) => {
      const audienceSegmentFeedService = context.container.get<
        IAudienceSegmentFeedService
      >(TYPES.IAudienceSegmentFeedService);
      audienceSegmentFeedService.segmentId = segmentId;
      audienceSegmentFeedService.feedType = feedType;
      return audienceSegmentFeedService;
    };
  });

export const { lazyInject } = getDecorators(container, false);

export default { container };

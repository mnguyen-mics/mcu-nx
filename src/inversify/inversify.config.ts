import { Container } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../constants/types';
import { IAuthService, AuthService } from '../services/AuthService';
import getDecorators from 'inversify-inject-decorators';
import { ILabelService, LabelService } from '../services/LabelsService';
import { OrganisationService, IOrganisationService } from '../services/OrganisationService';
import { IQueryService, QueryService } from '../services/QueryService';
import { ChartDatasetService, IChartDatasetService } from '../services/ChartDatasetService';
import { ActivitiesAnalyticsService } from '../services/analytics/ActivitiesAnalyticsService';
import AssetFileService, { IAssetFileService } from '../services/AssetFileService';
import PluginService, { IPluginService } from '../services/PluginService';
import DataFileService, { IDataFileService } from '../services/DataFileService';
import CustomDashboardService, {
  ICustomDashboardService,
} from '../services/CustomDashboardService';
import UsersService, { IUsersService } from '../services/UsersService';
import DatamartService, { IDatamartService } from '../services/DatamartService';
import IntegrationBatchService, {
  IIntegrationBatchService,
} from '../services/IntegrationBatchService';
import { ITagService, TagService } from '../services/TagService';
import { CollectionVolumesService } from '../services/analytics/CollectionVolumesService';
import {
  CollectionVolumesDimension,
  CollectionVolumesMetric,
} from '../utils/analytics/CollectionVolumesReportHelper';
import { IAnalyticsService } from '../services/analytics/AnalyticsService';
import {
  ActivitiesAnalyticsDimension,
  ActivitiesAnalyticsMetric,
} from '../utils/analytics/ActivitiesAnalyticsReportHelper';
import AudienceSegmentService, {
  IAudienceSegmentService,
} from '../services/AudienceSegmentService';
import StandardSegmentBuilderService, {
  IStandardSegmentBuilderService,
} from '../services/StandardSegmentBuilderService';
import ChannelService, { IChannelService } from '../services/ChannelService';
import CompartmentService, { ICompartmentService } from '../services/CompartmentService';
import {
  IdentityProviderService,
  IIdentityProviderService,
} from '../services/IdentityProviderService';
import ChartService, { IChartService } from '../services/ChartsService';

export const container = new Container();

container
  .bind<IAnalyticsService<ActivitiesAnalyticsMetric, ActivitiesAnalyticsDimension>>(
    TYPES.IActivitiesAnalyticsService,
  )
  .to(ActivitiesAnalyticsService);

container
  .bind<IAnalyticsService<CollectionVolumesMetric, CollectionVolumesDimension>>(
    TYPES.ICollectionVolumesService,
  )
  .to(CollectionVolumesService);

container.bind<IChartDatasetService>(TYPES.IChartDatasetService).to(ChartDatasetService);
container.bind<IQueryService>(TYPES.IQueryService).to(QueryService);
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);
container.bind<IAssetFileService>(TYPES.IAssetFileService).to(AssetFileService);
container.bind<IDataFileService>(TYPES.IDataFileService).to(DataFileService);
container.bind<IPluginService>(TYPES.IPluginService).to(PluginService);
container.bind<ILabelService>(TYPES.ILabelService).to(LabelService);
container.bind<ICustomDashboardService>(TYPES.ICustomDashboardService).to(CustomDashboardService);
container.bind<IDatamartService>(TYPES.IDatamartService).to(DatamartService);
container
  .bind<IIntegrationBatchService>(TYPES.IIntegrationBatchService)
  .to(IntegrationBatchService);
container.bind<ITagService>(TYPES.ITagService).to(TagService);
container
  .bind<IOrganisationService>(TYPES.IOrganisationService)
  .to(OrganisationService)
  .inSingletonScope();
container.bind<IAudienceSegmentService>(TYPES.IAudienceSegmentService).to(AudienceSegmentService);
container
  .bind<IStandardSegmentBuilderService>(TYPES.IStandardSegmentBuilderService)
  .to(StandardSegmentBuilderService);
container.bind<IUsersService>(TYPES.IUsersService).to(UsersService);
container.bind<IChannelService>(TYPES.IChannelService).to(ChannelService);
container.bind<ICompartmentService>(TYPES.ICompartmentService).to(CompartmentService);
container
  .bind<IIdentityProviderService>(TYPES.IIdentityProviderService)
  .to(IdentityProviderService);
container.bind<IChartService>(TYPES.IChartService).to(ChartService);

export const { lazyInject } = getDecorators(container, false);

export default { container };

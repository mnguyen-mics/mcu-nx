import { Container } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../constants/types';
import { IAuthService, AuthService } from '../services/AuthService';
import getDecorators from 'inversify-inject-decorators';
import { ILabelService, LabelService } from '../services/LabelsService';
import OrganisationService, { IOrganisationService } from '../services/OrganisationService';
import { IQueryService, QueryService } from '../services/QueryService';
import { ChartDatasetService, IChartDatasetService } from '../services/ChartDatasetService';
import {
  ActivitiesAnalyticsService,
  IActivitiesAnalyticsService,
} from '../services/ActivitiesAnalyticsService';
import AssetFileService, { IAssetFileService } from '../services/AssetFileService';
import PluginService, { IPluginService } from '../services/PluginService';
import DataFileService, { IDataFileService } from '../services/DataFileService';
import CustomDashboardService, {
  ICustomDashboardService,
} from '../services/CustomDashboardService';
import DatamartService, { IDatamartService } from '../services/DatamartService';
import IntegrationBatchService, {
  IIntegrationBatchService,
} from '../services/IntegrationBatchService';

export const container = new Container();

container
  .bind<IActivitiesAnalyticsService>(TYPES.IActivitiesAnalyticsService)
  .to(ActivitiesAnalyticsService);

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
container
  .bind<IOrganisationService>(TYPES.IOrganisationService)
  .to(OrganisationService)
  .inSingletonScope();

export const { lazyInject } = getDecorators(container, false);

export default { container };

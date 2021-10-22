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

export const container = new Container();

container
  .bind<IActivitiesAnalyticsService>(TYPES.IActivitiesAnalyticsService)
  .to(ActivitiesAnalyticsService);

container.bind<IChartDatasetService>(TYPES.IChartDatasetService).to(ChartDatasetService);
container.bind<IQueryService>(TYPES.IQueryService).to(QueryService);
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);
container.bind<ILabelService>(TYPES.ILabelService).to(LabelService);
container
  .bind<IOrganisationService>(TYPES.IOrganisationService)
  .to(OrganisationService)
  .inSingletonScope();

export const { lazyInject } = getDecorators(container, false);

export default { container };

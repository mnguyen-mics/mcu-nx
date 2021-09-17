/* eslint-disable import/extensions */
import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';
import {
  CustomDashboardService,
  ICustomDashboardService,
} from './../services/CustomDashboardService';
import { OrganisationService, IOrganisationService } from './../services/OrganisationService';
import { DatamartService, IDatamartService } from './../services/DatamartService';
import { TYPES } from './../constants/types';

export const container = new Container();

container.bind<ICustomDashboardService>(TYPES.ICustomDashboardService).to(CustomDashboardService);

container.bind<IOrganisationService>(TYPES.IOrganisationService).to(OrganisationService);

container.bind<IDatamartService>(TYPES.IDatamartService).to(DatamartService);

export const { lazyInject } = getDecorators(container, false);

export default { container };

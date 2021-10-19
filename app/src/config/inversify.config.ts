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
import { IPluginService, PluginService } from '../services/PluginService';

export const container = new Container();

container.bind<ICustomDashboardService>(TYPES.ICustomDashboardService).to(CustomDashboardService);
container.bind<IOrganisationService>(TYPES.IOrganisationService).to(OrganisationService);
container.bind<IDatamartService>(TYPES.IDatamartService).to(DatamartService);
container.bind<IPluginService>(TYPES.IPluginService).to(PluginService);

export const { lazyInject } = getDecorators(container, false);

export default { container };

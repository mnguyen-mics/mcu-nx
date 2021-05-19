import { Container } from 'inversify';
import { TYPES } from '../constants/types'
import { IAuthService, AuthService } from '../services/AuthService';
import getDecorators from 'inversify-inject-decorators';
import { ILabelService, LabelService } from '../services/LabelsService';
import OrganisationService, { IOrganisationService } from '../services/OrganisationService';

export const container = new Container();

container
  .bind<IAuthService>(TYPES.IAuthService)
  .to(AuthService);
container.bind<ILabelService>(TYPES.ILabelService).to(LabelService);
container
  .bind<IOrganisationService>(TYPES.IOrganisationService)
  .to(OrganisationService)
  .inSingletonScope();
export const { lazyInject } = getDecorators(container, false);

export default { container };

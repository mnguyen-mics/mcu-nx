import { injectable } from 'inversify';
import { UserAccountCompartmentResource } from '../models/datamart/DatamartResource';
import ApiService, { DataListResponse } from './ApiService';

export interface ICompartmentService {
  getCompartments: (
    organisationId?: string,
  ) => Promise<DataListResponse<UserAccountCompartmentResource>>;
}

@injectable()
export default class CompartmentService implements ICompartmentService {
  getCompartments(
    organisationId: string,
  ): Promise<DataListResponse<UserAccountCompartmentResource>> {
    return ApiService.getRequest(`user_account_compartments/?organisation_id=${organisationId}`);
  }
}

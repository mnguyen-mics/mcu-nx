import { injectable } from 'inversify';
import { UserAccountCompartmentResource } from '../models/datamart/DatamartResource';
import ApiService, { DataListResponse } from './ApiService';

export interface ICompartmentService {
  getCompartments: (
    datamartId?: string,
  ) => Promise<DataListResponse<UserAccountCompartmentResource>>;
}

@injectable()
export default class CompartmentService implements ICompartmentService {
  getCompartments(datamartId: string): Promise<DataListResponse<UserAccountCompartmentResource>> {
    return ApiService.getRequest(`datamarts/${datamartId}/user_account_compartments/`, {
      with_source_datamarts: true,
    });
  }
}

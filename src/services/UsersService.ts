import { injectable } from 'inversify';
import UserResource from '../models/directory/UserResource';
import ApiService, { DataListResponse } from './ApiService';

export interface IUsersService {
  getUsersByKeyword(id: string): Promise<DataListResponse<UserResource>>;
}

@injectable()
export default class UsersService implements IUsersService {
  getUsersByKeyword(id: string): Promise<DataListResponse<UserResource>> {
    const endpoint = `users?keywords=${id}`;
    return ApiService.getRequest(endpoint);
  }
}

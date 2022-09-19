import { injectable } from 'inversify';
import UserResource from '../models/directory/UserResource';
import { PaginatedApiParam } from '../utils/ApiHelper';
import ApiService, { DataListResponse } from './ApiService';
export interface IUsersService {
  getUsers(option?: PaginatedApiParam): Promise<DataListResponse<UserResource>>;
  getUsersByKeyword(id: string): Promise<DataListResponse<UserResource>>;
}

@injectable()
export default class UsersService implements IUsersService {
  getUsers(option?: PaginatedApiParam): Promise<DataListResponse<UserResource>> {
    const endpoint = `users`;
    return ApiService.getRequest(endpoint, option);
  }
  getUsersByKeyword(id: string): Promise<DataListResponse<UserResource>> {
    const endpoint = `users?keywords=${id}`;
    return ApiService.getRequest(endpoint);
  }
}

import { injectable } from 'inversify';
import { ChannelResource } from '../models/channel/ChannelResource';
import ApiService, { DataListResponse } from './ApiService';

export interface IChannelService {
  getChannels: (
    organisationId: string,
    datamartId: string,
    options?: object,
  ) => Promise<DataListResponse<ChannelResource>>;
}

@injectable()
export default class ChannelService implements IChannelService {
  getChannels(
    organisationId: string,
    datamartId: string,
    options: object = {},
  ): Promise<DataListResponse<ChannelResource>> {
    const endpoint = `datamarts/${datamartId}/channels`;

    const params = {
      organisation_id: organisationId,
      ...options,
    };

    return ApiService.getRequest(endpoint, params);
  }
}

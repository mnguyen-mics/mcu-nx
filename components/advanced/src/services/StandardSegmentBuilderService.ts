import { StandardSegmentBuilderResource } from '../models/standardSegmentBuilder/StandardSegmentBuilderResource';
import ApiService, { DataListResponse, DataResponse } from './ApiService';
import { injectable } from 'inversify';
import { PaginatedApiParam } from '../utils/ApiHelper';

export interface StandardSegmentBuilderOptions extends PaginatedApiParam {}

export interface IStandardSegmentBuilderService {
  getStandardSegmentBuilders: (
    datamartId: string,
    options?: StandardSegmentBuilderOptions,
  ) => Promise<DataListResponse<StandardSegmentBuilderResource>>;

  getStandardSegmentBuilder: (
    datamartId: string,
    segmentBuilderId: string,
  ) => Promise<DataResponse<StandardSegmentBuilderResource>>;
}

@injectable()
export default class StandardSegmentBuilderService implements IStandardSegmentBuilderService {
  getStandardSegmentBuilders(
    datamartId: string,
    options?: StandardSegmentBuilderOptions,
  ): Promise<DataListResponse<StandardSegmentBuilderResource>> {
    const endpoint = `datamarts/${datamartId}/standard_segment_builders`;
    return ApiService.getRequest(endpoint, options);
  }

  getStandardSegmentBuilder(
    datamartId: string,
    segmentBuilderId: string,
  ): Promise<DataResponse<StandardSegmentBuilderResource>> {
    const endpoint = `datamarts/${datamartId}/standard_segment_builders/${segmentBuilderId}`;
    return ApiService.getRequest(endpoint);
  }
}

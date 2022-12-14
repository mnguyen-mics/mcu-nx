import ApiService, { DataListResponse, DataResponse } from './ApiService';
import { AssetFileResource } from '../models/assets/assets';
import log from '../utils/Logger';
import { injectable } from 'inversify';

export interface IAssetFileService {
  getAssetsFiles: (
    organisationId: string,
    options: object,
  ) => Promise<DataListResponse<AssetFileResource>>;
  getAssetFile: (id: string) => Promise<AssetFileResource | null>;
  deleteAssetsFile: (id: string, options?: object) => Promise<DataResponse<AssetFileResource>>;
  uploadAssetsFile: (
    organisationId: string,
    file: FormData,
  ) => Promise<DataResponse<AssetFileResource>>;
}
@injectable()
export default class AssetFileService implements IAssetFileService {
  getAssetsFiles(
    organisationId: string,
    options: object = {},
  ): Promise<DataListResponse<AssetFileResource>> {
    const endpoint = 'assets';
    const params = {
      organisation_id: organisationId,
      ...options,
    };
    return ApiService.getRequest(endpoint, params);
  }
  getAssetFile(id: string): Promise<AssetFileResource | null> {
    const endpoint = `assets/${id}`;
    return ApiService.getRequest<DataResponse<AssetFileResource>>(endpoint)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        log.warn('Cannot retrieve asset file', err);
        return null;
      });
  }
  deleteAssetsFile(id: string, options: object = {}): Promise<DataResponse<AssetFileResource>> {
    const endpoint = `assets/${id}`;
    const params = {
      ...options,
    };
    return ApiService.deleteRequest(endpoint, params);
  }
  uploadAssetsFile(
    organisationId: string,
    file: FormData,
  ): Promise<DataResponse<AssetFileResource>> {
    const endpoint = `assets?organisation_id=${organisationId}`;
    return ApiService.postRequest(endpoint, file);
  }
}

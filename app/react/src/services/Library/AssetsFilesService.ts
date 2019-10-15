import ApiService, { DataListResponse, DataResponse } from '../ApiService';
import { AssetFileResource } from '../../models/assets/assets';
import log from '../../utils/Logger';

const assetFileService = {
  getAssetsFiles(organisationId: string, options: object = {}): Promise<DataListResponse<AssetFileResource>> {
    const endpoint = 'asset_files';
    const params = {
      organisation_id: organisationId,
      ...options,
    };
    return ApiService.getRequest(endpoint, params);
  },
  getAssetFile(id: string): Promise<AssetFileResource | null> {
    const endpoint = `asset_files/${id}`;
    return ApiService.getRequest<DataResponse<AssetFileResource>>(endpoint)
      .then(res => { return res.data })
      .catch(err => {
        log.warn("Cannot retrieve asset file", err);
        return null;
      });
  },
  deleteAssetsFile(id: string, options: object = {}) {
    const endpoint = `asset_files/${id}`;
    const params = {
      ...options,
    };
    return ApiService.deleteRequest(endpoint, params);
  },
  uploadAssetsFile(organisationId: string, file: FormData): Promise<DataResponse<AssetFileResource>> {
    const endpoint = `asset_files?organisation_id=${organisationId}`;
    return ApiService.postRequest(endpoint, file);
  },
};

export default assetFileService;

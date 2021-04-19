import {
  AudienceFeatureFolderResource,
  AudienceFeaturesByFolder,
  AudienceFeatureVariableResource,
} from './../models/audienceFeature/AudienceFeatureResource';
import { AudienceFeatureResource } from '../models/audienceFeature';
import { injectable } from 'inversify';
import { PaginatedApiParam, getPaginatedApiParam } from '../utils/ApiHelper';
import ApiService, { DataListResponse, DataResponse } from './ApiService';
import {
  Index,
  SearchFilter,
} from '@mediarithmics-private/mcs-components-library/lib/utils';
import { Action } from 'redux-actions';

export interface AudienceFeatureOptions extends PaginatedApiParam {
  keywords?: string[];
  exclude?: string[];
  folder_id?: string;
}

export interface IAudienceFeatureService {
  getAudienceFeatures: (
    datamartId: string,
    options?: AudienceFeatureOptions,
  ) => Promise<DataListResponse<AudienceFeatureResource>>;
  getAudienceFeature: (
    datamartId: string,
    audienceFeatureId: string,
  ) => Promise<DataResponse<AudienceFeatureResource>>;
  createAudienceFeature: (
    datamartId: string,
    body: Partial<AudienceFeatureResource>,
  ) => Promise<DataResponse<AudienceFeatureResource>>;
  updateAudienceFeature: (
    datamartId: string,
    audienceFeatureId: string,
    body: Partial<AudienceFeatureResource>,
  ) => Promise<DataResponse<AudienceFeatureResource>>;
  deleteAudienceFeature: (
    datamartId: string,
    audienceFeatureId: string,
  ) => Promise<DataResponse<AudienceFeatureResource>>;
  extractAudienceFeatureVariables: (
    datamartId: string,
    objectTreeExpression: string,
    adressableObject?: string,
  ) => Promise<DataListResponse<AudienceFeatureVariableResource>>;

  getAudienceFeatureFolders: (
    datamartId: string,
  ) => Promise<DataListResponse<AudienceFeatureFolderResource>>;

  createAudienceFeatureFolder: (
    datamartId: string,
    body: Partial<AudienceFeatureFolderResource>,
  ) => Promise<DataResponse<AudienceFeatureFolderResource>>;

  getAudienceFeatureFolder: (
    datamartId: string,
    folderId: string,
  ) => Promise<DataResponse<AudienceFeatureFolderResource>>;

  updateAudienceFeatureFolder: (
    datamartId: string,
    folderId: string,
    body: Partial<AudienceFeatureFolderResource>,
  ) => Promise<DataResponse<AudienceFeatureFolderResource>>;

  deleteAudienceFeatureFolder: (
    datamartId: string,
    folderId: string,
  ) => Promise<DataResponse<AudienceFeatureFolderResource>>;

  getAudienceFeatureChildFolders: (
    datamartId: string,
    parentId: string,
  ) => Promise<DataListResponse<AudienceFeatureFolderResource>>;

  fetchAudienceFeatures: (
    datamartId: string,
    filter?: SearchFilter,
    demographicIds?: string[],
  ) => Promise<DataListResponse<AudienceFeatureResource>>;

  fetchFoldersAndFeatures: (
    datamartId: string,
    baseFolderName: string,
    setBaseFolder: (
      baseFolder: AudienceFeaturesByFolder,
      total: number,
      allFeatures?: AudienceFeatureResource[],
    ) => void,
    onFailure: (err: any) => void,
    notifyError: (err: any, notifConfig?: any) => Action<any>,
    filter?: Index<any>,
    demographicIds?: string[],
  ) => Promise<void>;

  getFolderContent: (
    id?: string,
    audienceFeaturesByFolder?: AudienceFeaturesByFolder,
  ) => AudienceFeaturesByFolder | undefined;
}

@injectable()
export class AudienceFeatureService implements IAudienceFeatureService {
  getAudienceFeatures(
    datamartId: string,
    options?: AudienceFeatureOptions,
  ): Promise<DataListResponse<AudienceFeatureResource>> {
    const endpoint = `datamarts/${datamartId}/audience_features`;
    return ApiService.getRequest(endpoint, options);
  }

  getAudienceFeature(
    datamartId: string,
    audienceFeatureId: string,
  ): Promise<DataResponse<AudienceFeatureResource>> {
    const endpoint = `datamarts/${datamartId}/audience_features/${audienceFeatureId}`;
    return ApiService.getRequest(endpoint);
  }

  createAudienceFeature(
    datamartId: string,
    body: Partial<AudienceFeatureResource>,
  ): Promise<DataResponse<AudienceFeatureResource>> {
    const endpoint = `datamarts/${datamartId}/audience_features`;
    return ApiService.postRequest(endpoint, body);
  }

  updateAudienceFeature(
    datamartId: string,
    audienceFeatureId: string,
    body: Partial<AudienceFeatureResource>,
  ): Promise<DataResponse<AudienceFeatureResource>> {
    const endpoint = `datamarts/${datamartId}/audience_features/${audienceFeatureId}`;
    if (body.folder_id === '') {
      body.folder_id = null;
    }
    return ApiService.putRequest(endpoint, body);
  }

  deleteAudienceFeature(
    datamartId: string,
    audienceFeatureId: string,
  ): Promise<DataResponse<AudienceFeatureResource>> {
    const endpoint = `datamarts/${datamartId}/audience_features/${audienceFeatureId}`;
    return ApiService.deleteRequest(endpoint);
  }

  extractAudienceFeatureVariables(
    datamartId: string,
    objectTreeExpression: string,
    adressableObject?: string,
  ): Promise<DataListResponse<AudienceFeatureVariableResource>> {
    let endpoint;
    if (adressableObject === undefined) {
      endpoint = `datamarts/${datamartId}/audience_features/extract_variables?object_tree_expression=${objectTreeExpression}`;
    } else {
      endpoint = `datamarts/${datamartId}/audience_features/extract_variables?object_tree_expression=${objectTreeExpression}&addressable_object=${adressableObject}`;
    }
    return ApiService.getRequest(endpoint);
  }

  // Folders

  getAudienceFeatureFolders(
    datamartId: string,
  ): Promise<DataListResponse<AudienceFeatureFolderResource>> {
    const endpoint = `datamarts/${datamartId}/audience_feature_folders`;
    return ApiService.getRequest(endpoint);
  }

  createAudienceFeatureFolder(
    datamartId: string,
    body: Partial<AudienceFeatureFolderResource>,
  ): Promise<DataResponse<AudienceFeatureFolderResource>> {
    const endpoint = `datamarts/${datamartId}/audience_feature_folders`;
    return ApiService.postRequest(endpoint, body);
  }

  getAudienceFeatureFolder(
    datamartId: string,
    folderId: string,
  ): Promise<DataResponse<AudienceFeatureFolderResource>> {
    const endpoint = `datamarts/${datamartId}/audience_feature_folders/${folderId}`;
    return ApiService.getRequest(endpoint);
  }

  updateAudienceFeatureFolder(
    datamartId: string,
    folderId: string,
    body: Partial<AudienceFeatureFolderResource>,
  ): Promise<DataResponse<AudienceFeatureFolderResource>> {
    const endpoint = `datamarts/${datamartId}/audience_feature_folders/${folderId}`;
    if (body.parent_id === '') {
      body.parent_id = null;
    }
    return ApiService.putRequest(endpoint, body);
  }

  deleteAudienceFeatureFolder(
    datamartId: string,
    folderId: string,
  ): Promise<DataResponse<AudienceFeatureFolderResource>> {
    const endpoint = `datamarts/${datamartId}/audience_feature_folders/${folderId}`;
    return ApiService.deleteRequest(endpoint);
  }

  getAudienceFeatureChildFolders(
    datamartId: string,
    parentId: string,
  ): Promise<DataListResponse<AudienceFeatureFolderResource>> {
    const endpoint = `datamarts/${datamartId}/audience_feature_folders`;
    return ApiService.getRequest(endpoint, { parent: parentId });
  }

  private _fetchFolders = (
    datamartId: string,
    notifyError: (err: any, notifConfig?: any) => Action<any>,
  ) => {
    return this.getAudienceFeatureFolders(datamartId)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        notifyError(err);
        return [];
      });
  };

  fetchAudienceFeatures = (
    datamartId: string,
    filter?: SearchFilter,
    demographicIds?: string[],
  ) => {
    const options: AudienceFeatureOptions = {
      ...getPaginatedApiParam(filter?.currentPage, filter?.pageSize),
    };

    if (filter?.keywords) {
      options.keywords = [filter.keywords];
    }

    if (demographicIds && demographicIds.length >= 1) {
      options.exclude = demographicIds;
    }

    return this.getAudienceFeatures(datamartId, options);
  };

  fetchFoldersAndFeatures = (
    datamartId: string,
    baseFolderName: string,
    setBaseFolder: (
      baseFolder: AudienceFeaturesByFolder,
      total: number,
      allFeatures?: AudienceFeatureResource[],
    ) => void,
    onFailure: (err: any) => void,
    notifyError: (err: any, notifConfig?: any) => Action<any>,
    filter?: Index<any>,
    demographicIds?: string[],
  ) => {
    const res: [
      Promise<AudienceFeatureFolderResource[]>,
      Promise<DataListResponse<AudienceFeatureResource>>,
    ] = [
      this._fetchFolders(datamartId, notifyError),
      this.fetchAudienceFeatures(
        datamartId,
        filter as SearchFilter,
        demographicIds,
      ),
    ];
    return Promise.all(res)
      .then((results: any[]) => {
        const audienceFeatureFolders: AudienceFeatureFolderResource[] =
          results[0];
        const features: DataListResponse<AudienceFeatureResource> = results[1];
        const baseFolder = this._createBaseFolder(
          baseFolderName,
          audienceFeatureFolders,
          features.data,
        );
        setBaseFolder(
          baseFolder,
          features.total || features.count,
          features.data,
        );
      })
      .catch((err) => {
        onFailure(err);
      });
  };

  private _folderLoop = (
    folders: AudienceFeatureFolderResource[],
    features: AudienceFeatureResource[],
  ): AudienceFeaturesByFolder[] => {
    return folders.map((folder) => {
      if (!folder.parent_id) {
        folder.parent_id = undefined;
      }
      return {
        id: folder.id,
        name: folder.name,
        parent_id: folder.parent_id,
        audience_features: features.filter((f: AudienceFeatureResource) =>
          folder.audience_features_ids?.includes(f.id),
        ),
        children: this._folderLoop(
          folders.filter(
            (f: AudienceFeatureFolderResource) =>
              f.id && folder.children_ids?.includes(f.id),
          ),
          features,
        ),
      };
    });
  };

  private _createBaseFolder = (
    name: string,
    folders: AudienceFeatureFolderResource[],
    features: AudienceFeatureResource[],
  ): AudienceFeaturesByFolder => {
    return {
      id: undefined,
      name: name,
      parent_id: 'root',
      children: this._folderLoop(
        folders.filter((f: AudienceFeatureFolderResource) => !f.parent_id),
        features,
      ),
      audience_features: features.filter(
        (f: AudienceFeatureResource) => !f.folder_id,
      ),
    };
  };

  getFolderContent = (
    id?: string,
    audienceFeaturesByFolder?: AudienceFeaturesByFolder,
  ) => {
    let selectedFolder: AudienceFeaturesByFolder | undefined;
    const loop = (folder: AudienceFeaturesByFolder) => {
      if (!id) {
        selectedFolder = audienceFeaturesByFolder;
      } else {
        folder.children.forEach((f) => {
          if (f.id === id) {
            selectedFolder = f;
          } else {
            loop(f);
          }
        });
      }
    };
    if (audienceFeaturesByFolder) loop(audienceFeaturesByFolder);
    return selectedFolder;
  };
}

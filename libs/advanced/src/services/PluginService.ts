import { ConfigurationFileListingEntryResource } from './../models/plugin/Plugins';
import {
  Adlayout,
  AdLayoutVersionResource,
  StylesheetVersionResource,
  PluginType,
  PluginPresetProperty,
  PluginResource,
  PluginPresetResource,
  PluginVersionResource,
  PluginManagerResource,
  PluginActionResource,
} from '../models/plugin/Plugins';
import { PaginatedApiParam, OrderByParam } from './../utils/ApiHelper';
import ApiService, { DataListResponse, DataResponse } from './ApiService';
import { PropertyResourceShape } from '../models/plugin';
import { IDataFileService } from './DataFileService';
import { PluginLayout } from '../models/plugin/PluginLayout';
import log from '../utils/Logger';
import { Omit } from '../utils/Types';
import { injectable, inject } from 'inversify';
import { TYPES } from '../constants/types';
import { IAssetFileService } from './AssetFileService';

// TODO Pagination is disabled for now waiting for an api param
// to allow filtering of plugin without version and/or with current version not archived
export interface GetPluginOptions extends Omit<PaginatedApiParam, 'first_result'>, OrderByParam {
  plugin_type?: PluginType;
  artifact_id?: string;
  group_id?: string;
  organisation_id?: string;
}

type PluginLayoutFileType = 'PROPERTIES' | 'LOCALE';
export interface LayoutFileListingEntryResource {
  file_type: PluginLayoutFileType;
  locale?: string;
}

interface GetPluginVersionContainersOptions extends PaginatedApiParam {
  organisation_id?: string;
}

interface GetPluginPresetOptions extends Omit<PaginatedApiParam, 'first_result'> {
  plugin_type?: PluginType;
  organisation_id?: string;
}

interface PostPluginPresetResource {
  organisation_id: string;
  name: string;
  description?: string;
  plugin_type: PluginType;
  properties: PluginPresetProperty[];
}

interface PluginVersionCreateRequest {
  version_id: string;
  maintainer_id?: string;
  max_qps?: number;
  plugin_properties: PropertyResourceShape[];
}

export interface IPluginService {
  getPlugins: (
    options: GetPluginOptions,
    withArchivedPluginVersion?: boolean,
  ) => Promise<DataListResponse<PluginResource>>;
  getPlugin: (id: string) => Promise<DataResponse<PluginResource>>;
  getPluginVersions: (
    pluginId: string,
    params?: object,
  ) => Promise<DataListResponse<PluginVersionResource>>;
  findPluginFromVersionId: (versionId: string) => Promise<DataResponse<PluginResource>>;
  getPluginVersion: (
    pluginId: string,
    versionId: string,
  ) => Promise<DataResponse<PluginVersionResource>>;
  createPluginVersion: (
    pluginId: string,
    options: PluginVersionCreateRequest,
  ) => Promise<DataResponse<PluginVersionResource>>;
  getPluginVersionProperties: (
    pluginId: string,
    pluginVersionId: string,
    params?: object,
  ) => Promise<DataListResponse<PropertyResourceShape>>;
  getEngineProperties: (engineVersionId: string) => Promise<PropertyResourceShape[]>;
  getEngineVersion: (engineVersionId: string) => Promise<PluginVersionResource>;
  getAdLayouts: (
    organisationId: string,
    pluginVersionId: string,
  ) => Promise<DataListResponse<Adlayout>>;
  getAdLayoutVersion: (
    organisationId: string,
    adLayoutVersion: string,
  ) => Promise<DataListResponse<AdLayoutVersionResource>>;
  handleSaveOfProperties: (
    params: any,
    organisationId: string,
    objectType: string,
    objectId: string,
    endpoint: string,
  ) => Promise<DataResponse<PropertyResourceShape> | void>;
  getLocalizedPluginLayout: (
    pluginId: string,
    pluginVersionId: string,
    locale?: string,
  ) => Promise<PluginLayout | null>;
  getPluginLayoutFile: (pluginId: string, pluginVersionId: string) => Promise<Blob>;
  putPropertiesLayout: (pluginId: string, pluginVersionId: string, fileData: Blob) => Promise<any>; // returns OK
  getLocalizedPluginLayoutFile: (
    pluginId: string,
    pluginVersionId: string,
    locale: string,
  ) => Promise<Blob>;
  getPluginPresets: (
    options: GetPluginPresetOptions,
  ) => Promise<DataListResponse<PluginPresetResource>>;
  getStyleSheets: (organisationId: string) => Promise<DataListResponse<any>>;
  getStyleSheetsVersion: (
    organisationId: string,
    styleSheetId: string,
  ) => Promise<DataListResponse<StylesheetVersionResource>>;
  getLocalizedPluginLayoutFromVersionId: (
    pluginVersionId: string,
  ) => Promise<{ plugin: PluginResource; layout?: PluginLayout }>;
  createPluginPreset: (
    pluginId: string,
    pluginVersionId: string,
    resource: PostPluginPresetResource,
  ) => Promise<DataResponse<PluginPresetResource>>;
  deletePluginPreset: (
    pluginId: string,
    pluginVersionId: string,
    pluginPresetId: string,
    resource: Partial<PluginPresetResource>,
  ) => Promise<DataResponse<PluginPresetResource>>;
  createPlugin: (body: Partial<PluginResource>) => Promise<DataResponse<PluginResource>>;
  getPluginVersionContainers: (
    pluginId: string,
    pluginVersionId: string,
    params?: GetPluginVersionContainersOptions,
  ) => Promise<DataListResponse<PluginManagerResource>>;
  postPluginVersionContainerAction: (
    pluginId: string,
    pluginVersionId: string,
    action: PluginActionResource,
  ) => Promise<DataResponse<any>>;
  getPluginConfigurationFile: (
    pluginId: string,
    pluginVersionId: string,
    technicalName?: string,
  ) => Promise<Blob>;
  listPluginConfigurationFiles: (
    pluginId: string,
    pluginVersionId: string,
    options?: GetPluginVersionContainersOptions,
  ) => Promise<DataListResponse<ConfigurationFileListingEntryResource>>;
  putPluginConfigurationFile: (
    pluginId: string,
    pluginVersionId: string,
    technicalName: string,
    fileData: Blob,
  ) => Promise<any>; // returns OK
  putLocalizationFile: (
    pluginId: string,
    pluginVersionId: string,
    locale: string,
    fileData: Blob,
  ) => Promise<any>; // returns OK
  listPluginLayouts: (
    pluginId: string,
    pluginVersionId: string,
    options?: GetPluginVersionContainersOptions,
  ) => Promise<DataListResponse<LayoutFileListingEntryResource>>;
}

@injectable()
export class PluginService implements IPluginService {
  @inject(TYPES.IAssetFileService)
  private _assetFileService: IAssetFileService;

  @inject(TYPES.IDataFileService)
  private _dataFileService: IDataFileService;

  getPlugins(
    options: GetPluginOptions = {},
    withArchivedPluginVersion: boolean = false,
  ): Promise<DataListResponse<PluginResource>> {
    const endpoint = 'plugins';
    return ApiService.getRequest<DataListResponse<PluginResource>>(endpoint, options).then(
      plugins => {
        if (!withArchivedPluginVersion) {
          return Promise.all(
            plugins.data.reduce((filteredPlugins, p) => {
              if (p.current_version_id) {
                return [
                  ...filteredPlugins,
                  this.getPluginVersion(p.id, p.current_version_id).then(pv => pv.data),
                ];
              }
              return filteredPlugins;
            }, []),
          ).then(pluginVersions => {
            const archivedPVersion = pluginVersions.filter(
              (pv: PluginVersionResource) => !!pv.archived,
            );
            return {
              ...plugins,
              data: plugins.data.filter(
                p =>
                  !archivedPVersion.find(
                    (apv: PluginVersionResource) => apv.id === p.current_version_id,
                  ),
              ),
            };
          });
        }
        return plugins;
      },
    );
  }
  getPluginVersions(
    pluginId: string,
    params: object = {},
  ): Promise<DataListResponse<PluginVersionResource>> {
    const endpoint = `plugins/${pluginId}/versions`;
    return ApiService.getRequest(endpoint, params);
  }
  getPlugin(pluginId: string): Promise<DataResponse<PluginResource>> {
    const endpoint = `plugins/${pluginId}`;
    return ApiService.getRequest(endpoint);
  }
  createPlugin(body: Partial<PluginResource>): Promise<DataResponse<PluginResource>> {
    const endpoint = `plugins`;
    return ApiService.postRequest(endpoint, body);
  }
  findPluginFromVersionId(versionId: string): Promise<DataResponse<PluginResource>> {
    const endpoint = `plugins/version/${versionId}`;
    return ApiService.getRequest(endpoint);
  }
  getPluginVersion(
    pluginId: string,
    versionId: string,
  ): Promise<DataResponse<PluginVersionResource>> {
    const endpoint = `plugins/${pluginId}/versions/${versionId}`;
    return ApiService.getRequest(endpoint);
  }
  createPluginVersion(
    pluginId: string,
    options: PluginVersionCreateRequest,
  ): Promise<DataResponse<PluginVersionResource>> {
    const endpoint = `plugins/${pluginId}/versions`;
    return ApiService.postRequest(endpoint, options);
  }
  getPluginVersionProperties(
    pluginId: string,
    pluginVersionId: string,
    params: object = {},
  ): Promise<DataListResponse<PropertyResourceShape>> {
    const endpoint = `plugins/${pluginId}/versions/${pluginVersionId}/properties`;
    return ApiService.getRequest(endpoint, params);
  }
  getPluginPresets(
    options: GetPluginPresetOptions = {},
  ): Promise<DataListResponse<PluginPresetResource>> {
    const endpoint = `plugins.versions.presets`;
    return ApiService.getRequest(endpoint, options);
  }
  createPluginPreset(
    pluginId: string,
    pluginVersionId: string,
    resource: PostPluginPresetResource,
  ): Promise<DataResponse<PluginPresetResource>> {
    const endpoint = `plugins/${pluginId}/versions/${pluginVersionId}/presets`;
    return ApiService.postRequest(endpoint, resource);
  }
  deletePluginPreset(
    pluginId: string,
    pluginVersionId: string,
    pluginPresetId: string,
    resource: Partial<PluginPresetResource>,
  ): Promise<DataResponse<PluginPresetResource>> {
    const endpoint = `plugins/${pluginId}/versions/${pluginVersionId}/presets/${pluginPresetId}`;

    return ApiService.putRequest(endpoint, resource);
  }
  getEngineProperties(engineVersionId: string): Promise<PropertyResourceShape[]> {
    const endpoint = `plugins/${engineVersionId}/properties`;

    return ApiService.getRequest(endpoint).then(
      (res: DataListResponse<PropertyResourceShape>) => res.data,
    );
  }
  getEngineVersion(engineVersionId: string): Promise<PluginVersionResource> {
    const endpoint = `plugins/version/${engineVersionId}`;
    return ApiService.getRequest(endpoint).then((res: DataResponse<PluginVersionResource>) => {
      return res.data;
    });
  }
  getAdLayouts(
    organisationId: string,
    pluginVersionId: string,
  ): Promise<DataListResponse<Adlayout>> {
    const endpoint = `ad_layouts?organisation_id=${organisationId}&renderer_version_id=${pluginVersionId}`;
    return ApiService.getRequest(endpoint);
  }
  getAdLayoutVersion(
    organisationId: string,
    adLayoutVersion: string,
  ): Promise<DataListResponse<AdLayoutVersionResource>> {
    const endpoint = `ad_layouts/${adLayoutVersion}/versions`;
    const params = {
      organisation_id: organisationId,
      statuses: 'DRAFT,PUBLISHED',
    };
    return ApiService.getRequest(endpoint, params);
  }
  getStyleSheets(organisationId: string): Promise<DataListResponse<any>> {
    const endpoint = `style_sheets?organisation_id=${organisationId}`;
    return ApiService.getRequest(endpoint);
  }
  getStyleSheetsVersion(
    organisationId: string,
    styleSheetId: string,
  ): Promise<DataListResponse<StylesheetVersionResource>> {
    const endpoint = `style_sheets/${styleSheetId}/versions`;
    const params = {
      organisation_id: organisationId,
      statuses: 'DRAFT,PUBLISHED',
    };
    return ApiService.getRequest(endpoint, params);
  }
  handleSaveOfProperties(
    params: any,
    organisationId: string,
    objectType: string,
    objectId: string,
    endpoint: string,
  ): Promise<DataResponse<PropertyResourceShape> | void> {
    if (
      params.property_type === 'ASSET' ||
      params.property_type === 'ASSET_FILE' ||
      params.property_type === 'ASSET_FOLDER'
    ) {
      let uploadEndpoint = `assets?organisation_id=${organisationId}`;

      if (params.property_type === 'ASSET_FOLDER') {
        uploadEndpoint = `assets?organisation_id=${organisationId}&asset_type=FOLDER`;
      }

      if (params.value && params.value.length === 0) {
        return Promise.resolve();
      }

      const fileValue = params.value && params.value.file ? params.value.file : null;

      if (fileValue !== null) {
        const formData = new FormData(); /* global FormData */
        formData.append('file', fileValue, fileValue.name);
        return ApiService.postRequest(uploadEndpoint, formData).then((res: any) => {
          const newParams = {
            ...params,
          };
          newParams.value = {
            original_name: res.data.original_name,
            path: res.data.path,
            asset_id: res.data.id,
          };
          ApiService.putRequest(endpoint, newParams);
        });
      }
      return Promise.resolve();
    } else if (params.property_type === 'NATIVE_IMAGE') {
      if (params.value && params.value.length === 0) {
        return Promise.resolve();
      }

      const fileValue = params.value && params.value.file ? params.value.file : null;

      if (fileValue !== null) {
        const formData = new FormData(); /* global FormData */
        formData.append('file', fileValue, fileValue.name);

        return this._assetFileService.uploadAssetsFile(organisationId, formData).then(res => {
          const newParams = {
            ...params,
          };
          newParams.value = {
            original_file_name: res.data.original_name,
            file_path: res.data.path,
            asset_id: res.data.id,
            require_display: true,
            height: res.data.height,
            width: res.data.width,
            type: 1,
          };
          ApiService.putRequest(endpoint, newParams);
        });
      }
      return Promise.resolve();
    } else if (params.property_type === 'DATA_FILE') {
      // build formData
      const blob = new Blob([params.value.fileContent], {
        type: 'application/octet-stream',
      }); /* global Blob */
      if (params.value.uri) {
        // edit
        return this._dataFileService
          .editDataFile(params.value.fileName, params.value.uri, blob)
          .then(() => {
            const newParams = {
              ...params,
            };
            newParams.value = {
              uri: params.value.uri,
              last_modified: null,
            };
            return ApiService.putRequest(endpoint, newParams) as Promise<
              DataResponse<PropertyResourceShape>
            >;
          });
      } else if (params.value.fileName && params.value.fileContent) {
        // create
        return this._dataFileService
          .createDatafile(organisationId, objectType, objectId, params.value.fileName, blob)
          .then((res: any) => {
            const newParams = {
              ...params,
            };
            newParams.value = {
              uri: res,
              last_modified: null,
            };
            return ApiService.putRequest(endpoint, newParams) as Promise<
              DataResponse<PropertyResourceShape>
            >;
          });
      } else if (!params.value.fileName && !params.value.fileContent && !params.value.uri) {
        // delete
        const newParams = {
          ...params,
        };
        newParams.value = {
          uri: null,
          last_modified: null,
        };
        return ApiService.putRequest(endpoint, newParams);
      }
      return Promise.resolve();
    }

    return ApiService.putRequest(endpoint, params);
  }
  getLocalizedPluginLayout(
    pluginId: string,
    pluginVersionId: string,
    locale: string = 'en-US',
  ): Promise<PluginLayout | null> {
    const endpoint = `plugins/${pluginId}/versions/${pluginVersionId}/properties_layout?locale=${locale}`;
    return ApiService.getRequest<DataResponse<PluginLayout>>(endpoint)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        log.warn('Cannot retrieve plugin layout', err);
        return null;
      });
  }

  putPropertiesLayout(pluginId: string, pluginVersionId: string, fileData: Blob): Promise<any> {
    const endpoint = `plugins/${pluginId}/versions/${pluginVersionId}/properties_layout`;
    return ApiService.putRequest(endpoint, fileData);
  }

  getLocalizedPluginLayoutFile(
    pluginId: string,
    pluginVersionId: string,
    locale: string = 'en-US',
  ): Promise<Blob> {
    const endpoint = `plugins/${pluginId}/versions/${pluginVersionId}/properties_layout/localizations/locale=${locale}`;
    return ApiService.getRequest(endpoint);
  }

  getPluginLayoutFile(pluginId: string, pluginVersionId: string): Promise<Blob> {
    const endpoint = `plugins/${pluginId}/versions/${pluginVersionId}/properties_layout`;
    return ApiService.getRequest(endpoint);
  }

  putLocalizationFile(
    pluginId: string,
    pluginVersionId: string,
    locale: string,
    fileData: Blob,
  ): Promise<any> {
    const endpoint = `plugins/${pluginId}/versions/${pluginVersionId}/properties_layout/localizations/locale=${locale}`;
    return ApiService.putRequest(endpoint, fileData);
  }

  listPluginLayouts(
    pluginId: string,
    pluginVersionId: string,
    options?: GetPluginVersionContainersOptions,
  ): Promise<DataListResponse<LayoutFileListingEntryResource>> {
    const endpoint = `plugins/${pluginId}/versions/${pluginVersionId}/properties_layout.listing`;
    return ApiService.getRequest(endpoint, options);
  }

  getLocalizedPluginLayoutFromVersionId(
    pluginVersionId: string,
  ): Promise<{ plugin: PluginResource; layout?: PluginLayout }> {
    return this.findPluginFromVersionId(pluginVersionId).then(pluginResponse => {
      if (
        pluginResponse !== null &&
        pluginResponse.status !== 'error' &&
        pluginResponse.data.current_version_id
      ) {
        return this.getLocalizedPluginLayout(pluginResponse.data.id, pluginVersionId).then(res => {
          return { plugin: pluginResponse.data, layout: res || undefined };
        });
      } else return { plugin: pluginResponse.data, layout: undefined };
    });
  }

  getPluginVersionContainers(
    pluginId: string,
    pluginVersionId: string,
    params?: GetPluginVersionContainersOptions,
  ): Promise<DataListResponse<PluginManagerResource>> {
    const endpoint = `plugins/${pluginId}/versions/${pluginVersionId}/containers`;
    return ApiService.getRequest<DataListResponse<PluginManagerResource>>(endpoint, params);
  }

  postPluginVersionContainerAction(
    pluginId: string,
    pluginVersionId: string,
    action: PluginActionResource,
  ): Promise<DataResponse<any>> {
    const endpoint = `plugins/${pluginId}/versions/${pluginVersionId}/containers/action`;
    return ApiService.postRequest(endpoint, action);
  }

  getPluginConfigurationFile(
    pluginId: string,
    pluginVersionId: string,
    technicalName: string,
  ): Promise<Blob> {
    const endpoint = `plugins/${pluginId}/versions/${pluginVersionId}/configuration_file/technical_name=${technicalName}`;
    return ApiService.getRequest(endpoint);
  }

  listPluginConfigurationFiles(
    pluginId: string,
    pluginVersionId: string,
    options?: GetPluginVersionContainersOptions,
  ): Promise<DataListResponse<ConfigurationFileListingEntryResource>> {
    const endpoint = `plugins/${pluginId}/versions/${pluginVersionId}/configuration_file.listing`;
    return ApiService.getRequest(endpoint, options);
  }

  putPluginConfigurationFile(
    pluginId: string,
    pluginVersionId: string,
    technicalName: string,
    fileData: Blob,
  ): Promise<any> {
    const endpoint = `plugins/${pluginId}/versions/${pluginVersionId}/configuration_file/technical_name=${technicalName}`;
    return ApiService.putRequest(endpoint, fileData);
  }
}

export default PluginService;

import { injectable } from 'inversify';
import { PluginResource, PluginType, PluginVersionResource } from '../models/plugin/plugins';
import { PaginatedApiParam } from '../utils/ApiHelper';
import { ApiService } from '@mediarithmics-private/advanced-components';
import {
  DataListResponse,
  DataResponse,
} from '@mediarithmics-private/advanced-components/lib/services/ApiService';

interface GetPluginOptions extends Omit<PaginatedApiParam, 'first_result'> {
  plugin_type?: PluginType;
  artifact_id?: string;
  group_id?: string;
  organisation_id?: string;
  current_version_id?: string;
}

export interface IPluginService {
  getPlugin: (id: string) => Promise<DataResponse<PluginResource>>;
  getPlugins: (
    options: GetPluginOptions,
    withArchivedPluginVersion?: boolean,
  ) => Promise<DataListResponse<PluginResource>>;
  getPluginVersion: (
    pluginId: string,
    versionId: string,
  ) => Promise<DataResponse<PluginVersionResource>>;
  getPluginVersions: (
    pluginId: string,
    params?: object,
  ) => Promise<DataListResponse<PluginVersionResource>>;
  createPlugin: (body: Partial<PluginResource>) => Promise<DataResponse<PluginResource>>;
}

@injectable()
export class PluginService implements IPluginService {
  getPlugin(pluginId: string): Promise<DataResponse<PluginResource>> {
    const endpoint = `plugins/${pluginId}`;
    return ApiService.getRequest(endpoint);
  }
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
  getPluginVersion(
    pluginId: string,
    versionId: string,
  ): Promise<DataResponse<PluginVersionResource>> {
    const endpoint = `plugins/${pluginId}/versions/${versionId}`;
    return ApiService.getRequest(endpoint);
  }
  createPlugin(body: Partial<PluginResource>): Promise<DataResponse<PluginResource>> {
    const endpoint = `plugins`;
    return ApiService.postRequest(endpoint, body);
  }
  getPluginVersions(
    pluginId: string,
    params: object = {},
  ): Promise<DataListResponse<PluginVersionResource>> {
    const endpoint = `plugins/${pluginId}/versions`;
    return ApiService.getRequest(endpoint, params);
  }
}

import { injectable } from 'inversify';
import { PluginResource, PluginType, PluginVersionResource } from '../models/plugin/plugins';
import { PaginatedApiParam } from '../utils/ApiHelper';
import ApiService, { DataListResponse, DataResponse } from './ApiService';

interface GetPluginOptions extends Omit<PaginatedApiParam, 'first_result'> {
  plugin_type?: PluginType;
  artifact_id?: string;
  group_id?: string;
  organisation_id?: string;
}

export interface IPluginService {
  getPlugins: (
    options: GetPluginOptions,
    withArchivedPluginVersion?: boolean,
  ) => Promise<DataListResponse<PluginResource>>;
  getPluginVersion: (
    pluginId: string,
    versionId: string,
  ) => Promise<DataResponse<PluginVersionResource>>;
}

@injectable()
export class PluginService implements IPluginService {
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
}

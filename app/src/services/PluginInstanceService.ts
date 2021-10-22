import { PluginInstance } from '../models/plugin/plugins';
import { injectable, unmanaged } from 'inversify';
import { ApiService } from '@mediarithmics-private/advanced-components';
import { DataListResponse } from '@mediarithmics-private/advanced-components/lib/services/ApiService';

export interface IPluginInstanceService<T> {
  getInstances: (options: object) => Promise<DataListResponse<T>>;
}

@injectable()
abstract class PluginInstanceService<T extends PluginInstance>
  implements IPluginInstanceService<T>
{
  constructor(@unmanaged() public entityPath: string) {}

  getInstances = (options: object = {}): Promise<DataListResponse<T>> => {
    const endpoint = `${this.entityPath}`;

    const params = {
      ...options,
    };
    return ApiService.getRequest(endpoint, params);
  };
}

export default PluginInstanceService;

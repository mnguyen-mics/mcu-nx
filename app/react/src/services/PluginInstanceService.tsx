import ApiService, { DataListResponse, DataResponse } from './ApiService';
import { PropertyResourceShape } from '../models/plugin';
import { PluginInstance } from '../models/Plugins';
import PluginService from './PluginService';
import { PluginLayout } from '../models/plugin/PluginLayout';
// import { injectable, unmanaged } from 'inversify';

// export interface IPluginInstanceService<T> {
//   getInstanceById: (id: string, options?: object) => Promise<DataResponse<T>>;
//   getInstanceProperties: (
//     id: string,
//     options?: object,
//   ) => Promise<DataListResponse<PropertyResourceShape>>;
//   updatePluginInstance: (
//     id: string,
//     options: object,
//   ) => Promise<DataResponse<T>>;
//   updatePluginInstanceProperty: (
//     organisationId: string,
//     id: string,
//     technicalName: string,
//     params: object,
//   ) => Promise<DataResponse<PropertyResourceShape> | void>;
//   createPluginInstance: (
//     organisationId: string,
//     options: object,
//   ) => Promise<DataResponse<T>>;
//   getLocalizedPluginLayout(pInstanceId: string): Promise<PluginLayout | null>;
// }

// @injectable()
abstract class PluginInstanceService<T extends PluginInstance>
// implements IPluginInstanceService<T> {
{
  // entityPath: string;

  // constructor(@unmanaged() _entityPath: string) {
  //   this.entityPath = _entityPath;
  // }

  constructor(public entityPath: string) {}
  
  getInstanceById = (
    id: string,
    options: object = {},
  ): Promise<DataResponse<T>> => {
    const endpoint = `${this.entityPath}/${id}`;

    const params = {
      ...options,
    };
    return ApiService.getRequest(endpoint, params);
  };

  getInstanceProperties = (
    id: string,
    options: object = {},
  ): Promise<DataListResponse<PropertyResourceShape>> => {
    const endpoint = `${this.entityPath}/${id}/properties`;

    return ApiService.getRequest(endpoint, options);
  };

  updatePluginInstance = (
    id: string,
    options: object = {},
  ): Promise<DataResponse<T>> => {
    const endpoint = `${this.entityPath}/${id}`;

    const params = {
      ...options,
    };

    return ApiService.putRequest(endpoint, params);
  };

  updatePluginInstanceProperty = (
    organisationId: string,
    id: string,
    technicalName: string,
    params: object = {},
  ): Promise<DataResponse<PropertyResourceShape> | void> => {
    const endpoint = `${this.entityPath}/${id}/properties/technical_name=${technicalName}`;
    return PluginService.handleSaveOfProperties(
      params,
      organisationId,
      this.entityPath,
      id,
      endpoint,
    );
  };

  createPluginInstance = (
    organisationId: string,
    options: object = {},
  ): Promise<DataResponse<T>> => {
    const endpoint = `${this.entityPath}?organisation_id=${organisationId}`;

    const params = {
      ...options,
    };

    return ApiService.postRequest(endpoint, params);
  };

  abstract getLocalizedPluginLayout(
    pInstanceId: string,
  ): Promise<PluginLayout | null>;
}

export default PluginInstanceService;

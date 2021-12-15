/* eslint-disable import/extensions */
import log from '../utils/Logger';
import { PaginatedApiParam } from './../utils/ApiHelper';
import { injectable } from 'inversify';
import {
  CustomDashboardResource,
  CustomDashboardContentResource,
} from '../models/customDashboards/customDashboards';
import ApiService, { DataListResponse, DataResponse } from './ApiService';

export interface GetCustomDashboardsOption extends PaginatedApiParam {
  datamartId?: string;
  archived?: boolean;
  firstResult?: number;
  maxResults?: number;
}

export interface ICustomDashboardService {
  getDashboards: (
    organisationId: string,
    filters?: object,
  ) => Promise<DataListResponse<CustomDashboardResource> | null>;

  getDashboard: (
    dashboardId: string,
    organisationId: string,
  ) => Promise<DataResponse<CustomDashboardResource> | null>;

  getContent: (
    dashboardId: string,
    organisationId: string,
  ) => Promise<DataResponse<CustomDashboardContentResource> | null>;

  createContent: (
    dashboardId: string,
    organisationId: string,
    resource: Partial<CustomDashboardContentResource>,
  ) => Promise<DataResponse<CustomDashboardContentResource> | null>;

  createDashboard: (
    organisationId: string,
    resource: Partial<CustomDashboardResource>,
  ) => Promise<DataResponse<CustomDashboardResource> | null>;

  modifyDashboard: (
    dashboardId: string,
    organisationId: string,
    resource: Partial<CustomDashboardResource>,
  ) => Promise<DataResponse<CustomDashboardResource> | null>;
}

@injectable()
export default class CustomDashboardService implements ICustomDashboardService {
  getDashboards(
    organisationId: string,
    filters: object = {},
  ): Promise<DataListResponse<CustomDashboardResource> | null> {
    const endpoint = `dashboards`;

    const options = {
      ...filters,
      searching_organisation_id: organisationId,
      organisation_id: organisationId,
    };
    return ApiService.getRequest<DataListResponse<CustomDashboardResource>>(
      endpoint,
      options,
    ).catch((err: any) => {
      log.warn(`Cannot retrieve dashboards for the organisation ${organisationId}`, err);
      return null;
    });
  }

  getDashboard(
    dashboardId: string,
    organisationId: string,
  ): Promise<DataResponse<CustomDashboardResource> | null> {
    const endpoint = `dashboards/${dashboardId}`;

    const options = {
      organisation_id: organisationId,
    };

    return ApiService.getRequest<DataResponse<CustomDashboardResource>>(endpoint, options).catch(
      (err: any) => {
        log.warn(`Cannot retrieve the dashboard ${dashboardId}`, err);
        return null;
      },
    );
  }

  getContent(
    dashboardId: string,
    organisationId: string,
  ): Promise<DataResponse<CustomDashboardContentResource> | null> {
    const endpoint = `dashboards/${dashboardId}/content`;

    const options = {
      organisation_id: organisationId,
    };

    return ApiService.getRequest<DataResponse<CustomDashboardContentResource>>(
      endpoint,
      options,
    ).catch((err: any) => {
      log.warn('Cannot retrieve custom dashboard content', err);
      return null;
    });
  }

  createContent(
    dashboardId: string,
    organisationId: string,
    resource: Partial<CustomDashboardContentResource>,
  ): Promise<DataResponse<CustomDashboardContentResource> | null> {
    const endpoint = `dashboards/${dashboardId}/content`;
    const body: CustomDashboardContentResource = {
      ...resource,
      organisation_id: organisationId,
    } as CustomDashboardContentResource;

    return ApiService.putRequest<DataResponse<CustomDashboardContentResource>>(
      endpoint,
      body,
    ).catch((err: any) => {
      log.warn(`Cannot create custom dashboard content for the dashboard ${dashboardId}`, err);
      return null;
    });
  }

  createDashboard(
    organisationId: string,
    resource: Partial<CustomDashboardResource>,
  ): Promise<DataResponse<CustomDashboardResource> | null> {
    const endpoint = `dashboards`;
    const body: CustomDashboardResource = {
      ...resource,
      organisation_id: organisationId,
    } as CustomDashboardResource;

    return ApiService.postRequest<DataResponse<CustomDashboardResource>>(endpoint, body).catch(
      (err: any) => {
        log.warn(`Cannot create dashboard`, err);
        return null;
      },
    );
  }

  modifyDashboard(
    dashboardId: string,
    organisationId: string,
    resource: Partial<CustomDashboardResource>,
  ): Promise<DataResponse<CustomDashboardResource> | null> {
    const endpoint = `dashboards/${dashboardId}`;
    const body: CustomDashboardResource = {
      ...resource,
      organisation_id: organisationId,
    } as CustomDashboardResource;

    return ApiService.putRequest<DataResponse<CustomDashboardResource>>(endpoint, body).catch(
      (err: any) => {
        log.warn(`Cannot modify the dashboard ${dashboardId}`, err);
        return null;
      },
    );
  }
}

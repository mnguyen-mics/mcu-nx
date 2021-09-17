/* eslint-disable import/extensions */
import ApiService, { DataListResponse, DataResponse } from './ApiService';
import log from '../utils/Logger';
import { PaginatedApiParam } from './../utils/ApiHelper';
import { injectable } from 'inversify';
import {
  CustomDashboardResource,
  CustomDashboardContentResource,
} from '../models/customDashboards/customDashboards';

export interface GetCustomDashboardsOption extends PaginatedApiParam {
  datamartId?: string;
  archived?: boolean;
  firstResult?: number;
  maxResults?: number;
}

export interface ICustomDashboardService {
  getDashboards: (
    datamartId: string,
    archived?: boolean,
    firstResult?: number,
    maxResults?: number,
  ) => Promise<DataListResponse<CustomDashboardResource> | null>;

  getDashboard: (
    dashboardId: string,
    datamartId: string,
  ) => Promise<DataResponse<CustomDashboardResource> | null>;

  getContent: (
    dashboardId: string,
    datamartId: string,
  ) => Promise<DataResponse<CustomDashboardContentResource> | null>;
}

@injectable()
export class CustomDashboardService implements ICustomDashboardService {
  getDashboards(
    datamartId: string,
    archived?: boolean,
    firstResult?: number,
    maxResults?: number,
  ): Promise<DataListResponse<CustomDashboardResource> | null> {
    const endpoint = `datamarts/${datamartId}/dashboards`;
    return ApiService.getRequest<DataListResponse<CustomDashboardResource>>(endpoint).catch(
      (err: any) => {
        log.warn('Cannot retrieve custom dashboard', err);
        return null;
      },
    );
  }

  getDashboard(
    dashboardId: string,
    datamartId: string,
  ): Promise<DataResponse<CustomDashboardResource> | null> {
    const endpoint = `datamarts/${datamartId}/dashboards/${dashboardId}`;
    return ApiService.getRequest<DataResponse<CustomDashboardResource>>(endpoint).catch(
      (err: any) => {
        log.warn('Cannot retrieve custom dashboard', err);
        return null;
      },
    );
  }

  getContent(
    dashboardId: string,
    datamartId: string,
  ): Promise<DataResponse<CustomDashboardContentResource> | null> {
    const endpoint = `datamarts/${datamartId}/dashboards/${dashboardId}/content`;
    return ApiService.getRequest<DataResponse<CustomDashboardContentResource>>(endpoint).catch(
      (err: any) => {
        log.warn('Cannot retrieve custom dashboard content', err);
        return null;
      },
    );
  }
}

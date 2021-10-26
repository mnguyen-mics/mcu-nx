/* eslint-disable import/extensions */
import log from '../utils/Logger';
import { PaginatedApiParam } from './../utils/ApiHelper';
import { injectable } from 'inversify';
import {
  CustomDashboardResource,
  CustomDashboardContentResource,
} from '../models/customDashboards/customDashboards';
import { ApiService } from '@mediarithmics-private/advanced-components';
import {
  DataListResponse,
  DataResponse,
} from '@mediarithmics-private/advanced-components/lib/services/ApiService';

export interface GetCustomDashboardsOption extends PaginatedApiParam {
  datamartId?: string;
  archived?: boolean;
  firstResult?: number;
  maxResults?: number;
}

export interface ICustomDashboardService {
  getDashboards: (
    datamartId: string,
    organisationId: string,
    filters?: object,
  ) => Promise<DataListResponse<CustomDashboardResource> | null>;

  getDashboard: (
    dashboardId: string,
    organisationId: string,
    datamartId: string,
  ) => Promise<DataResponse<CustomDashboardResource> | null>;

  getContent: (
    dashboardId: string,
    organisationId: string,
    datamartId: string,
  ) => Promise<DataResponse<CustomDashboardContentResource> | null>;
}

@injectable()
export class CustomDashboardService implements ICustomDashboardService {
  getDashboards(
    datamartId: string,
    organisationId: string,
    filters: object = {},
  ): Promise<DataListResponse<CustomDashboardResource> | null> {
    const endpointLegacy = `datamarts/${datamartId}/dashboards`;
    const endpoint = `dashboards`;

    const optionsLegacy = {
      ...filters,
    };

    const options = {
      ...filters,
      searching_organisation_id: organisationId,
    };
    return ApiService.getRequest<DataListResponse<CustomDashboardResource>>(
      endpoint,
      options,
    ).catch((err: any) => {
      // TODO: remove this logic when delivery of MICS-10725 is finished
      if (err.error && err.error.includes('Route') && err.error.includes('Not Found')) {
        return ApiService.getRequest<DataListResponse<CustomDashboardResource>>(
          endpointLegacy,
          optionsLegacy,
        )
          .then(result => {
            return result;
          })
          .catch(err2 => {
            return null;
          });
      } else {
        log.warn('Cannot retrieve custom dashboard', err);
        return null;
      }
    });
  }

  getDashboard(
    dashboardId: string,
    organisationId: string,
    datamartId: string,
  ): Promise<DataResponse<CustomDashboardResource> | null> {
    const endpointLegacy = `datamarts/${datamartId}/dashboards/${dashboardId}`;
    const endpoint = `dashboards/${dashboardId}`;

    const options = {
      organisation_id: organisationId,
    };

    return ApiService.getRequest<DataResponse<CustomDashboardResource>>(endpoint, options).catch(
      (err: any) => {
        // TODO: remove this logic when delivery of MICS-10725 is finished
        if (err.error && err.error.includes('Route') && err.error.includes('Not Found')) {
          return ApiService.getRequest<DataResponse<CustomDashboardResource>>(endpointLegacy)
            .then(result => {
              return result;
            })
            .catch(err2 => {
              return null;
            });
        }
        log.warn('Cannot retrieve custom dashboard', err);
        return null;
      },
    );
  }

  getContent(
    dashboardId: string,
    organisationId: string,
    datamartId: string,
  ): Promise<DataResponse<CustomDashboardContentResource> | null> {
    const endpointLegacy = `datamarts/${datamartId}/dashboards/${dashboardId}/content`;
    const endpoint = `datamarts/${datamartId}/dashboards/${dashboardId}/content`;

    const options = {
      organisation_id: organisationId,
    };

    return ApiService.getRequest<DataResponse<CustomDashboardContentResource>>(
      endpoint,
      options,
    ).catch((err: any) => {
      // TODO: remove this logic when delivery of MICS-10725 is finished
      if (err.error && err.error.includes('Route') && err.error.includes('Not Found')) {
        return ApiService.getRequest<DataResponse<CustomDashboardContentResource>>(endpointLegacy)
          .then(result => {
            return result;
          })
          .catch(err2 => {
            return null;
          });
      } else {
        log.warn('Cannot retrieve custom dashboard content', err);
        return null;
      }
    });
  }
}

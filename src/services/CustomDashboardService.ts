/* eslint-disable import/extensions */
import { PaginatedApiParam } from './../utils/ApiHelper';
import { injectable } from 'inversify';
import {
  CustomDashboardResource,
  CustomDashboardContentResource,
  DashboardContentSchema,
} from '../models/customDashboards/customDashboards';
import ApiService, { DataListResponse, DataResponse } from './ApiService';
import {
  DashboardContent,
  DashboardPageContent,
  DashboardResource,
  DashboardsOptions,
  DashoboardScope,
} from '../models/dashboards/old-dashboards-model';

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
  ) => Promise<DataListResponse<CustomDashboardResource>>;

  getDashboard: (
    dashboardId: string,
    organisationId: string,
  ) => Promise<DataResponse<CustomDashboardResource>>;

  getContent: (
    dashboardId: string,
    organisationId: string,
  ) => Promise<DataResponse<CustomDashboardContentResource>>;

  createContent: (
    dashboardId: string,
    contentJson: DashboardContentSchema,
  ) => Promise<DataResponse<CustomDashboardContentResource>>;

  createDashboard: (
    organisationId: string,
    resource: Partial<CustomDashboardResource>,
  ) => Promise<DataResponse<CustomDashboardResource>>;

  updateDashboard: (
    dashboardId: string,
    organisationId: string,
    resource: Partial<CustomDashboardResource>,
  ) => Promise<DataResponse<CustomDashboardResource>>;

  getDashboardContent: (
    dashboardId: string,
    organisationId: string,
  ) => Promise<DataResponse<DashboardContent>>;

  getDashboardsPageContents: (
    organisationId: string,
    options?: DashboardsOptions,
    filterScope?: DashoboardScope,
    filterScopedId?: string,
  ) => Promise<DashboardPageContent[]>;
}

@injectable()
export default class CustomDashboardService implements ICustomDashboardService {
  getDashboards(
    organisationId: string,
    filters: object = {},
  ): Promise<DataListResponse<CustomDashboardResource>> {
    const endpoint = `dashboards`;

    const options = {
      ...filters,
      searching_organisation_id: organisationId,
      organisation_id: organisationId,
    };
    return ApiService.getRequest<DataListResponse<CustomDashboardResource>>(endpoint, options);
  }

  getDashboard(
    dashboardId: string,
    organisationId: string,
  ): Promise<DataResponse<CustomDashboardResource>> {
    const endpoint = `dashboards/${dashboardId}`;

    const options = {
      organisation_id: organisationId,
    };

    return ApiService.getRequest<DataResponse<CustomDashboardResource>>(endpoint, options);
  }

  getContent(
    dashboardId: string,
    organisationId: string,
  ): Promise<DataResponse<CustomDashboardContentResource>> {
    const endpoint = `dashboards/${dashboardId}/content`;

    const options = {
      organisation_id: organisationId,
    };

    return ApiService.getRequest<DataResponse<CustomDashboardContentResource>>(endpoint, options);
  }

  createContent(
    dashboardId: string,
    contentJson: DashboardContentSchema,
  ): Promise<DataResponse<CustomDashboardContentResource>> {
    const endpoint = `dashboards/${dashboardId}/content`;

    return ApiService.putRequest<DataResponse<CustomDashboardContentResource>>(
      endpoint,
      contentJson,
    );
  }

  createDashboard(
    organisationId: string,
    resource: Partial<CustomDashboardResource>,
  ): Promise<DataResponse<CustomDashboardResource>> {
    const endpoint = `dashboards`;
    const body: CustomDashboardResource = {
      ...resource,
      organisation_id: organisationId,
    } as CustomDashboardResource;

    return ApiService.postRequest<DataResponse<CustomDashboardResource>>(endpoint, body);
  }

  updateDashboard(
    dashboardId: string,
    organisationId: string,
    resource: Partial<CustomDashboardResource>,
  ): Promise<DataResponse<CustomDashboardResource>> {
    const endpoint = `dashboards/${dashboardId}`;
    const body: CustomDashboardResource = {
      ...resource,
      organisation_id: organisationId,
    } as CustomDashboardResource;

    return ApiService.putRequest<DataResponse<CustomDashboardResource>>(endpoint, body);
  }

  getDashboardContent(
    dashboardId: string,
    organisationId: string,
  ): Promise<DataResponse<DashboardContent>> {
    const endpoint = `dashboards/${dashboardId}/content`;

    const params = {
      organisation_id: organisationId,
    };
    return ApiService.getRequest(endpoint, params);
  }

  private isDashboardMatchScope(
    dashboard: DashboardResource,
    filterScope?: DashoboardScope,
    filterScopedId?: string,
  ): boolean {
    return dashboard.scopes.some(
      scope =>
        !filterScope ||
        (scope === filterScope && !filterScopedId) ||
        (scope === filterScope &&
          filterScope === 'segments' &&
          (dashboard.segment_ids.length > 0
            ? dashboard.segment_ids.some(id => id === filterScopedId)
            : true)) ||
        (scope === filterScope &&
          filterScope === 'builders' &&
          (dashboard.builder_ids.length > 0
            ? dashboard.builder_ids.some(id => id === filterScopedId)
            : true)),
    );
  }

  getDashboardsPageContents(
    organisationId: string,
    options?: DashboardsOptions,
    filterScope?: DashoboardScope,
    filterScopedId?: string,
  ): Promise<DashboardPageContent[]> {
    return this.getDashboards(organisationId, options).then(res => {
      const apiDashboards: DashboardResource[] = (res.data as DashboardResource[]).filter(
        dashboard => this.isDashboardMatchScope(dashboard, filterScope, filterScopedId),
      );
      if (apiDashboards && apiDashboards.length === 0) return new Array() as DashboardPageContent[];
      else {
        const dashboardContentsPromises = apiDashboards.map(dashboard =>
          this.getDashboardContent(dashboard.id, organisationId).catch(_ => undefined),
        );

        return Promise.all(dashboardContentsPromises).then(contents => {
          const apiDashboardContents = contents
            .map((content, i) => {
              if (!!content) {
                return {
                  title: apiDashboards[i].title,
                  dashboardContent: content.data.content,
                };
              } else {
                const undefinedContent: DashboardPageContent = {
                  title: apiDashboards[i].title,
                  dashboardContent: undefined,
                };
                return undefinedContent;
              }
            })
            .filter(dashboard => !!dashboard) as DashboardPageContent[];

          return apiDashboardContents;
        });
      }
    });
  }
}

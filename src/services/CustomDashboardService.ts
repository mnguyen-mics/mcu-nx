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
  DashboardScope,
  DashboardContentStats,
} from '../models/dashboards/old-dashboards-model';
import { AbstractParentSource, AbstractSource } from './ChartDatasetService';

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
    filterScope?: DashboardScope,
    filterScopedId?: string,
  ) => Promise<DashboardPageContent[]>;

  deleteDashboard: (dashboardId: string, organisationId: string) => Promise<void>;

  countDashboardsStats(dashboard: DashboardPageContent): DashboardContentStats;
}

@injectable()
export default class CustomDashboardService implements ICustomDashboardService {
  async deleteDashboard(dashboardId: string, organisationId: string): Promise<void> {
    const endpoint = `dashboards/${dashboardId}`;
    const options = {
      searching_organisation_id: organisationId,
      organisation_id: organisationId,
    };
    return ApiService.deleteRequest<void>(endpoint, options);
  }

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
    filterScope?: DashboardScope,
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
    filterScope?: DashboardScope,
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
                  dashboardRegistrationId: apiDashboards[i].id,
                  scopes: apiDashboards[i].scopes,
                  title: apiDashboards[i].title,
                  dashboardContent: content.data.content,
                };
              } else {
                const undefinedContent: DashboardPageContent = {
                  dashboardRegistrationId: apiDashboards[i].id,
                  scopes: apiDashboards[i].scopes,
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

  private sumStats(s1: DashboardContentStats, s2: DashboardContentStats): DashboardContentStats {
    return {
      numberCharts: s1.numberCharts + s2.numberCharts,
      otqlQueries: s1.otqlQueries + s2.otqlQueries,
      activitiesAnalyticsQueries: s1.activitiesAnalyticsQueries + s2.activitiesAnalyticsQueries,
      collectionVolumesQueries: s1.collectionVolumesQueries + s2.collectionVolumesQueries,
      datafileQueries: s1.datafileQueries + s2.datafileQueries,
    };
  }

  private countStatsForSource(
    source: AbstractSource,
    initialStats: DashboardContentStats,
  ): DashboardContentStats {
    const sourceType = source.type.toLowerCase();

    if (sourceType === 'otql') {
      return {
        ...initialStats,
        otqlQueries: initialStats.otqlQueries + 1,
      };
    } else if (sourceType === 'collection_volumes') {
      return {
        ...initialStats,
        collectionVolumesQueries: initialStats.collectionVolumesQueries + 1,
      };
    } else if (sourceType === 'activities_analytics') {
      return {
        ...initialStats,
        activitiesAnalyticsQueries: initialStats.activitiesAnalyticsQueries + 1,
      };
    } else if (sourceType === 'data_file') {
      return {
        ...initialStats,
        datafileQueries: initialStats.datafileQueries + 1,
      };
    } else if (
      [
        'join',
        'to-list',
        'to-percentages',
        'index',
        'ratio',
        'format-dates',
        'get-decorators',
      ].includes(sourceType)
    ) {
      const parentSource = source as AbstractParentSource;
      const childSources = parentSource.sources;
      const stats: DashboardContentStats[] = childSources.map(s =>
        this.countStatsForSource(s, initialStats),
      );
      return stats.reduce((prev, cur) => this.sumStats(prev, cur));
    } else {
      return initialStats;
    }
  }

  countDashboardsStats(dashboard: DashboardPageContent): DashboardContentStats {
    const initialStats: DashboardContentStats = {
      numberCharts: 0,
      otqlQueries: 0,
      activitiesAnalyticsQueries: 0,
      collectionVolumesQueries: 0,
      datafileQueries: 0,
    };

    if (dashboard.dashboardContent) {
      const chartsList = dashboard.dashboardContent.sections.flatMap(section =>
        section.cards.flatMap(card => card.charts),
      );

      const result = chartsList
        .map(chart => this.countStatsForSource(chart.dataset, initialStats))
        .reduce((prev, cur) => this.sumStats(prev, cur));

      return {
        ...result,
        numberCharts: chartsList.length,
      };
    } else return initialStats;
  }
}

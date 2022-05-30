/* eslint-disable import/extensions */
import * as yup from 'yup';
import log from '../utils/Logger';
import { PaginatedApiParam } from './../utils/ApiHelper';
import { inject, injectable } from 'inversify';
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
  DataFileDashboardResource,
} from '../models/dashboards/old-dashboards-model';
import { DashboardType } from '../models/dashboards/dashboards';
import { myDashboards } from '../utils/DefaultDashboards';
import { TYPES } from '../constants/types';
import { IDataFileService } from './DataFileService';
import { AbstractParentSource, AbstractSource } from '../models/dashboards/dataset/datasource_tree';

export interface GetDashboardsOptions extends PaginatedApiParam {
  organisation_id?: string;
  datamartId?: string;
  type?: DashboardType;
  keywords?: string;
  status?: string[];
  order_by?: string[];
}

const readFile = (b: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      return resolve(reader.result as string);
    };
    reader.onerror = r => {
      return reject(r);
    };
    reader.readAsText(b);
  });

const dashboardsSchema = yup.array().of(
  yup.object().shape({
    id: yup.string().required(),
    type: yup.string().required(),
    datamart_id: yup.string().required(),
    name: yup.string().required(),
    components: yup.array(
      yup.object().shape({
        layout: yup.object().shape({
          i: yup.string(),
          x: yup.number().required(),
          y: yup.number().required(),
          w: yup.number().required(),
          h: yup.number().required(),
        }),
        component: yup
          .object()
          .required()
          .shape({
            id: yup.string().required(),
            component_type: yup
              .string()
              .required()
              .oneOf([
                'MAP_BAR_CHART',
                'MAP_PIE_CHART',
                'DATE_AGGREGATION_CHART',
                'COUNT',
                'PERCENTAGE',
                'GAUGE_PIE_CHART',
                'MAP_STACKED_BAR_CHART',
                'MAP_INDEX_CHART',
                'WORLD_MAP_CHART',
                'COUNT_BAR_CHART',
                'COUNT_PIE_CHART',
                'TOP_INFO_COMPONENT',
                'MAP_RADAR_CHART',
              ]),
            title: yup.string().required(),
            description: yup.string(),
          }),
      }),
    ),
  }),
);

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

  getDataFileDashboards: (
    organisationId: string,
    datamartId: string,
    type: 'HOME' | 'SEGMENT',
    options?: GetDashboardsOptions,
  ) => Promise<DataListResponse<DataFileDashboardResource>>;

  getDataFileSegmentDashboards: (
    organisationId: string,
    datamartId: string,
    segmentId: string,
    options?: GetDashboardsOptions,
  ) => Promise<DataListResponse<DataFileDashboardResource>>;

  getDataFileStandardSegmentBuilderDashboards: (
    organisationId: string,
    datamartId: string,
    standardSegmentBuilderId: string,
    options?: GetDashboardsOptions,
  ) => Promise<DataListResponse<DataFileDashboardResource>>;

  getDefaultDashboard: (dashboardId: string) => Promise<DataResponse<DataFileDashboardResource>>;
}

@injectable()
export default class CustomDashboardService implements ICustomDashboardService {
  @inject(TYPES.IDataFileService)
  private _datafileService!: IDataFileService;

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
        'reduce',
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

  getDataFileDashboards(
    organisationId: string,
    datamartId: string,
    type: 'HOME' | 'SEGMENT' | 'AUDIENCE_BUILDER',
    options: GetDashboardsOptions = {},
  ): Promise<DataListResponse<DataFileDashboardResource>> {
    const hardcodedDashboards = myDashboards.filter(
      d => d.datamart_id === datamartId && d.type === type,
    );

    return new Promise((resolve, reject) => {
      return this._datafileService
        .getDatafileData(
          `mics://data_file/tenants/${organisationId}/dashboards/${datamartId}/${type}.json`,
        )
        .then((b: Blob) => {
          return readFile(b);
        })
        .then(s => {
          // validate with yup
          return JSON.parse(s);
        })
        .then((s: object) => {
          return dashboardsSchema.validate(s).then(v => {
            if ((v as any).name === 'ValidationError') {
              throw new Error((v as any).message);
            }
            return v as any;
          });
        })
        .then(s => {
          return resolve({
            status: 'ok' as any,
            data: s as DataFileDashboardResource[],
            count: hardcodedDashboards.filter(d => d.datamart_id === datamartId).length,
          });
        })
        .catch(e => {
          log.debug(e);
          return resolve({
            status: 'ok' as any,
            data: hardcodedDashboards as DataFileDashboardResource[],
            count: hardcodedDashboards.filter(d => d.datamart_id === datamartId).length,
          });
        });
    });
  }

  getDataFileSegmentDashboards(
    organisationId: string,
    datamartId: string,
    segmentId: string,
    options: GetDashboardsOptions = {},
  ): Promise<DataListResponse<DataFileDashboardResource>> {
    const hardcodedDashboards = myDashboards.filter(
      d => d.datamart_id === datamartId && d.type === 'SEGMENT',
    );

    return new Promise((resolve, reject) => {
      return this._datafileService
        .getDatafileData(
          `mics://data_file/tenants/${organisationId}/dashboards/${datamartId}/SEGMENT-${segmentId}.json`,
        )
        .then(
          d => d,
          () =>
            this._datafileService.getDatafileData(
              `mics://data_file/tenants/${organisationId}/dashboards/${datamartId}/SEGMENT.json`,
            ),
        )
        .then((b: Blob) => {
          return readFile(b);
        })
        .then(s => {
          // validate with yup
          return JSON.parse(s);
        })
        .then((s: object) => {
          return dashboardsSchema.validate(s).then(v => {
            if ((v as any).name === 'ValidationError') {
              throw new Error((v as any).message);
            }
            return v as any;
          });
        })
        .then(s => {
          return resolve({
            status: 'ok' as any,
            data: s as DataFileDashboardResource[],
            count: hardcodedDashboards.filter(d => d.datamart_id === datamartId).length,
          });
        })
        .catch(e => {
          log.debug(e);
          return resolve({
            status: 'ok' as any,
            data: hardcodedDashboards as DataFileDashboardResource[],
            count: hardcodedDashboards.filter(d => d.datamart_id === datamartId).length,
          });
        });
    });
  }

  getDataFileStandardSegmentBuilderDashboards(
    organisationId: string,
    datamartId: string,
    standardSegmentBuilderId: string,
    options: GetDashboardsOptions = {},
  ): Promise<DataListResponse<DataFileDashboardResource>> {
    const hardcodedDashboards = myDashboards.filter(
      d => d.datamart_id === datamartId && d.type === 'AUDIENCE_BUILDER',
    );

    return new Promise((resolve, reject) => {
      return this._datafileService
        .getDatafileData(
          `mics://data_file/tenants/${organisationId}/dashboards/${datamartId}/AUDIENCE_BUILDER-${standardSegmentBuilderId}.json`,
        )
        .then(
          d => d,
          () =>
            this._datafileService.getDatafileData(
              `mics://data_file/tenants/${organisationId}/dashboards/${datamartId}/AUDIENCE_BUILDER.json`,
            ),
        )
        .then((b: Blob) => {
          return readFile(b);
        })
        .then(s => {
          // validate with yup
          return JSON.parse(s);
        })
        .then((s: object) => {
          return dashboardsSchema.validate(s).then(v => {
            if ((v as any).name === 'ValidationError') {
              throw new Error((v as any).message);
            }
            return v as any;
          });
        })
        .then(s => {
          return resolve({
            status: 'ok' as any,
            data: s as DataFileDashboardResource[],
            count: hardcodedDashboards.filter(d => d.datamart_id === datamartId).length,
          });
        })
        .catch(e => {
          log.debug(e);
          return resolve({
            status: 'ok' as any,
            data: hardcodedDashboards as DataFileDashboardResource[],
            count: hardcodedDashboards.filter(d => d.datamart_id === datamartId).length,
          });
        });
    });
  }

  getDefaultDashboard(dashboardId: string): Promise<DataResponse<DataFileDashboardResource>> {
    // const endpoint = `dashboards/${dashboardId}`;
    // return ApiService.getRequest(endpoint);
    const foundDashboard = myDashboards.find(d => d.id === dashboardId);
    if (foundDashboard) {
      return Promise.resolve({ status: 'ok' as any, data: foundDashboard });
    }
    return Promise.reject({ status: 'error' as any, message: 'NOT_FOUND' });
  }
}

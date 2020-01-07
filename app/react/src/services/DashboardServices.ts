import { injectable } from 'inversify';
import { DataListResponse, DataResponse } from './ApiService';
import { PaginatedApiParam } from '../utils/ApiHelper';
import {
  PAGINATION_SEARCH_SETTINGS,
  FILTERS_SEARCH_SETTINGS,
  KEYWORD_SEARCH_SETTINGS,
} from '../utils/LocationSearchHelper';
import {
  DashboardType,
  DashboardResource,
} from '../models/dashboards/dashboards';

export interface GetDashboardsOptions extends PaginatedApiParam {
  organisation_id?: string;
  datamartId?: string;
  type?: DashboardType;
  keywords?: string;
  status?: string[];
  order_by?: string[];
}

export const SCENARIOS_SEARCH_SETTINGS = [
  ...PAGINATION_SEARCH_SETTINGS,
  ...FILTERS_SEARCH_SETTINGS,
  ...KEYWORD_SEARCH_SETTINGS,
];

export interface IDashboardService {
  /*****   DASHBOARD RESOURCE   *****/
  getDashboards: (
    datamartId: string,
    options: GetDashboardsOptions,
  ) => Promise<DataListResponse<DashboardResource>>;
  getDashboard: (
    dashboardId: string,
  ) => Promise<DataResponse<DashboardResource>>;
}

@injectable()
export class DashboardService implements IDashboardService {
  getDashboards(
    datamartId: string,
    options: GetDashboardsOptions = {},
  ): Promise<DataListResponse<DashboardResource>> {
    // const endpoint = 'dashboards';
    // const params = {
    //   ...options,
    // };
    // return ApiService.getRequest(endpoint, params);
    return Promise.resolve({
      status: 'ok' as any,
      data: myDashboards.filter(
        d =>
          d.datamart_id === datamartId &&
          (options.type ? d.type === options.type : true),
      ),
      count: myDashboards.filter(d => d.datamart_id === datamartId).length,
    });
  }
  getDashboard(dashboardId: string): Promise<DataResponse<DashboardResource>> {
    // const endpoint = `dashboards/${dashboardId}`;
    // return ApiService.getRequest(endpoint);
    const foundDashboard = myDashboards.find(d => d.id === dashboardId);
    if (foundDashboard) {
      return Promise.resolve({ status: 'ok' as any, data: foundDashboard });
    }
    return Promise.reject({ status: 'error' as any, message: 'NOT_FOUND' });
  }
}

const myDashboards: DashboardResource[] = [
  {
    datamart_id: '1265',
    id: '1',
    name: 'Home',
    type: 'HOME',
    components: [
      {
        layout: {
          h: 1,
          static: false,
          w: 3,
          x: 0,
          y: 0,
        },
        component: {
          id: 1,
          component_type: 'PERCENTAGE',
          query_id: '25344',
          total_query_id: '25345',
          title: 'Pourcentage de visites reconnues (30j)',
        },
      },
      {
        layout: {
          h: 1,
          static: false,
          w: 3,
          x: 3,
          y: 0,
        },
        component: {
          id: 2,
          component_type: 'COUNT',
          query_id: '25365',
          title: 'Nombre de tickets global',
        },
      },
      {
        layout: {
          h: 1,
          static: false,
          w: 3,
          x: 6,
          y: 0,
        },
        component: {
          id: 3,
          component_type: 'COUNT',
          query_id: '25346',
          title: 'Nombre de contacts CRM',
        },
      },
      {
        layout: {
          h: 1,
          static: false,
          w: 3,
          x: 9,
          y: 0,
        },
        component: {
          id: 4,
          component_type: 'COUNT',
          query_id: '25347',
          title: 'Nombre de userpoints web',
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 6,
          x: 0,
          y: 1,
        },
        component: {
          id: 5,
          component_type: 'MAP_PIE_CHART',
          query_id: '25348',
          title: 'Répartition des visites par type de profil matching (30j)',
          show_legend: true,
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 6,
          x: 6,
          y: 1,
        },
        component: {
          id: 5,
          component_type: 'COUNT_PIE_CHART',
          query_ids: ['25349', '25350', '25351'],
          labels_enabled: true,
          plot_labels: ['2nd', '1st_email_click', '1st logged'],
          title: 'Nombre de user par type de profil matching (30j)',
          show_legend: false,
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 6,
          x: 0,
          y: 4,
        },
        component: {
          id: 5,
          component_type: 'COUNT_PIE_CHART',
          query_ids: ['25352', '25353', '25354', '25355', '25356'],
          labels_enabled: true,
          plot_labels: [
            'Page View',
            'Basket View',
            'Purchase',
            'Search',
            'Email Click',
          ],
          title: "Nombre d'évènements web par typologie (30j)",
          show_legend: false,
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 6,
          x: 6,
          y: 4,
        },
        component: {
          id: 5,
          component_type: 'COUNT_PIE_CHART',
          query_ids: ['25357', '25358'],
          labels_enabled: true,
          plot_labels: [
            'Contact CRM avec activités',
            'Contact CRM sans activités',
          ],
          title: 'Activité web des contacts CRM ',
          show_legend: false,
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 12,
          x: 0,
          y: 7,
        },
        component: {
          id: 5,
          component_type: 'DATE_AGGREGATION_CHART',
          query_ids: ['25398', '25399', '25400', '25401'],
          plot_labels: ['email clicks', 'basket view', 'purchase', 'search'],
          title: "Nombre d'évènements web par jour par typologie (30j)",
          labels_enabled: true,
          format: 'YYYY/MM/DD',
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 12,
          x: 0,
          y: 10,
        },
        component: {
          id: 5,
          component_type: 'DATE_AGGREGATION_CHART',
          query_ids: ['25359', '25360'],
          plot_labels: ['1st', '2nd'],
          title: 'Nombre de visites par jour par type de profil matching (30j)',
          labels_enabled: true,
          format: 'YYYY/MM/DD',
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 12,
          x: 0,
          y: 13,
        },
        component: {
          id: 5,
          component_type: 'DATE_AGGREGATION_CHART',
          query_ids: ['25362'],
          plot_labels: ['tickets'],
          title: 'Nombre de tickets réalisés par les contacts CRM',
          labels_enabled: true,
          format: 'YYYY/MM/DD',
        },
      },
    ],
  },
  {
    datamart_id: '1365',
    id: '1',
    name: 'Home',
    type: 'HOME',
    components: [
      {
        layout: {
          h: 1,
          static: false,
          w: 3,
          x: 0,
          y: 0,
        },
        component: {
          id: 1,
          component_type: 'PERCENTAGE',
          query_id: '27824',
          total_query_id: '27825',
          title: 'Pourcentage de visites reconnues (30j)',
        },
      },
      {
        layout: {
          h: 1,
          static: false,
          w: 3,
          x: 3,
          y: 0,
        },
        component: {
          id: 2,
          component_type: 'COUNT',
          query_id: '27826',
          title: 'Nombre de tickets global',
        },
      },
      {
        layout: {
          h: 1,
          static: false,
          w: 3,
          x: 6,
          y: 0,
        },
        component: {
          id: 3,
          component_type: 'COUNT',
          query_id: '27827',
          title: 'Nombre de contacts CRM',
        },
      },
      {
        layout: {
          h: 1,
          static: false,
          w: 3,
          x: 9,
          y: 0,
        },
        component: {
          id: 4,
          component_type: 'COUNT',
          query_id: '27828',
          title: 'Nombre de userpoints web',
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 6,
          x: 0,
          y: 1,
        },
        component: {
          id: 5,
          component_type: 'MAP_PIE_CHART',
          query_id: '27832',
          title: 'Répartition des visites par type de profil matching (30j)',
          show_legend: true,
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 6,
          x: 6,
          y: 1,
        },
        component: {
          id: 5,
          component_type: 'COUNT_PIE_CHART',
          query_ids: ['27833', '27834', '27835'],
          labels_enabled: true,
          plot_labels: ['2nd', '1st_email_click', '1st logged'],
          title: 'Nombre de user par type de profil matching (30j)',
          show_legend: false,
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 6,
          x: 0,
          y: 4,
        },
        component: {
          id: 5,
          component_type: 'COUNT_PIE_CHART',
          query_ids: ['27836', '27837', '27838', '27839', '27840'],
          labels_enabled: true,
          plot_labels: [
            'Page View',
            'Basket View',
            'Purchase',
            'Search',
            'Email Click',
          ],
          title: "Nombre d'évènements web par typologie (30j)",
          show_legend: false,
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 6,
          x: 6,
          y: 4,
        },
        component: {
          id: 5,
          component_type: 'COUNT_PIE_CHART',
          query_ids: ['27841', '27842'],
          labels_enabled: true,
          plot_labels: [
            'Contact CRM avec activités',
            'Contact CRM sans activités',
          ],
          title: 'Activité web des contacts CRM ',
          show_legend: false,
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 12,
          x: 0,
          y: 7,
        },
        component: {
          id: 5,
          component_type: 'DATE_AGGREGATION_CHART',
          query_ids: ['27844', '27845', '27846', '27847'],
          plot_labels: ['email clicks', 'basket view', 'purchase', 'search'],
          title: "Nombre d'évènements web par jour par typologie (30j)",
          labels_enabled: true,
          format: 'YYYY/MM/DD',
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 12,
          x: 0,
          y: 10,
        },
        component: {
          id: 5,
          component_type: 'DATE_AGGREGATION_CHART',
          query_ids: ['27848', '27849'],
          plot_labels: ['1st', '2nd'],
          title: 'Nombre de visites par jour par type de profil matching (30j)',
          labels_enabled: true,
          format: 'YYYY/MM/DD',
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 12,
          x: 0,
          y: 13,
        },
        component: {
          id: 5,
          component_type: 'DATE_AGGREGATION_CHART',
          query_ids: ['27850'],
          plot_labels: ['tickets'],
          title: 'Nombre de tickets réalisés par les contacts CRM',
          labels_enabled: true,
          format: 'YYYY/MM/DD',
        },
      },
    ],
  },
  {
    datamart_id: '1298',
    id: '1',
    name: 'Home',
    type: 'HOME',
    components: [
      {
        layout: {
          h: 1,
          static: false,
          w: 3,
          x: 0,
          y: 0,
        },
        component: {
          id: 1,
          component_type: 'PERCENTAGE',
          query_id: '27868',
          total_query_id: '27870',
          title: 'Pourcentage de visites reconnues (30j)',
        },
      },
      {
        layout: {
          h: 1,
          static: false,
          w: 3,
          x: 3,
          y: 0,
        },
        component: {
          id: 2,
          component_type: 'COUNT',
          query_id: '27873',
          title: 'Nombre de tickets global',
        },
      },
      {
        layout: {
          h: 1,
          static: false,
          w: 3,
          x: 6,
          y: 0,
        },
        component: {
          id: 3,
          component_type: 'COUNT',
          query_id: '27871',
          title: 'Nombre de contacts CRM',
        },
      },
      {
        layout: {
          h: 1,
          static: false,
          w: 3,
          x: 9,
          y: 0,
        },
        component: {
          id: 4,
          component_type: 'COUNT',
          query_id: '27872',
          title: 'Nombre de userpoints web',
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 6,
          x: 0,
          y: 1,
        },
        component: {
          id: 5,
          component_type: 'MAP_PIE_CHART',
          query_id: '27874',
          title: 'Répartition des visites par type de profil matching (30j)',
          show_legend: true,
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 6,
          x: 6,
          y: 1,
        },
        component: {
          id: 5,
          component_type: 'COUNT_PIE_CHART',
          query_ids: ['27875', '27876', '27877'],
          labels_enabled: true,
          plot_labels: ['2nd', '1st_email_click', '1st logged'],
          title: 'Nombre de user par type de profil matching (30j)',
          show_legend: false,
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 6,
          x: 0,
          y: 4,
        },
        component: {
          id: 5,
          component_type: 'COUNT_PIE_CHART',
          query_ids: ['27878', '27879', '27880', '27881', '27882'],
          labels_enabled: true,
          plot_labels: [
            'Page View',
            'Basket View',
            'Purchase',
            'Search',
            'Email Click',
          ],
          title: "Nombre d'évènements web par typologie (30j)",
          show_legend: false,
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 6,
          x: 6,
          y: 4,
        },
        component: {
          id: 5,
          component_type: 'COUNT_PIE_CHART',
          query_ids: ['27883', '27884'],
          labels_enabled: true,
          plot_labels: [
            'Contact CRM avec activités',
            'Contact CRM sans activités',
          ],
          title: 'Activité web des contacts CRM ',
          show_legend: false,
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 12,
          x: 0,
          y: 7,
        },
        component: {
          id: 5,
          component_type: 'DATE_AGGREGATION_CHART',
          query_ids: ['27890', '27891', '27892', '27894'],
          plot_labels: ['email clicks', 'basket view', 'purchase', 'search'],
          title: "Nombre d'évènements web par jour par typologie (30j)",
          labels_enabled: true,
          format: 'YYYY/MM/DD',
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 12,
          x: 0,
          y: 10,
        },
        component: {
          id: 5,
          component_type: 'DATE_AGGREGATION_CHART',
          query_ids: ['27885', '27886'],
          plot_labels: ['1st', '2nd'],
          title: 'Nombre de visites par jour par type de profil matching (30j)',
          labels_enabled: true,
          format: 'YYYY/MM/DD',
        },
      },
      {
        layout: {
          h: 3,
          static: false,
          w: 12,
          x: 0,
          y: 13,
        },
        component: {
          id: 5,
          component_type: 'DATE_AGGREGATION_CHART',
          query_ids: ['27895'],
          plot_labels: ['tickets'],
          title: 'Nombre de tickets réalisés par les contacts CRM',
          labels_enabled: true,
          format: 'YYYY/MM/DD',
        },
      },
    ],
  },
  {
    id: '1',
    name: 'Home',
    type: 'HOME',
    components: [
      {
        layout: { h: 1, static: false, w: 3, x: 0, y: 0 },
        component: {
          id: 1,
          component_type: 'PERCENTAGE',
          title: 'Pourcentage de visites reconnues (30j)',
          query_id: '29525',
          total_query_id: '29521',
        },
      },
      {
        layout: { h: 1, static: false, w: 3, x: 3, y: 0 },
        component: {
          id: 2,
          component_type: 'COUNT',
          title: 'Nombre de tickets global',
          query_id: '29523',
        },
      },
      {
        layout: { h: 1, static: false, w: 3, x: 6, y: 0 },
        component: {
          id: 3,
          component_type: 'COUNT',
          title: 'Nombre de contacts CRM',
          query_id: '29526',
        },
      },
      {
        layout: { h: 1, static: false, w: 3, x: 9, y: 0 },
        component: {
          id: 4,
          component_type: 'COUNT',
          title: 'Nombre de userpoints web',
          query_id: '29522',
        },
      },
      {
        layout: { h: 3, static: false, w: 6, x: 0, y: 1 },
        component: {
          id: 5,
          component_type: 'MAP_PIE_CHART',
          title: 'Répartition des visites par type de profil matching (30j)',
          show_legend: true,
          query_id: '29524',
        },
      },
      {
        layout: { h: 3, static: false, w: 6, x: 6, y: 1 },
        component: {
          id: 5,
          component_type: 'COUNT_PIE_CHART',
          labels_enabled: true,
          plot_labels: ['2nd', '1st_email_click', '1st logged'],
          title: 'Nombre de user par type de profil matching (30j)',
          show_legend: false,
          query_ids: ['29529', '29532', '29531'],
        },
      },
      {
        layout: { h: 3, static: false, w: 6, x: 0, y: 4 },
        component: {
          id: 5,
          component_type: 'COUNT_PIE_CHART',
          labels_enabled: true,
          plot_labels: [
            'Page View',
            'Basket View',
            'Purchase',
            'Search',
            'Email Click',
          ],
          title: "Nombre d'évènements web par typologie (30j)",
          show_legend: false,
          query_ids: ['29527', '29528', '29530', '29533', '29534'],
        },
      },
      {
        layout: { h: 3, static: false, w: 6, x: 6, y: 4 },
        component: {
          id: 5,
          component_type: 'COUNT_PIE_CHART',
          labels_enabled: true,
          plot_labels: [
            'Contact CRM avec activités',
            'Contact CRM sans activités',
          ],
          title: 'Activité web des contacts CRM ',
          show_legend: false,
          query_ids: ['29535', '29537'],
        },
      },
      {
        layout: { h: 3, static: false, w: 12, x: 0, y: 7 },
        component: {
          id: 5,
          component_type: 'DATE_AGGREGATION_CHART',
          plot_labels: ['email clicks', 'basket view', 'purchase', 'search'],
          title: "Nombre d'évènements web par jour par typologie (30j)",
          labels_enabled: true,
          format: 'YYYY/MM/DD',
          query_ids: ['29536', '29538', '29539', '29542'],
        },
      },
      {
        layout: { h: 3, static: false, w: 12, x: 0, y: 10 },
        component: {
          id: 5,
          component_type: 'DATE_AGGREGATION_CHART',
          plot_labels: ['1st', '2nd'],
          title: 'Nombre de visites par jour par type de profil matching (30j)',
          labels_enabled: true,
          format: 'YYYY/MM/DD',
          query_ids: [
            "29572",
            "29574"
          ]
        },
      },
      {
        layout: { h: 3, static: false, w: 12, x: 0, y: 13 },
        component: {
          id: 5,
          component_type: 'DATE_AGGREGATION_CHART',
          plot_labels: ['tickets'],
          title: 'Nombre de tickets réalisés par les contacts CRM',
          labels_enabled: true,
          format: 'YYYY/MM/DD',
          query_ids: ['29541'],
        },
      },
    ],
    datamart_id: '1287',
  },
  {
    "id": "1",
    "name": "Home",
    "type": "HOME",
    "components": [
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 0,
          "y": 0
        },
        "component": {
          "id": 1,
          "component_type": "PERCENTAGE",
          "title": "Pourcentage de visites reconnues (30j)",
          "query_id": "29690",
          "total_query_id": "29688"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 3,
          "y": 0
        },
        "component": {
          "id": 2,
          "component_type": "COUNT",
          "title": "Nombre de tickets global",
          "query_id": "29696"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 6,
          "y": 0
        },
        "component": {
          "id": 3,
          "component_type": "COUNT",
          "title": "Nombre de contacts CRM",
          "query_id": "29691"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 9,
          "y": 0
        },
        "component": {
          "id": 4,
          "component_type": "COUNT",
          "title": "Nombre de userpoints web",
          "query_id": "29692"
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 0,
          "y": 1
        },
        "component": {
          "id": 5,
          "component_type": "MAP_PIE_CHART",
          "title": "Répartition des visites par type de profil matching (30j)",
          "show_legend": true,
          "query_id": "29689"
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 6,
          "y": 1
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "2nd",
            "1st_email_click",
            "1st logged"
          ],
          "title": "Nombre de user par type de profil matching (30j)",
          "show_legend": false,
          "query_ids": [
            "29695",
            "29700",
            "29694"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 0,
          "y": 4
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "Page View",
            "Basket View",
            "Purchase",
            "Search",
            "Email Click"
          ],
          "title": "Nombre d'évènements web par typologie (30j)",
          "show_legend": false,
          "query_ids": [
            "29697",
            "29693",
            "29702",
            "29699",
            "29698"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 6,
          "y": 4
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "Contact CRM avec activités",
            "Contact CRM sans activités"
          ],
          "title": "Activité web des contacts CRM ",
          "show_legend": false,
          "query_ids": [
            "29701",
            "29703"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 7
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "email clicks",
            "basket view",
            "purchase",
            "search"
          ],
          "title": "Nombre d'évènements web par jour par typologie (30j)",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29706",
            "29705",
            "29704",
            "29707"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 10
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "1st",
            "2nd"
          ],
          "title": "Nombre de visites par jour par type de profil matching (30j)",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29709",
            "29708"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 13
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "tickets"
          ],
          "title": "Nombre de tickets réalisés par les contacts CRM",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29710"
          ]
        }
      }
    ],
    "datamart_id": "1277"
  },
  {
    "id": "1",
    "name": "Home",
    "type": "HOME",
    "components": [
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 0,
          "y": 0
        },
        "component": {
          "id": 1,
          "component_type": "PERCENTAGE",
          "title": "Pourcentage de visites reconnues (30j)",
          "query_id": "29714",
          "total_query_id": "29712"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 3,
          "y": 0
        },
        "component": {
          "id": 2,
          "component_type": "COUNT",
          "title": "Nombre de tickets global",
          "query_id": "29713"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 6,
          "y": 0
        },
        "component": {
          "id": 3,
          "component_type": "COUNT",
          "title": "Nombre de contacts CRM",
          "query_id": "29715"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 9,
          "y": 0
        },
        "component": {
          "id": 4,
          "component_type": "COUNT",
          "title": "Nombre de userpoints web",
          "query_id": "29716"
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 0,
          "y": 1
        },
        "component": {
          "id": 5,
          "component_type": "MAP_PIE_CHART",
          "title": "Répartition des visites par type de profil matching (30j)",
          "show_legend": true,
          "query_id": "29711"
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 6,
          "y": 1
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "2nd",
            "1st_email_click",
            "1st logged"
          ],
          "title": "Nombre de user par type de profil matching (30j)",
          "show_legend": false,
          "query_ids": [
            "29720",
            "29717",
            "29718"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 0,
          "y": 4
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "Page View",
            "Basket View",
            "Purchase",
            "Search",
            "Email Click"
          ],
          "title": "Nombre d'évènements web par typologie (30j)",
          "show_legend": false,
          "query_ids": [
            "29722",
            "29721",
            "29719",
            "29726",
            "29723"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 6,
          "y": 4
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "Contact CRM avec activités",
            "Contact CRM sans activités"
          ],
          "title": "Activité web des contacts CRM ",
          "show_legend": false,
          "query_ids": [
            "29724",
            "29728"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 7
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "email clicks",
            "basket view",
            "purchase",
            "search"
          ],
          "title": "Nombre d'évènements web par jour par typologie (30j)",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29725",
            "29727",
            "29729",
            "29731"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 10
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "1st",
            "2nd"
          ],
          "title": "Nombre de visites par jour par type de profil matching (30j)",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29732",
            "29730"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 13
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "tickets"
          ],
          "title": "Nombre de tickets réalisés par les contacts CRM",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29733"
          ]
        }
      }
    ],
    "datamart_id": "1271"
  },
  {
    "id": "1",
    "name": "Home",
    "type": "HOME",
    "components": [
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 0,
          "y": 0
        },
        "component": {
          "id": 1,
          "component_type": "PERCENTAGE",
          "title": "Pourcentage de visites reconnues (30j)",
          "query_id": "29854",
          "total_query_id": "29852"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 3,
          "y": 0
        },
        "component": {
          "id": 2,
          "component_type": "COUNT",
          "title": "Nombre de tickets global",
          "query_id": "29853"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 6,
          "y": 0
        },
        "component": {
          "id": 3,
          "component_type": "COUNT",
          "title": "Nombre de contacts CRM",
          "query_id": "29855"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 9,
          "y": 0
        },
        "component": {
          "id": 4,
          "component_type": "COUNT",
          "title": "Nombre de userpoints web",
          "query_id": "29856"
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 0,
          "y": 1
        },
        "component": {
          "id": 5,
          "component_type": "MAP_PIE_CHART",
          "title": "Répartition des visites par type de profil matching (30j)",
          "show_legend": true,
          "query_id": "29857"
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 6,
          "y": 1
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "2nd",
            "1st_email_click",
            "1st logged"
          ],
          "title": "Nombre de user par type de profil matching (30j)",
          "show_legend": false,
          "query_ids": [
            "29861",
            "29858",
            "29862"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 0,
          "y": 4
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "Page View",
            "Basket View",
            "Purchase",
            "Search",
            "Email Click"
          ],
          "title": "Nombre d'évènements web par typologie (30j)",
          "show_legend": false,
          "query_ids": [
            "29859",
            "29863",
            "29860",
            "29865",
            "29866"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 6,
          "y": 4
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "Contact CRM avec activités",
            "Contact CRM sans activités"
          ],
          "title": "Activité web des contacts CRM ",
          "show_legend": false,
          "query_ids": [
            "29864",
            "29868"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 7
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "email clicks",
            "basket view",
            "purchase",
            "search"
          ],
          "title": "Nombre d'évènements web par jour par typologie (30j)",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29867",
            "29869",
            "29870",
            "29872"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 10
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "1st",
            "2nd"
          ],
          "title": "Nombre de visites par jour par type de profil matching (30j)",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29871",
            "29873"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 13
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "tickets"
          ],
          "title": "Nombre de tickets réalisés par les contacts CRM",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29874"
          ]
        }
      }
    ],
    "datamart_id": "1296"
  },
  {
    "id": "1",
    "name": "Home",
    "type": "HOME",
    "components": [
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 0,
          "y": 0
        },
        "component": {
          "id": 1,
          "component_type": "PERCENTAGE",
          "title": "Pourcentage de visites reconnues (30j)",
          "query_id": "29759",
          "total_query_id": "29763"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 3,
          "y": 0
        },
        "component": {
          "id": 2,
          "component_type": "COUNT",
          "title": "Nombre de tickets global",
          "query_id": "29758"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 6,
          "y": 0
        },
        "component": {
          "id": 3,
          "component_type": "COUNT",
          "title": "Nombre de contacts CRM",
          "query_id": "29761"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 9,
          "y": 0
        },
        "component": {
          "id": 4,
          "component_type": "COUNT",
          "title": "Nombre de userpoints web",
          "query_id": "29760"
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 0,
          "y": 1
        },
        "component": {
          "id": 5,
          "component_type": "MAP_PIE_CHART",
          "title": "Répartition des visites par type de profil matching (30j)",
          "show_legend": true,
          "query_id": "29762"
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 6,
          "y": 1
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "2nd",
            "1st_email_click",
            "1st logged"
          ],
          "title": "Nombre de user par type de profil matching (30j)",
          "show_legend": false,
          "query_ids": [
            "29764",
            "29766",
            "29767"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 0,
          "y": 4
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "Page View",
            "Basket View",
            "Purchase",
            "Search",
            "Email Click"
          ],
          "title": "Nombre d'évènements web par typologie (30j)",
          "show_legend": false,
          "query_ids": [
            "29765",
            "29770",
            "29769",
            "29768",
            "29771"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 6,
          "y": 4
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "Contact CRM avec activités",
            "Contact CRM sans activités"
          ],
          "title": "Activité web des contacts CRM ",
          "show_legend": false,
          "query_ids": [
            "29772",
            "29773"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 7
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "email clicks",
            "basket view",
            "purchase",
            "search"
          ],
          "title": "Nombre d'évènements web par jour par typologie (30j)",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29778",
            "29774",
            "29775",
            "29776"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 10
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "1st",
            "2nd"
          ],
          "title": "Nombre de visites par jour par type de profil matching (30j)",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29779",
            "29777"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 13
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "tickets"
          ],
          "title": "Nombre de tickets réalisés par les contacts CRM",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29780"
          ]
        }
      }
    ],
    "datamart_id": "1291"
  },
  {
    "id": "1",
    "name": "Home",
    "type": "HOME",
    "components": [
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 0,
          "y": 0
        },
        "component": {
          "id": 1,
          "component_type": "PERCENTAGE",
          "title": "Pourcentage de visites reconnues (30j)",
          "query_id": "29782",
          "total_query_id": "29785"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 3,
          "y": 0
        },
        "component": {
          "id": 2,
          "component_type": "COUNT",
          "title": "Nombre de tickets global",
          "query_id": "29784"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 6,
          "y": 0
        },
        "component": {
          "id": 3,
          "component_type": "COUNT",
          "title": "Nombre de contacts CRM",
          "query_id": "29783"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 9,
          "y": 0
        },
        "component": {
          "id": 4,
          "component_type": "COUNT",
          "title": "Nombre de userpoints web",
          "query_id": "29787"
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 0,
          "y": 1
        },
        "component": {
          "id": 5,
          "component_type": "MAP_PIE_CHART",
          "title": "Répartition des visites par type de profil matching (30j)",
          "show_legend": true,
          "query_id": "29786"
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 6,
          "y": 1
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "2nd",
            "1st_email_click",
            "1st logged"
          ],
          "title": "Nombre de user par type de profil matching (30j)",
          "show_legend": false,
          "query_ids": [
            "29788",
            "29792",
            "29790"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 0,
          "y": 4
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "Page View",
            "Basket View",
            "Purchase",
            "Search",
            "Email Click"
          ],
          "title": "Nombre d'évènements web par typologie (30j)",
          "show_legend": false,
          "query_ids": [
            "29789",
            "29791",
            "29793",
            "29796",
            "29797"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 6,
          "y": 4
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "Contact CRM avec activités",
            "Contact CRM sans activités"
          ],
          "title": "Activité web des contacts CRM ",
          "show_legend": false,
          "query_ids": [
            "29795",
            "29794"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 7
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "email clicks",
            "basket view",
            "purchase",
            "search"
          ],
          "title": "Nombre d'évènements web par jour par typologie (30j)",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29799",
            "29798",
            "29800",
            "29804"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 10
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "1st",
            "2nd"
          ],
          "title": "Nombre de visites par jour par type de profil matching (30j)",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29801",
            "29803"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 13
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "tickets"
          ],
          "title": "Nombre de tickets réalisés par les contacts CRM",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29802"
          ]
        }
      }
    ],
    "datamart_id": "1300"
  },
  {
    "id": "1",
    "name": "Home",
    "type": "HOME",
    "components": [
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 0,
          "y": 0
        },
        "component": {
          "id": 1,
          "component_type": "PERCENTAGE",
          "title": "Pourcentage de visites reconnues (30j)",
          "query_id": "29807",
          "total_query_id": "29805"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 3,
          "y": 0
        },
        "component": {
          "id": 2,
          "component_type": "COUNT",
          "title": "Nombre de tickets global",
          "query_id": "29809"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 6,
          "y": 0
        },
        "component": {
          "id": 3,
          "component_type": "COUNT",
          "title": "Nombre de contacts CRM",
          "query_id": "29810"
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 9,
          "y": 0
        },
        "component": {
          "id": 4,
          "component_type": "COUNT",
          "title": "Nombre de userpoints web",
          "query_id": "29808"
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 0,
          "y": 1
        },
        "component": {
          "id": 5,
          "component_type": "MAP_PIE_CHART",
          "title": "Répartition des visites par type de profil matching (30j)",
          "show_legend": true,
          "query_id": "29806"
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 6,
          "y": 1
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "2nd",
            "1st_email_click",
            "1st logged"
          ],
          "title": "Nombre de user par type de profil matching (30j)",
          "show_legend": false,
          "query_ids": [
            "29813",
            "29816",
            "29814"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 0,
          "y": 4
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "Page View",
            "Basket View",
            "Purchase",
            "Search",
            "Email Click"
          ],
          "title": "Nombre d'évènements web par typologie (30j)",
          "show_legend": false,
          "query_ids": [
            "29811",
            "29812",
            "29815",
            "29818",
            "29821"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 6,
          "y": 4
        },
        "component": {
          "id": 5,
          "component_type": "COUNT_PIE_CHART",
          "labels_enabled": true,
          "plot_labels": [
            "Contact CRM avec activités",
            "Contact CRM sans activités"
          ],
          "title": "Activité web des contacts CRM ",
          "show_legend": false,
          "query_ids": [
            "29817",
            "29820"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 7
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "email clicks",
            "basket view",
            "purchase",
            "search"
          ],
          "title": "Nombre d'évènements web par jour par typologie (30j)",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29819",
            "29822",
            "29823",
            "29825"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 10
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "1st",
            "2nd"
          ],
          "title": "Nombre de visites par jour par type de profil matching (30j)",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29824",
            "29826"
          ]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 12,
          "x": 0,
          "y": 13
        },
        "component": {
          "id": 5,
          "component_type": "DATE_AGGREGATION_CHART",
          "plot_labels": [
            "tickets"
          ],
          "title": "Nombre de tickets réalisés par les contacts CRM",
          "labels_enabled": true,
          "format": "YYYY/MM/DD",
          "query_ids": [
            "29827"
          ]
        }
      }
    ],
    "datamart_id": "1299"
  },
  {
    "id": "1",
    "name": "Home",
    "type": "HOME",
    "datamart_id": "1409",
    "components": [
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 0,
          "y": 0
        },
        "component": {
          "id": 1,
          "component_type": "COUNT",
          "title": "# of UserPoints",
          "query_id": "30905",
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 3,
          "y": 0
        },
        "component": {
          "id": 1,
          "component_type": "COUNT",
          "title": "# of Page Views (30d)",
          "query_id": "30906",
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 6,
          "y": 0
        },
        "component": {
          "id": 1,
          "component_type": "COUNT",
          "title": "# of Sessions (30d)",
          "query_id": "30907",
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 9,
          "y": 0
        },
        "component": {
          "id": 1,
          "component_type": "COUNT",
          "title": "# of Logged In Users (30d)",
          "query_id": "30915",
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 0,
          "y": 1
        },
        "component": {
          "id": 1,
          "component_type": "DATE_AGGREGATION_CHART",
          "title": "Active UserPoint Per Day (30d)",
          "plot_labels": ["Non Identified UserPoints", "Identified UserPoints"],
          "query_ids": ["30926","30927"]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 6,
          "y": 1
        },
        "component": {
          "id": 1,
          "component_type": "MAP_PIE_CHART",
          "title": "Declarative Gender Repartition",
          "query_id": "30930",
          "show_legend": true
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 4,
          "x": 0,
          "y": 4
        },
        "component": {
          "id": 1,
          "component_type": "MAP_PIE_CHART",
          "title": "Interests",
          "query_id": "30932",
          "show_legend": true
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 4,
          "x": 4,
          "y": 4
        },
        "component": {
          "id": 1,
          "component_type": "COUNT_BAR_CHART",
          "title": "Age Repartition",
          "query_ids": ["30942","30941","30940","30939","30938"],
          "labels_enabled": true,
          "show_legend": false,
          "plot_labels": ["18-25", "25-35", "35-45", "45-55", "55+"]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 4,
          "x": 8,
          "y": 4
        },
        "component": {
          "id": 1,
          "component_type": "MAP_PIE_CHART",
          "title": "Sections Viewed",
          "query_id": "30943",
          "show_legend": true
        }
      },
    ],
  },
  {
    "id": "1",
    "name": "Insights",
    "type": "SEGMENT",
    "datamart_id": "1409",
    "components": [
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 0,
          "y": 0
        },
        "component": {
          "id": 1,
          "component_type": "COUNT",
          "title": "# of UserPoints",
          "query_id": "30905",
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 3,
          "y": 0
        },
        "component": {
          "id": 1,
          "component_type": "COUNT",
          "title": "# of Page Views (30d)",
          "query_id": "30906",
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 6,
          "y": 0
        },
        "component": {
          "id": 1,
          "component_type": "COUNT",
          "title": "# of Sessions (30d)",
          "query_id": "30907",
        }
      },
      {
        "layout": {
          "h": 1,
          "static": false,
          "w": 3,
          "x": 9,
          "y": 0
        },
        "component": {
          "id": 1,
          "component_type": "COUNT",
          "title": "# of Logged In Users (30d)",
          "query_id": "30915",
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 0,
          "y": 1
        },
        "component": {
          "id": 1,
          "component_type": "DATE_AGGREGATION_CHART",
          "title": "Active UserPoint Per Day (30d)",
          "plot_labels": ["Non Identified UserPoints", "Identified UserPoints"],
          "query_ids": ["30926","30927"]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 6,
          "x": 6,
          "y": 1
        },
        "component": {
          "id": 1,
          "component_type": "MAP_PIE_CHART",
          "title": "Declarative Gender Repartition",
          "query_id": "30930",
          "show_legend": true
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 4,
          "x": 0,
          "y": 4
        },
        "component": {
          "id": 1,
          "component_type": "MAP_PIE_CHART",
          "title": "Interests",
          "query_id": "30932",
          "show_legend": true
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 4,
          "x": 4,
          "y": 4
        },
        "component": {
          "id": 1,
          "component_type": "COUNT_BAR_CHART",
          "title": "Age Repartition",
          "query_ids": ["30942","30941","30940","30939","30938"],
          "labels_enabled": true,
          "show_legend": false,
          "plot_labels": ["18-25", "25-35", "35-45", "45-55", "55+"]
        }
      },
      {
        "layout": {
          "h": 3,
          "static": false,
          "w": 4,
          "x": 8,
          "y": 4
        },
        "component": {
          "id": 1,
          "component_type": "MAP_PIE_CHART",
          "title": "Sections Viewed",
          "query_id": "30943",
          "show_legend": true
        }
      },
    ],
  }
];
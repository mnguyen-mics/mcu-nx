import { injectable } from 'inversify';
import { DashboardScope } from '../models/dashboards/dashboardsModel';

export interface DataLayerDefinition {
  [key: string]: any;
}
export interface Mics {
  init: (siteToken: string) => void;
  push: (eventName: string, properties: any) => void;
  addProperty: (propertyType: string, property: any) => void;
}

export interface MicsWindow extends Window {
  mics: Mics;
}

export interface ITagService {
  pushPageView: (datalayer?: DataLayerDefinition) => void;
  pushDashboardView: (
    scope: DashboardScope,
    id: string,
    title: string,
    numberCharts: number,
    otqlQueries: number,
    activitiesAnalyticsQueries: number,
    collectionVolumesQueries: number,
    resourcesUsageQueries: number,
    datafileQueries: number,
  ) => void;
  pushEvent: (nature: string, scope: string) => void;
  addUserAccountProperty: (userAccountId: string) => void;
  setUserProperties: (user: { id: string }) => void;
}

@injectable()
export class TagService implements ITagService {
  pushPageView = (datalayer?: DataLayerDefinition): void => {
    if ((window as any).mics && (window as any).mics.push) {
      (window as any).mics.push('PageView', datalayer ? datalayer : {});
    }
  };

  pushDashboardView = (
    scope: DashboardScope,
    id: string,
    title: string,
    numberCharts: number,
    otqlQueries: number,
    activitiesAnalyticsQueries: number,
    collectionVolumesQueries: number,
    resourcesUsageQueries: number,
    datafileQueries: number,
  ): void => {
    if ((window as any).mics && (window as any).mics.push) {
      (window as any).mics.push('DashboardView', {
        scope: scope,
        id: id,
        title: title,
        number_charts: numberCharts,
        otql_queries: otqlQueries,
        activities_analytics_queries: activitiesAnalyticsQueries,
        collection_volumes_queries: collectionVolumesQueries,
        resources_usage_queries: resourcesUsageQueries,
        datafile_queries: datafileQueries,
      });
    }
  };

  pushEvent = (nature: string, scope: string): void => {
    if ((window as any).mics && (window as any).mics.push) {
      (window as any).mics.push(nature, { scope: scope.toLowerCase() });
    }
  };

  addUserAccountProperty = (userAccountId: string): void => {
    if ((window as any).mics && (window as any).mics.addProperty) {
      (window as any).mics.addProperty('$user_account_id', userAccountId);
    }
  };

  setUserProperties = (user: {
    id: string;
    first_name: string;
    last_name: string;
    default_workspace: number;
    workspaces: Array<{ organisation_id: string; organisation_name: string }>;
  }): void => {
    if ((window as any).mics && (window as any).mics.push) {
      const userProfile = {
        first_name: user.first_name,
        last_name: user.last_name,
        display_name: `${user.first_name} ${user.last_name}`,
        organisation: {
          organisation_id: user.workspaces[user.default_workspace].organisation_id,
          organisation_name: user.workspaces[user.default_workspace].organisation_name,
        },
      };
      (window as any).mics.push('$set_user_profile_properties', userProfile);
    }
  };
}

import { ThemeColorsShape } from './ThemeColors';
import { Notification } from '../components/notifications/Notifications';
import {
  UserProfileResource,
  UserWorkspaceResource,
} from '../models/directory/UserProfileResource';
import { Cookies } from '../models/user/user';
import { Label } from '../models/labels/labels';
import { DrawableContent } from '../components/drawer/types';

export type MicsReduxState = {
  form: {
    [key: string]: any; // find a way to type all forms
  };
  app: {
    initialized: boolean;
    initializationError: boolean;
  };
  theme: {
    colors: ThemeColorsShape;
  };
  features: {
    organisation: string[];
    client: string;
  };
  notifications: Notification[];
  login: {
    hasError: boolean;
    error: any; // ?
  };
  session: {
    workspace: UserWorkspaceResource;
    connectedUser: UserProfileResource;
    cookies: Cookies;
    connectedUserLoaded: boolean;
    isFechingCookies: boolean;
    isFetchingWorkspace: boolean;
    isUploadingLogo: boolean;
    logoUrl: string;
  };
  labels: {
    labelsApi: {
      isFetching: boolean;
      data: Label[];
      total: number;
      status: string;
      count: number;
      first_result: number;
      max_result: number;
      max_results: number;
    };
  };
  menu: {
    collapsed: boolean;
    mode: string;
  };
  DrawableContents: DrawableContent[];
  keycloakPostLogin: {
    isFetching: boolean;
    hasFailed: boolean;
    done: boolean;
  };
};

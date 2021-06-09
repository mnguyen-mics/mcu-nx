import { Action } from 'redux-actions';
import {
  UserWorkspaceResource,
  UserProfileResource,
} from '../models/directory/UserProfileResource';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';
const EXPIRED_PASSWORD = 'EXPIRED_PASSWORD';

export interface CreateRequestType {
  REQUEST: string;
  SUCCESS: string;
  FAILURE: string;
  EXPIRED_PASSWORD: string;
}

export type MicsReduxState = {
  app: {
    initialized: boolean;
    initializationError: boolean;
  };
  login: {
    hasError: boolean;
    error: any; // ?
  };
  features: {
    organisation: string[];
    client: string;
  };
  session: {
    workspace: UserWorkspaceResource;
    connectedUser: UserProfileResource;
    connectedUserLoaded: boolean;
    isFechingCookies: boolean;
    isFetchingWorkspace: boolean;
    isUploadingLogo: boolean;
    logoUrl: string;
  };
}

export type Payload = { [key: string]: any };

type RequestType = (base: string) => CreateRequestType;

export const createRequestTypes: RequestType = (base: string) => {
  return [REQUEST, SUCCESS, FAILURE, EXPIRED_PASSWORD].reduce(
    (acc, type) => ({
      ...acc,
      [type]: `${base}_${type}`,
    }),
    {
      REQUEST: '',
      SUCCESS: '',
      FAILURE: '',
      EXPIRED_PASSWORD: '',
    },
  );
};

const defaultMetadata = {
  isFetching: false,
  error: false,
  total: 0,
};

export const createRequestMetadataReducer = (
  requestTypes: CreateRequestType,
) => (state = defaultMetadata, action: Action<Payload>) => {
  switch (action.type) {
    case requestTypes.REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case requestTypes.SUCCESS:
      return {
        ...state,
        isFetching: false,
        total: action.payload.total,
      };
    case requestTypes.FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    case requestTypes.EXPIRED_PASSWORD:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

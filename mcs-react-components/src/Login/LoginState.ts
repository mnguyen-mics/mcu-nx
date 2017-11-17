import {Action} from 'redux-actions';

import {
  UserProfileResource,
  ErrorResponse
} from 'mcs-services/lib/MicsApi';

import {createAction} from 'redux-actions';
import {createRequestTypes} from '../utils/ReduxHelper';

export const LOG_IN = createRequestTypes('LOG_IN');
export const LOG_OUT = 'LOG_OUT';
export const CONNECTED_USER = createRequestTypes('CONNECTED_USER');



export interface LoginRequestPayload {
  email: string,
  password: string,
  remember: boolean
}


export const getConnectedUser = {
    request: createAction(CONNECTED_USER.REQUEST),
    success: createAction(CONNECTED_USER.SUCCESS, (x : UserProfileResource) => x),
    failure: createAction(CONNECTED_USER.FAILURE),
};


export type AccessToken = string

export type RedirectCallback = () => void

export interface LoginRequestMeta {
  redirect: RedirectCallback
}

export const logIn = {
  request: createAction<LoginRequestPayload, LoginRequestMeta>(LOG_IN.REQUEST, x => x, (_, cb: RedirectCallback) => ({ redirect: cb })),
  success: createAction<AccessToken>(LOG_IN.SUCCESS),
  failure: createAction<Error>(LOG_IN.FAILURE),
};

export const logOut = createAction<undefined, LoginRequestMeta>(LOG_OUT, x => x, (_, cb: RedirectCallback) => ({ redirect: cb }));


export interface LoginStore {
  isRequesting: boolean,
  hasError: boolean,
  error?: ErrorResponse,
}

const defaultLoginState = {
  isRequesting: false,
  hasError: false,
};


const login = (state: LoginStore = defaultLoginState, action: Action<ErrorResponse>) => {

  switch (action.type) {

    case LOG_IN.REQUEST:
      return {
        ...state,
        isRequesting: true,
      };
    case LOG_IN.FAILURE:
      return {
        isRequesting: false,
        hasError: true,
        error: action.payload,
      };
    case LOG_IN.SUCCESS:
      return defaultLoginState;
    default:
      return state;
  }

};

export const LoginReducers = {
  login,
};



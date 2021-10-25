import {
  KEYCLOAK_POST_LOGIN,
  KEYCLOAK_POST_LOGIN_FAILURE,
  KEYCLOAK_POST_LOGIN_SUCCESS,
} from '../action-types';
import { Action } from 'redux-actions';
import { Payload } from '../ReduxHelper';

const keycloakPostLogin = (state = {}, action: Action<Payload>) => {
  switch (action.type) {
    case KEYCLOAK_POST_LOGIN:
      return {
        ...state,
        isFetching: true,
        hasFailed: false,
        done: false,
      };
    case KEYCLOAK_POST_LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        hasFailed: true,
        done: true,
      };
    case KEYCLOAK_POST_LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        hasFailed: false,
        done: true,
      };
    default:
      return state;
  }
};

const keycloakPostLoginReducer = {
  keycloakPostLogin,
};

export default keycloakPostLoginReducer;

import { createAction } from 'redux-actions';
import {
  KEYCLOAK_POST_LOGIN,
  KEYCLOAK_POST_LOGIN_FAILURE,
  KEYCLOAK_POST_LOGIN_SUCCESS,
} from '../action-types';

const KeycloakPostLogin = {
  keycloakPostLogin: createAction(KEYCLOAK_POST_LOGIN),
  keycloakPostLoginFailure: createAction(KEYCLOAK_POST_LOGIN_FAILURE),
  keycloakPostLoginSuccess: createAction(KEYCLOAK_POST_LOGIN_SUCCESS),
};

export { KeycloakPostLogin };

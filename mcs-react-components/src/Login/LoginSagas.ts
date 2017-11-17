import { delay } from 'redux-saga';
import { call, put, take, race, fork } from 'redux-saga/effects';
import * as moment from 'moment';

import log from 'mcs-services/lib/Log';
import AuthService from 'mcs-services/lib/AuthenticationStorage';
import * as api from 'mcs-services/lib/MicsApi';
import {AccessToken, CredentialsOrRefreshToken, DataResponse, RefreshToken, UserProfileResource } from 'mcs-services/lib/MicsApi';
import publicapi from 'mcs-services/lib/MicsApi';

import {
  CONNECTED_USER,
  getConnectedUser
} from './LoginState';

import {
  LOG_IN,
  LOG_OUT,
  logIn
} from './LoginState';

function* authorize(credentialsOrRefreshToken : CredentialsOrRefreshToken) {

  const response : DataResponse<AccessToken> = yield call(publicapi.createAccessToken, credentialsOrRefreshToken);
  log.debug(`authorize response = ${JSON.stringify(response)}`);
  const { access_token, expires_in, refresh_token } = response.data;
  yield call(AuthService.setAccessToken, access_token);
  const expirationDate = moment.unix(moment.now()).add(moment.duration(expires_in, 's')).unix();
  yield call(AuthService.setAccessTokenExpirationDate, expirationDate);

    // Update refresh token if API sent a new one
  if (refresh_token) {
    log.debug(`Store refresh token ${refresh_token}`);
    yield call(AuthService.setRefreshToken, refresh_token);
  }

  yield put(logIn.success(access_token));
  return response.data;
}

function* authorizeLoop(credentialsOrRefreshToken: api.Credentials, useStoredAccessToken = false, remember = false) {
  try {
    log.debug('Authorize user with credentialsOrRefreshToken');

    log.debug(`credentialsOrRefreshToken = ${JSON.stringify(credentialsOrRefreshToken)}, useStoredAccessToken = ${useStoredAccessToken}, remember =${remember}`);

    let refreshToken : string | undefined | null = null;
    let expiresIn : number = 0;
    if (useStoredAccessToken) {
      const expirationDate = yield call(AuthService.getAccessTokenExpirationDate);
      expiresIn = expirationDate.diff(moment.now(), 'seconds');
      refreshToken = yield call(AuthService.getRefreshToken);
    } else if (remember) {
      const response: DataResponse<RefreshToken> = yield call(publicapi.createRefreshToken, credentialsOrRefreshToken);
      const result: AccessToken = yield call(authorize, response.data);
      refreshToken = result.refresh_token;
      expiresIn = result.expires_in;
    } else {
      const result: AccessToken = yield call(authorize, credentialsOrRefreshToken);
      refreshToken = result.refresh_token;
      expiresIn = result.expires_in;
    }

    const connectedUser : DataResponse<UserProfileResource> = yield call(publicapi.getConnectedUser);
    yield put(getConnectedUser.success(connectedUser.data));

    if (!refreshToken) {
    // Wait till access token expire
      const waitInMs = expiresIn * 1000;
      log.debug(`Will LOG_OUT in ${waitInMs} ms`);
      yield call(delay, waitInMs);
      yield put({ type: LOG_OUT});
    } else {
      while (true) {
        // check expirein variable
        const waitInMs = (expiresIn * 1000) - (60 * 1000);
        log.debug(`Will refresh access token in ${waitInMs} ms`);
        yield call(delay, waitInMs);
        const storedRefreshToken = yield call(AuthService.getRefreshToken);
        log.debug(`Authorize user with refresh token ${storedRefreshToken}`);
        yield call(authorize, { refresh_token: storedRefreshToken });
      }
    }
  } catch (e) {
    log.error('Authorize error : ', e);
    yield call(AuthService.deleteCredentials);
    yield put(logIn.failure(e));
  }
}

function* authentication() {
  while (true) {
    const storedRefreshToken = yield call(AuthService.getRefreshToken);
    const isAuthenticated = yield call(AuthService.isAuthenticated);

    let credentialsOrRefreshToken = null;
    let remember = false;

    // TODO check non expired storedRefreshToken
    if (!storedRefreshToken && !isAuthenticated) {

      // Wait for LOG_IN.REQUEST
      const { payload } = yield take(LOG_IN.REQUEST);

      if (payload.remember) {
        remember = true;
      }

      credentialsOrRefreshToken = {
        email: payload.email,
        password: payload.password,
      };
    } else {
      credentialsOrRefreshToken = {
        refreshToken: storedRefreshToken,
      };
    }

    const { signOutAction } = yield race({
      signOutAction: take(LOG_OUT),
      authorizeLoop: call(authorizeLoop, credentialsOrRefreshToken, isAuthenticated, remember),
    });

    if (signOutAction) {
      yield call(AuthService.deleteCredentials);
      if (signOutAction.meta && signOutAction.meta.redirectCb) {
        signOutAction.meta.redirectCb();
      }
    }

  }
}

function* redirectAfterLogin() {
  while (true) {
    const { meta: { redirect } } = yield take(LOG_IN.REQUEST);
    yield take(CONNECTED_USER.SUCCESS);
    redirect();
  }
}

export const loginSagas = [
  fork(redirectAfterLogin),
  fork(authentication),
];

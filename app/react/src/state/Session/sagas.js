import { takeEvery } from 'redux-saga';
import { call, put, fork } from 'redux-saga/effects';

import { addNotification } from '../Notifications/actions';
import log from '../../utils/Logger';
import OrganisationService from '../../services/OrganisationService';

import {
  WORKSPACE,
  GET_LOGO,
  PUT_LOGO
} from '../action-types';

import {
  getWorkspace,
  putLogo,
  getLogo
} from './actions';

function* fetchOrganisationWorkspace({ payload }) {
  try {
    const organisationId = payload;
    const response = yield call(OrganisationService.getWorkspace, organisationId);
    yield put(getWorkspace.success(response));
  } catch (e) {
    log.error(e);
    yield put(getWorkspace.failure(e));
  }
}

function* downloadLogo({ payload }) {
  try {
    const {
      organisationId,
      updateLogo
    } = payload;
    const response = yield call(OrganisationService.getLogo, organisationId);
    const logoUrl = URL.createObjectURL(response);
    yield put(getLogo.success({ logoUrl }));
  } catch (e) {
    log.error('Error while getting logo: ', e);
    yield put(addNotification({
          type: 'error',
          messageKey: 'NOTIFICATION_ERROR_TITLE',
          descriptionKey: 'NOTIFICATION_ERROR_DESCRIPTION'
      }));
  }
}

function* uploadLogo({ payload }) {
  try {
    const {
      organisationId,
      file,
      updateLogo
    } = payload;
    
    const formData = new FormData();
    formData.append('file', file);
    yield call(OrganisationService.putLogo, organisationId, formData);
    yield put(putLogo.success());
    yield put(getLogo.request({organisationId}));

  } catch (e) {
    log.error('Error while putting logo: ', e);
    yield put(addNotification({
          type: 'error',
          messageKey: 'NOTIFICATION_ERROR_TITLE',
          descriptionKey: 'NOTIFICATION_ERROR_DESCRIPTION'
      }));
  }
}

function* watchWorkspaceRequest() {
  yield* takeEvery(WORKSPACE.REQUEST, fetchOrganisationWorkspace);
}

function* watchLogoDownloadRequest() {
  yield* takeEvery(GET_LOGO.REQUEST, downloadLogo);
}

function* watchLogoUploadRequest() {
  yield* takeEvery(PUT_LOGO.REQUEST, uploadLogo);
}

export const sessionSagas = [
  fork(watchWorkspaceRequest),
  fork(watchLogoDownloadRequest),
  fork(watchLogoUploadRequest)
];

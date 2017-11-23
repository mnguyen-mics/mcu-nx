import { takeEvery } from 'redux-saga';
import { Action } from 'redux-actions';
import { call, fork, put, ForkEffect } from 'redux-saga/effects';

import log from 'mcs-services/lib/Log';
import publicapi from 'mcs-services/lib/MicsApi';

import {
  sendPassword,
  PASSWORD_FORGOT,
  ForgotPasswordRequestPayload
} from './ForgotPasswordState';


function* sendPasswordLoop(action: Action<ForgotPasswordRequestPayload>) {

  try {

    if (!action.payload) throw new Error('Payload is invalid :\'(');

    const { payload } = action;
  
    const response = yield call(publicapi.sendPasswordReset, payload);
    yield put(sendPassword.success(response));

  } catch (error) {
    log.error(error);
    yield put(sendPassword.failure(error));
  }
}

function* watchSendPasswordLoop() {
  yield* takeEvery(PASSWORD_FORGOT.REQUEST, sendPasswordLoop);
}

export const forgotPasswordSagas: ForkEffect[] = [
  fork(watchSendPasswordLoop),
];

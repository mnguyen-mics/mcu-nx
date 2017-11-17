import { takeEvery } from 'redux-saga';
import { call, fork, put } from 'redux-saga/effects';

import log from 'mcs-services/lib/Log';
import api from 'mcs-services/lib/MicsApi';

import {
  sendPassword,
  PASSWORD_FORGOT,
} from './ForgotPasswordState';


function* sendPasswordLoop({ payload }) {

  try {
    const {
      email,
    } = payload;

    if (!email) throw new Error('Payload is invalid :\'(');

    const response = yield call(api.sendPasswordReset(), email);
    yield put(sendPassword.success(response));

  } catch (error) {
    log.error(error);
    yield put(sendPassword.failure(error));
  }
}

function* watchSendPasswordLoop() {
  yield* takeEvery(PASSWORD_FORGOT.REQUEST, sendPasswordLoop);
}

export const forgotPasswordSagas = [
  fork(watchSendPasswordLoop),
];

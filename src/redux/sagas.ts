import 'regenerator-runtime/runtime';
import { all } from 'redux-saga/effects';
import { loginSagas } from './Login/sagas';

export default function* sagas() {
  yield all([
    ...loginSagas,
  ]);
}

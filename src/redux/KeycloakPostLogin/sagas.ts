/* eslint-disable no-constant-condition */
/* eslint-disable camelcase */
import KeycloakService from '../../services/KeycloakService';
import 'regenerator-runtime/runtime';
import { getContext, call, put, fork, select, takeLatest } from 'redux-saga/effects';
import { SplitFactory } from '@splitsoftware/splitio';
import log from '../../utils/Logger';
import { KEYCLOAK_POST_LOGIN } from '../action-types';
import { getConnectedUser } from '../Session/actions';
import { setOrgFeature, setClientFeature } from '../Features/actions';
import { getStoredConnectedUser } from '../Session/selectors';
import { UserProfileResource } from '../../models/directory/UserProfileResource';
import { KeycloakPostLogin } from './actions';

function* keycloakPostLoginHandler() {
  const _authService = yield getContext('authService');
  const _tagService = yield getContext('tagService');
  try {
    let connectedUser: UserProfileResource | undefined;

    const connectedUserStored = yield select(getStoredConnectedUser);
    if (connectedUserStored && connectedUserStored.id) {
      connectedUser = connectedUserStored;
    } else if (KeycloakService.isLoggedIn()) {
      connectedUser = yield call(_authService.getConnectedUser);
    }

    if (connectedUser) {
      const filteredConnectedUser = {
        ...connectedUser,
        workspaces: connectedUser.workspaces.map(w => {
          if (w.datamarts && w.datamarts.length) {
            w.datamarts.forEach(d => {
              const formatted = d;
              if (d.audience_segment_metrics && d.audience_segment_metrics.length) {
                formatted.audience_segment_metrics = d.audience_segment_metrics.filter(
                  a => a.status === 'LIVE',
                );
              }
              return formatted;
            });
          }
          return w;
        }),
      };

      yield put(setOrgFeature((global as any).window.MCS_CONSTANTS.FEATURES));

      const clientPromise = () =>
        new Promise((resolve, reject) => {
          const factory = SplitFactory({
            core: {
              authorizationKey: '9o6sgmo2fbk275ao4cugtnd9ch6sb3fstv1d',
              key: connectedUser!.id,
              trafficType: 'user',
            },
          });
          const client = factory.client();
          client.on(client.Event.SDK_READY, () => {
            return resolve(client);
          });
          client.on(client.Event.SDK_READY_TIMED_OUT, () => {
            return resolve(null);
          });
        });

      const clientAction = yield call(clientPromise);
      yield put(setClientFeature(clientAction));
      _tagService?.addUserAccountProperty(connectedUser.id);
      _tagService?.setUserProperties(filteredConnectedUser);

      yield put(getConnectedUser.success(filteredConnectedUser));
      // Set the global variable userId for Google Analytics
      // This variable is used in index.html
      (window as any).userId = connectedUser.id;
      (window as any).organisationId =
        connectedUser.workspaces[connectedUser.default_workspace].organisation_id; // eslint-disable-line no-undef
    }

    yield put(KeycloakPostLogin.keycloakPostLoginSuccess());
  } catch (e) {
    log.error('Authorize error : ', e);
    yield put(KeycloakPostLogin.keycloakPostLoginFailure());
  }
}

function* keycloakPostLoginWatcher() {
  yield takeLatest(KEYCLOAK_POST_LOGIN, keycloakPostLoginHandler);
}

const keycloakPostLoginSagas = [fork(keycloakPostLoginWatcher)];
export default keycloakPostLoginSagas;

import Keycloak from 'keycloak-js';

const _keycloak = Keycloak('/keycloak.json');

const initKeycloak = (onAuthenticatedCallback: any) => {
  _keycloak
    .init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256',
    })
    .then((authenticated: boolean) => {
      if (authenticated) {
        onAuthenticatedCallback();
      } else {
        doLogin();
      }
    });
};

const getClientId = () => _keycloak.clientId;

const doLogin = _keycloak.login;

const doLogout = _keycloak.logout;

const getToken = () => _keycloak.token;

const isLoggedIn = () => !!_keycloak.token;

const updateToken = (successCallback: any) =>
  _keycloak
    .updateToken(10)
    .catch(doLogin)
    .then(refreshed => {
      return successCallback();
    });

const isKeycloakEnabled = (): boolean => {
  return !!(global as any).window.MCS_CONSTANTS?.ENABLE_KEYCLOAK;
};

const KeycloakService = {
  initKeycloak,
  getClientId,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  isKeycloakEnabled,
};

export default KeycloakService;

import Keycloak from 'keycloak-js';

const _keycloak = Keycloak('/keycloak.json');

const initKeycloak = (onAuthenticatedCallback: any) => {
  _keycloak
    .init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    })
    .then((authenticated: boolean) => {
      if (authenticated) {
        onAuthenticatedCallback();
      } else {
        doLogin();
      }
    });
};

const doLogin = _keycloak.login;

const doLogout = _keycloak.logout;

const getToken = () => _keycloak.token;

const isLoggedIn = () => !!_keycloak.token;

const updateToken = (successCallback: any) =>
  _keycloak.updateToken(5).then(successCallback).catch(doLogin);

const hasRole = (roles: string[]) => roles.some(role => _keycloak.hasRealmRole(role));

const KeycloakService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  hasRole,
};

export default KeycloakService;

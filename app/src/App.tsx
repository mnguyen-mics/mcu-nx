import React from 'react';
import './styles/index.less';
import { HashRouter as Router } from 'react-router-dom';
import Main from './containers/Main/Main';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { KeycloakService, Store } from '@mediarithmics-private/advanced-components';
import MainUsingKeycloak from './containers/main/MainUsingKeycloak';
const store = Store();

function App() {
  const usedMain = KeycloakService.isKeycloakEnabled() ? <MainUsingKeycloak /> : <Main />;

  return (
    <Provider store={store}>
      <IntlProvider locale='en'>
        <Router>{usedMain}</Router>
      </IntlProvider>
    </Provider>
  );
}

export default App;

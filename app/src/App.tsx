import React from 'react';
import './styles/index.less';
import { HashRouter as Router } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { Store } from '@mediarithmics-private/advanced-components';
import MainUsingKeycloak from './containers/main/MainUsingKeycloak';
const store = Store();

function App() {
  return (
    <IntlProvider locale='en'>
      <ReduxProvider store={store}>
        <Router>
          <MainUsingKeycloak />
        </Router>
      </ReduxProvider>
    </IntlProvider>
  );
}

export default App;

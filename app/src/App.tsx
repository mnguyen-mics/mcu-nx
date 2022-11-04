import React from 'react';
import './styles/index.less';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { Store } from '@mediarithmics-private/advanced-components';
import MainUsingKeycloak from './containers/main/MainUsingKeycloak';
const store = Store();

function App() {
  return (
    <Provider store={store}>
      <IntlProvider locale='en'>
        <Router>
          <MainUsingKeycloak />
        </Router>
      </IntlProvider>
    </Provider>
  );
}

export default App;

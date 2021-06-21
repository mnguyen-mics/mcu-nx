import React from 'react';
import './styles/index.less';
import { HashRouter as Router } from 'react-router-dom';
import Main from './containers/main/Main';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { Store } from '@mediarithmics-private/advanced-components';
const store = Store();

function App() {
  return (
    <Provider store={store}>
      <IntlProvider locale='en'>
        <Router>
          <Main />
        </Router>
      </IntlProvider>
    </Provider>
  );
}

export default App;

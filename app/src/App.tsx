import React from 'react';
import './styles/index.less';
import { HashRouter as Router } from 'react-router-dom';
import Main from './containers/main/Main';
import { Provider } from 'react-redux';
import store from './store';
import { IntlProvider } from 'react-intl';

function App() {
  return (
    <Provider store={store}>
      <IntlProvider locale="en">
        <Router>
          <Main />
        </Router>
      </IntlProvider>
    </Provider>
  );
}

export default App;

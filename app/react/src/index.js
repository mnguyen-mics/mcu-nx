/* eslint-disable */
require('babel-polyfill');
require('react-hot-loader/patch');
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './App';

render(
  <AppContainer>
      <App />
  </AppContainer>,
  document.getElementById('mcs-react-app')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(
      <AppContainer>
          <NextApp />
      </AppContainer>,
      document.getElementById('mcs-react-app')
    );
  });
}

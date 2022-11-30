import { KeycloakService } from '@mediarithmics-private/advanced-components';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('mcs-react-app'));
};

(window as any)?.MCS_CONSTANTS?.ADMIN_API_TOKEN
  ? renderApp()
  : KeycloakService.initKeycloak(renderApp);

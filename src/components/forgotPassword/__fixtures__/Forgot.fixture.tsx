import 'reflect-metadata';
import * as React from 'react';
import ForgotPassword from '../ForgotPassword';
import { IntlProvider } from 'react-intl';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { IocProvider } from '../../../inversify/inversify.react';
import { container } from "../../../inversify/inversify.config"
import configureStore from '../../../redux/store';
import config from '../../../react-configuration';
debugger
(global as any).window.MCS_CONSTANTS = config;
const store = configureStore();
export default (
  <Provider store={store}>
    <IocProvider container={container}>
      <IntlProvider locale="en">
        <Router>
          <ForgotPassword />
        </Router>
      </IntlProvider>
    </IocProvider>
  </Provider>

)
import 'reflect-metadata';
import * as React from 'react';
import ForgotPassword from '../ForgotPassword';
import { IntlProvider } from 'react-intl';
import { IocProvider } from '../../../inversify/inversify.react';
import { container } from "../../../inversify/inversify.config"
import config from '../../../react-configuration';

(global as any).window.MCS_CONSTANTS = config;
export default (

    <IocProvider container={container}>
      <IntlProvider locale="en">
          <ForgotPassword />
      </IntlProvider>
    </IocProvider>
)
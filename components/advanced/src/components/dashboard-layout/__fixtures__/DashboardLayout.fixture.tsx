import React from 'react';
import DashboardLayout, { DashboardLayoutProps } from '../DashboardLayout';
import EditableDashboardLayout from '../EditableDashboardLayout';
import { FetchMock } from '@react-mock/fetch';
import { LocalStorageMock } from '@react-mock/localstorage';
import { Provider } from 'react-redux';
import { IocProvider } from '../../..';
import configureStore from '../../../redux/store';
import { container } from '../../../inversify/inversify.config';
import {
  props,
  propsAnalytics1,
  propsAnalytics2,
  propsAnalytics3,
  propsAnalytics4,
  propsMetric,
} from '../__utils__/dashboardConfig';
import { fetchmockOptions } from '../__utils__/fetchMockOptions';
/* import { IntlProvider, WrappedComponentProps } from 'react-intl';

const store = configureStore();

const WithDrawerDashboardLayout = compose<
  DashboardLayoutProps & InjectedDrawerProps & WrappedComponentProps,
  DashboardLayoutProps
>(injectDrawer)(DashboardLayout);

import { IntlProvider} from 'react-intl';

const store = configureStore(); */

function adaptToEditable(_props: DashboardLayoutProps) {
  return {
    ..._props,
    schema: _props.schema,
    updateSchema: () => undefined,
  };
}

const commonProps = {
  organisationId: '504',
  editable: false,
  queryExecutionSource: 'AUTOMATION',
  queryExecutionSubSource: 'AUTOMATION_BUILDER',
} as DashboardLayoutProps;

export default {
  standard: (
    <Provider store={store}>
      <IocProvider container={container}>
        <IntlProvider locale='en'>
          <LocalStorageMock items={{ access_token: 're4lt0k3n' }}>
            <FetchMock mocks={fetchmockOptions}>
              <DashboardLayout {...propsMetric} {...commonProps} />
              <DashboardLayout {...props} {...commonProps} />
              <DashboardLayout {...propsAnalytics1} {...commonProps} />
              <DashboardLayout {...propsAnalytics2} {...commonProps} />
              <DashboardLayout {...propsAnalytics3} {...commonProps} />
              <DashboardLayout {...propsAnalytics4} {...commonProps} />
            </FetchMock>
          </LocalStorageMock>
        </IntlProvider>
      </IocProvider>
    </Provider>
  ),
  editable: (
    <Provider store={store}>
      <IocProvider container={container}>
        <IntlProvider locale='en'>
          <LocalStorageMock items={{ access_token: 're4lt0k3n' }}>
            <FetchMock mocks={fetchmockOptions}>
              <EditableDashboardLayout {...adaptToEditable({ ...props, ...commonProps })} />
            </FetchMock>
          </LocalStorageMock>
        </IntlProvider>
      </IocProvider>
    </Provider>
  ),
};

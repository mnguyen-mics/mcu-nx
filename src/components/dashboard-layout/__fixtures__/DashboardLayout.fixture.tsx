import React from 'react';
import DashboardLayout, { DashboardLayoutProps } from '../DashboardLayout';
import EditableDashboardLayout from '../EditableDashboardLayout';
import { FetchMock } from '@react-mock/fetch';
import { LocalStorageMock } from '@react-mock/localstorage';
import { Provider } from 'react-redux';
import { InjectedDrawerProps, IocProvider } from '../../..';
import configureStore from '../../../redux/store';
import { container } from '../../../inversify/inversify.config';
import { injectDrawer } from '../../drawer';
import { compose } from 'recompose';
import {
  props,
  propsAnalytics1,
  propsAnalytics2,
  propsAnalytics3,
  propsAnalytics4,
  propsMetric,
} from '../__utils__/dashboardConfig';
import { fetchmockOptions } from '../__utils__/fetchMockOptions';
import { IntlProvider } from 'react-intl';

const store = configureStore();

const WithDrawerDashboardLayout = compose<
  DashboardLayoutProps & InjectedDrawerProps,
  DashboardLayoutProps
>(injectDrawer)(DashboardLayout);

function adaptToEditable(_props: DashboardLayoutProps) {
  return {
    ..._props,
    schema: _props.schema,
  };
}
export default {
  standard: (
    <Provider store={store}>
      <IocProvider container={container}>
        <LocalStorageMock items={{ access_token: 're4lt0k3n' }}>
          <FetchMock mocks={fetchmockOptions}>
            <WithDrawerDashboardLayout {...propsMetric} />
            <WithDrawerDashboardLayout {...props} />
            <WithDrawerDashboardLayout {...propsAnalytics1} />
            <WithDrawerDashboardLayout {...propsAnalytics2} />
            <WithDrawerDashboardLayout {...propsAnalytics3} />
            <WithDrawerDashboardLayout {...propsAnalytics4} />
          </FetchMock>
        </LocalStorageMock>
      </IocProvider>
    </Provider>
  ),
  editable: (
    <Provider store={store}>
      <IocProvider container={container}>
        <IntlProvider locale='en'>
          <LocalStorageMock items={{ access_token: 're4lt0k3n' }}>
            <FetchMock mocks={fetchmockOptions}>
              <EditableDashboardLayout {...adaptToEditable(props)} />
            </FetchMock>
          </LocalStorageMock>
        </IntlProvider>
      </IocProvider>
    </Provider>
  ),
};

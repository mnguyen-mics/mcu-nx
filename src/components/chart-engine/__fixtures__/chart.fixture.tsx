import 'reflect-metadata';
import * as React from 'react';
import Chart from '../Chart';
import { IocProvider } from '../../../inversify/inversify.react';
import { container } from '../../../inversify/inversify.config';
import config from '../../../react-configuration';
import { ChartConfig } from '../../../services/ChartDatasetService';
import { FetchMock } from '@react-mock/fetch';
import { Provider } from 'react-redux';
import configureStore from '../../../redux/store';
import { IntlProvider } from 'react-intl';
import { fetchmockOptions } from '../__utils__/fetchMockOptions';

(global as any).window.MCS_CONSTANTS = config;
const chartConfigPie: ChartConfig = {
  title: 'Chart 1',
  type: 'pie',
  dataset: {
    type: 'otql',
    query_id: '23',
  },
  options: {
    innerRadius: true,
  },
};

const chartConfigRadar: ChartConfig = {
  title: 'Chart 2',
  type: 'radar',
  dataset: {
    type: 'otql',
    query_text: 'SELECT { nature @map } FROM ActivityEvent',
  },
  options: {
    height: 300,
    xKey: 'xKey',
    yKeys: [
      {
        key: 'value',
        message: 'segment',
      },
      {
        key: 'datamart',
        message: 'datamart',
      },
    ],
  },
};

const chartConfigBars: ChartConfig = {
  title: 'Chart 3',
  type: 'bars',
  dataset: {
    type: 'otql',
    query_text: 'SELECT { nature @map } FROM ActivityEvent',
  },
  options: {
    height: 300,
    xKey: 'xKey',
    yKeys: [
      {
        key: 'value',
        message: 'segment',
      },
      {
        key: 'datamart',
        message: 'datamart',
      },
    ],
  },
};

const chartConfigMetric: ChartConfig = {
  title: 'Chart 4',
  type: 'metric',
  dataset: {
    type: 'otql',
    query_text: 'SELECT @count{} FROM UserPoint',
  },
  options: {
    format: 'count',
  },
};
const store = configureStore();

export default (
  <Provider store={store}>
    <IntlProvider locale='en'>
      <IocProvider container={container}>
        <FetchMock mocks={fetchmockOptions}>
          <Chart chartConfig={chartConfigPie} datamartId={'1414'} />
          <Chart chartConfig={chartConfigRadar} datamartId={'1414'} />
          <Chart chartConfig={chartConfigBars} datamartId={'1414'} />
          <Chart chartConfig={chartConfigMetric} datamartId={'1414'} />
        </FetchMock>
      </IocProvider>
    </IntlProvider>
  </Provider>
);

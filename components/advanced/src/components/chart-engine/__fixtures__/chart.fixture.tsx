import 'reflect-metadata';
import * as React from 'react';
import Chart, { ChartProps } from '../Chart';
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

const commonProps: Partial<ChartProps> = {
  datamartId: '1414',
  organisationId: '504',
  queryExecutionSource: 'AUTOMATION',
  queryExecutionSubSource: 'AUTOMATION_BUILDER',
};

const chartConfigPie: ChartConfig = {
  title: 'Chart 1',
  type: 'pie',
  dataset: {
    type: 'otql',
    query_id: '23',
  },
  options: {
    inner_radius: true,
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

const chartPieProps = {
  chartConfig: chartConfigPie,
  ...commonProps,
} as ChartProps;

const chartRadarProps = {
  chartConfig: chartConfigRadar,
  ...commonProps,
} as ChartProps;

const chartBarProps = {
  chartConfig: chartConfigBars,
  ...commonProps,
} as ChartProps;

const chartMetricProps = {
  chartConfig: chartConfigMetric,
  ...commonProps,
} as ChartProps;

export default (
  <Provider store={store}>
    <IntlProvider locale='en'>
      <IocProvider container={container}>
        <FetchMock mocks={fetchmockOptions}>
          <Chart {...chartPieProps} />
          <Chart {...chartRadarProps} />
          <Chart {...chartBarProps} />
          <Chart {...chartMetricProps} />
        </FetchMock>
      </IocProvider>
    </IntlProvider>
  </Provider>
);

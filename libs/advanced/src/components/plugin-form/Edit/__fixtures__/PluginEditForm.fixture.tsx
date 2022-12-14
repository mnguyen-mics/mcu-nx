import 'reflect-metadata';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { ReduxMock } from 'react-cosmos-redux';
import { IocProvider } from '../../../../inversify/inversify.react';
import { container } from '../../../../inversify/inversify.config';
import configureStore from '../../../../redux/store';
import config from '../../../../react-configuration';
import PluginEditForm from '../PluginEditForm';
import { HashRouter as Router } from 'react-router-dom';
import { Card } from 'antd';
import {
  mockReduxState,
  mockPropertyResourceShapes,
  mockPluginLayout,
} from '../PluginEditForm.mock';

(global as any).window.MCS_CONSTANTS = config;

const save = () => {
  return;
};

export default (
  <ReduxMock configureStore={configureStore} initialState={mockReduxState}>
    <IocProvider container={container}>
      <IntlProvider locale='en'>
        <Router>
          <Card>
            <PluginEditForm
              organisationId={'545'}
              editionMode={true}
              save={save}
              pluginProperties={mockPropertyResourceShapes}
              disableFields={false}
              pluginLayout={mockPluginLayout}
              isLoading={false}
              pluginVersionId={'62'}
              formId={'tset'}
              initialValues={{}}
              showGeneralInformation={true}
            />
          </Card>
        </Router>
      </IntlProvider>
    </IocProvider>
  </ReduxMock>
);

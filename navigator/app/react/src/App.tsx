import 'reflect-metadata';
import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import configureStore from './store';
import enUS from 'antd/lib/locale-provider/en_US';
import { IocProvider } from './config/inversify.react';
import { container } from './config/inversify.config';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';
import { HashRouter as Router } from 'react-router-dom';
import NavigatorWithKeycloak from './containers/Navigator/NavigatorWithKeycloak';
import { PageNotFound } from './containers/Navigator/PageNotFound/PageNotFound';

const store = configureStore();
const formats = {
  number: {
    USD: {
      style: 'currency',
      currency: 'USD',
    },
    EUR: {
      style: 'currency',
      currency: 'EUR',
    },
  },
};

class App extends React.Component<{}> {
  render() {
    return (
      <IntlProvider formats={formats} defaultFormats={formats} locale='en'>
        <ReduxProvider store={store}>
          <IocProvider container={container}>
            <ConfigProvider locale={enUS}>
              {window?.location?.pathname !== '/' &&
              !window?.location?.pathname.startsWith('/#') ? (
                <PageNotFound />
              ) : (
                <Router>
                  <NavigatorWithKeycloak />
                </Router>
              )}
            </ConfigProvider>
          </IocProvider>
        </ReduxProvider>
      </IntlProvider>
    );
  }
}

export default App;

import 'reflect-metadata';
import { Route, Switch } from 'react-router-dom';
import * as React from "react";
import { Login, Store } from '@mediarithmics-private/advanced-component';
import { Provider } from 'react-redux';
import { HomePage } from '../home';
const store = Store();
class Main extends React.Component {

  getRouteMapping = () => {
    return
  }
  render() {
    const loginRouteRender = () => {
      return <Login />
    };
    return <Switch>
      <Route exact={true} path='/' component={HomePage} />

      <Provider store={store}>
        <Route path="/login" render={loginRouteRender} />
      </Provider>
    </Switch>
  }
}


export default Main

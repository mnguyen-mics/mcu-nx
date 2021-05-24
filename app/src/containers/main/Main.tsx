import 'reflect-metadata';
import { Route, Switch } from 'react-router-dom';
import * as React from "react";
import { Login, ForgotPassword, Store, IocProvider, container } from '@mediarithmics-private/advanced-component';
import { Provider } from 'react-redux';
import { HomePage } from '../home';


const store = Store();
class Main extends React.Component {

  getRouteMapping = () => {
    return
  }
  render() {
    const loginRouteRender = () => {
      return <Login forgotPasswordRoute={'/forgot_password'} />
    };

    const forgotPasswordRouteRender = () => {
      return <IocProvider container={container}>
          <ForgotPassword /> 
        </IocProvider>
    };
    return <Switch>
      <Route exact={true} path='/' component={HomePage} />

      <Route exact={true} path='/forgot_password' component={forgotPasswordRouteRender} />


      <Provider store={store}>
        <Route path="/login" render={loginRouteRender} />
      </Provider>
    </Switch>
  }
}


export default Main

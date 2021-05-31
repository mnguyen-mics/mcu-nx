import 'reflect-metadata';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import * as React from "react";
import { Login, ForgotPassword, IocProvider, container, logOut, TYPES, IAuthService, lazyInject, AuthenticatedRoute } from '@mediarithmics-private/advanced-component';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { NavigatorRoute } from '../../routes/domain';
import routes from '../../routes/routes';
import { LayoutManager } from '../../components/layoutManager';
import log from 'loglevel';

const basePath = '/o/:organisationId(\\d+)';
interface MapStateToProps {
  logOut: (action?: any, meta?: any) => void;
}

type JoinedProps = MapStateToProps &
  RouteComponentProps<{ organisationId: string }>;

class Main extends React.Component<JoinedProps>  {

  @lazyInject(TYPES.IAuthService)
  private _authService: IAuthService;


  componentDidMount() {
    document.addEventListener(
      'unauthorizedEvent',
      e => {
        this._authService.deleteCredentials();
        this.props.history.push({ pathname: '/', state: this.props.location.state });
      },
      false,
    );
  }

  render() {
    const loginRouteRender = () => {
      return <Login forgotPasswordRoute={'/forgot_password'} />
    };
    const renderRoute = ({ match }: RouteComponentProps<{ organisationId: string }>) => {
      const authenticated = this._authService.isAuthenticated();
      debugger
      let redirectToUrl = '/login';
      if (authenticated) {
        debugger
        redirectToUrl = `/o/1/home`;
      }
      log.debug(`Redirect from ${match.url}  to ${redirectToUrl}`);
      return <Redirect to={{ pathname: redirectToUrl, state: this.props.location.state }} />;
    };

    const logoutRouteRender = () => {
      const redirectCb = () => {
        this.props.history.push({
          pathname: '/login',
        });
      };
      this.props.logOut(undefined, { redirectCb });
      return null;
    };

    const forgotPasswordRouteRender = () => {
      return <IocProvider container={container}>
        <ForgotPassword />
      </IocProvider>
    };

    const routeMapping = routes.map((route: NavigatorRoute) => {
        const ElementTag =
          route.layout === 'main'
            ? route.contentComponent
            : route.layout === 'edit'
              ?
              route.editComponent

              : route.contentComponent;

        return  <AuthenticatedRoute
        key={0} // shared key to reuse layout and avoid remounting components on route change
        exact={true}
        path={`${basePath}${route.path}`}
        render={() => <LayoutManager routeComponent={ <ElementTag />}/> }
        errorRender={() => <div />}
        requiredFeatures={route.requiredFeature}
        requireDatamart={route.requireDatamart}
      />
      });
  
    return <Switch>
  
      <Route exact={true} path='/' render={renderRoute} />
    
      {routeMapping}
      <Route exact={true} path="/login" render={loginRouteRender} />
      <Route exact={true} path="/logout" render={logoutRouteRender} />
      <Route exact={true} path='/forgot_password' component={forgotPasswordRouteRender} />
    </Switch>




  }
}

const mapDispatchToProps = {
  logOut
};


export default compose<JoinedProps, {}>(
  withRouter,
  connect(null, mapDispatchToProps),
)(Main);

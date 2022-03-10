import 'reflect-metadata';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import * as React from 'react';
import {
  MicsReduxState,
  isAppInitialized,
  Login,
  ForgotPassword,
  IocProvider,
  container,
  logOut,
  TYPES,
  IAuthService,
  lazyInject,
  AuthenticatedRoute,
  NoAccess,
  errorMessages,
  DrawerManager,
} from '@mediarithmics-private/advanced-components';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { NavigatorRoute } from '../../routes/domain';
import routes from '../../routes/routes';
import { LayoutManager } from '../../components/layoutManager';
import log from 'loglevel';
import { Loading, Error } from '@mediarithmics-private/mcs-components-library';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import Notifications from '../Notifications/Notifications';
import Datalayer from './Datalayer';

const basePath = '/o/:organisationId(\\d+)';
interface MapStateToProps {
  initialized: boolean;
  initializationError: boolean;
  logOut: (action?: any, meta?: any) => void;
}

interface MainState {
  error: boolean;
}

type JoinedProps = MapStateToProps &
  InjectedIntlProps &
  RouteComponentProps<{ organisationId: string }>;

class Main extends React.Component<JoinedProps, MainState> {
  @lazyInject(TYPES.IAuthService)
  private _authService: IAuthService;

  constructor(props: JoinedProps) {
    super(props);
    this.state = {
      error: false,
    };
  }

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

  componentDidCatch() {
    this.setState({ error: true });
  }

  render() {
    const {
      initialized,
      initializationError,
      intl: { formatMessage },
    } = this.props;
    const { error } = this.state;

    if (initializationError) {
      return <Error message={formatMessage(errorMessages.generic)} />;
    }

    if (error) {
      return <Error message={formatMessage(errorMessages.generic)} />;
    }

    if (!initialized) return <Loading isFullScreen={false} />; // allow app to bootstrap before render any routes, wait for translations, autologin, etc....

    const loginRouteRender = () => {
      return <Login forgotPasswordRoute={'/forgot_password'} />;
    };
    const renderRoute = ({ match }: RouteComponentProps<{ organisationId: string }>) => {
      const authenticated = this._authService.isAuthenticated();
      let redirectToUrl = '/login';
      if (authenticated) {
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
      return (
        <IocProvider container={container}>
          <ForgotPassword />
        </IocProvider>
      );
    };

    const erroRender = () => {
      return <NoAccess />;
    };

    const routeMapping = routes.map((route: NavigatorRoute) => {
      const ElementTag =
        route.layout === 'main'
          ? route.contentComponent
          : route.layout === 'edit'
          ? route.editComponent
          : route.contentComponent;
      const datalayer = route.datalayer;
      const authenticatedRouteRender = (props: any) => {
        return (
          <React.Fragment>
            <Datalayer datalayer={datalayer}>
              <Notifications />
              <div className='drawer-wrapper'>
                <DrawerManager />
              </div>
              <LayoutManager routeComponent={<ElementTag />} />
            </Datalayer>
          </React.Fragment>
        );
      };
      return (
        <AuthenticatedRoute
          key={0} // shared key to reuse layout and avoid remounting components on route change
          exact={true}
          path={`${basePath}${route.path}`}
          render={authenticatedRouteRender}
          errorRender={erroRender}
          requiredFeatures={route.requiredFeature}
          requireDatamart={route.requireDatamart}
        />
      );
    });

    return (
      <Switch>
        <Route exact={true} path='/' render={renderRoute} />

        {routeMapping}
        <Route exact={true} path='/login' render={loginRouteRender} />
        <Route exact={true} path='/logout' render={logoutRouteRender} />
        <Route exact={true} path='/forgot_password' component={forgotPasswordRouteRender} />
      </Switch>
    );
  }
}

const mapStateToProps = (state: MicsReduxState) => ({
  initialized: isAppInitialized(state),
  initializationError: state.app.initializationError,
});
const mapDispatchToProps = {
  logOut,
};

export default compose<JoinedProps, {}>(
  injectIntl,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Main);

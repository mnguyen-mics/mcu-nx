import * as React from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';

import log from 'mcs-services/lib/Log';

import auth from 'mcs-services/lib/AuthenticationStorage';
import {RouteProps} from "react-router";
import {compose} from "recompose";

//import {RouteProps} from "react-router";

export interface AuthenticatedRouteProps extends RouteProps {
  //render: (props: any) => React.Component,

}

interface AuthenticatedRouteProvidedProps extends AuthenticatedRouteProps{
  computedMatch: any,
  connectedUserLoaded: boolean,
}



class AuthenticatedRoute extends React.Component<AuthenticatedRouteProvidedProps> {

  render() {
    const {
      render,
    } = this.props;

    const authenticated = auth.isAuthenticated(); // if access token is present in local storage and valid

      return (
        <Route
          {...this.props}
          render={props => {
            if(authenticated){
              log.trace(`Access granted to ${props.match.url}`);
              return render!(props);
            }
            else {
              log.error(`Access denied to ${props.match.url}, redirect to login`);
              return (<Redirect to={'/v2/login'}/>);
            }

          }}
        />
      );
  }
}

export default compose<AuthenticatedRouteProvidedProps, AuthenticatedRouteProps>(
)(AuthenticatedRoute);

import * as React from 'react';
import KeycloakService from '../services/KeycloakService';

class RenderOnAuthenticated extends React.Component {
  render() {
    const { children } = this.props;

    return KeycloakService.isLoggedIn() ? children : null;
  }
}

export default RenderOnAuthenticated;

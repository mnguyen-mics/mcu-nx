import { Error, Loading } from '@mediarithmics-private/mcs-components-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { errorMessages, MicsReduxState } from '..';
import { UserProfileResource } from '../models/directory/UserProfileResource';
import KeycloakService from '../services/KeycloakService';
import { RouteParams } from './AuthenticatedRoute';
import { withRouter, RouteComponentProps, Redirect } from 'react-router';
import { KeycloakPostLogin } from '../redux/KeycloakPostLogin/actions';
import { InjectedFeaturesProps, injectFeatures } from '../components/Features';
import RenderWhenHasAccess from './RenderWhenHasAccess';
import { InjectedIntlProps, injectIntl } from 'react-intl';

export interface RenderOnAuthenticatedProps {
  requiredFeatures?: string | string[];
  requireDatamart?: boolean;
  renderOnError?: JSX.Element;
  getRedirectUriFunction?: () => string | undefined;
  homePage?: (organisationId: string) => string;
}

interface MapStateToProps {
  connectedUser: UserProfileResource;
  state: MicsReduxState;
}

interface MapDispatchToProps {
  keycloakPostLoginAction: () => void;
}

type Props = RenderOnAuthenticatedProps &
  MapStateToProps &
  MapDispatchToProps &
  InjectedFeaturesProps &
  InjectedIntlProps &
  RouteComponentProps<RouteParams>;

class RenderOnAuthenticated extends React.Component<Props> {
  static defaultProps = {
    requiredFeatures: undefined,
    requireDatamart: false,
  };

  componentDidMount() {
    const { connectedUser, keycloakPostLoginAction } = this.props;
    if (
      KeycloakService.isKeycloakEnabled() &&
      KeycloakService.isLoggedIn() &&
      (!connectedUser || !connectedUser.id)
    ) {
      keycloakPostLoginAction();
    }
  }

  render() {
    const {
      children,
      state,
      requiredFeatures,
      requireDatamart,
      renderOnError,
      homePage,
      intl: { formatMessage },
      getRedirectUriFunction,
    } = this.props;

    const defaultLoading = <Loading isFullScreen={true} />;
    const defaultError = <Error message={formatMessage(errorMessages.generic)} />;

    if (!KeycloakService.isKeycloakEnabled() || !KeycloakService.isLoggedIn()) {
      return defaultError;
    }

    // If KeycloakPostLogin not already finished
    if (!state.keycloakPostLogin.done) {
      return defaultLoading;
    }

    // If KeycloakPostLogin done and failed
    if (state.keycloakPostLogin.hasFailed) {
      return defaultError;
    }

    if (getRedirectUriFunction) {
      const redirectTo = getRedirectUriFunction();
      if (redirectTo)
        return <Redirect to={{ pathname: redirectTo, state: this.props.location.state }} />;
      else return defaultError;
    }

    return (
      <RenderWhenHasAccess
        requiredFeatures={requiredFeatures}
        requireDatamart={requireDatamart}
        renderOnError={renderOnError}
        homePage={homePage}
      >
        {children}
      </RenderWhenHasAccess>
    );
  }
}

const mapStateToProps = (state: MicsReduxState) => ({
  connectedUser: state.session.connectedUser,
  state: state,
});

const mapDispatchToProps = {
  keycloakPostLoginAction: KeycloakPostLogin.keycloakPostLogin,
};

export default compose<Props, RenderOnAuthenticatedProps>(
  withRouter,
  injectIntl,
  injectFeatures,
  connect(mapStateToProps, mapDispatchToProps),
)(RenderOnAuthenticated);

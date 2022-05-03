import { Error } from '@mediarithmics-private/mcs-components-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { errorMessages, MicsReduxState } from '..';
import { InjectedFeaturesProps, injectFeatures } from '../components/Features';
import * as SessionHelper from '../redux/Session/selectors';
import { getWorkspace } from '../redux/Session/actions';
import { fetchAllLabels } from '../redux/Labels/actions';
import { RouteParams } from './AuthenticatedRoute';
import { withRouter, RouteComponentProps } from 'react-router';
import { InjectedIntlProps, injectIntl } from 'react-intl';

export interface RenderWhenHasAccessProps {
  requiredFeatures?: string | string[];
  requireDatamart?: boolean;
  renderOnError?: React.ReactNode;
  homePage?: string;
}

export interface MapStateToProps {
  accessGrantedToOrganisation: (organisationId: string) => boolean;
  getWorkspaceRequest: (organisationId: string) => void;
  hasWorkspaceLoaded: (organisationId: string) => boolean;
  getLabels: (organisationId: string) => void;
  hasDatamarts: (organisationId: string) => boolean;
}

type Props = RenderWhenHasAccessProps &
  MapStateToProps &
  RouteComponentProps<RouteParams> &
  InjectedIntlProps &
  InjectedFeaturesProps;

class RenderWhenHasAccess extends React.Component<Props> {
  componentDidMount() {
    const {
      match: {
        params: { organisationId },
      },
      getWorkspaceRequest,
      getLabels,
      hasWorkspaceLoaded,
    } = this.props;

    if (!hasWorkspaceLoaded(organisationId)) {
      getWorkspaceRequest(organisationId);
    }
    getLabels(organisationId);
  }

  componentDidUpdate(previousProps: Props) {
    const {
      match: {
        params: { organisationId },
      },
      getWorkspaceRequest,
      history,
      homePage,
    } = this.props;

    const {
      match: {
        params: { organisationId: previousOrganisationId },
      },
    } = previousProps;

    if (previousOrganisationId !== organisationId) {
      getWorkspaceRequest(organisationId);
      if (!this.checkIfHasFeatures()) history.push(homePage ? homePage : '/');
    }
  }

  checkIfHasFeatures = () => {
    const {
      requiredFeatures,
      requireDatamart,
      hasFeature,
      match: {
        params: { organisationId },
      },
      hasDatamarts,
    } = this.props;

    if (requiredFeatures && typeof requiredFeatures === 'string') {
      return hasFeature(requiredFeatures) && !(!hasDatamarts(organisationId) && requireDatamart);
    } else if (requiredFeatures && Array.isArray(requiredFeatures)) {
      return requiredFeatures.reduce((acc, val) => {
        return hasFeature(val) && !(!hasDatamarts(organisationId) && requireDatamart);
      }, false);
    } else if (!requiredFeatures) {
      return !(!hasDatamarts(organisationId) && requireDatamart);
    }
    return false;
  };

  render() {
    const {
      children,
      renderOnError,
      accessGrantedToOrganisation,
      match: {
        params: { organisationId },
      },
      intl: { formatMessage },
    } = this.props;

    const errorRendered = renderOnError ? (
      renderOnError
    ) : (
      <Error message={formatMessage(errorMessages.generic)} />
    );

    return accessGrantedToOrganisation(organisationId) && this.checkIfHasFeatures()
      ? children
      : errorRendered;
  }
}

const mapStateToProps = (state: MicsReduxState) => ({
  accessGrantedToOrganisation: SessionHelper.hasAccessToOrganisation(state),
  hasWorkspaceLoaded: SessionHelper.hasWorkspace(state),
  hasDatamarts: SessionHelper.hasDatamarts(state),
});

const mapDispatchToProps = {
  getWorkspaceRequest: getWorkspace.request,
  getLabels: fetchAllLabels.request,
};

export default compose<Props, RenderWhenHasAccessProps>(
  withRouter,
  injectFeatures,
  injectIntl,
  connect(mapStateToProps, mapDispatchToProps),
)(RenderWhenHasAccess);

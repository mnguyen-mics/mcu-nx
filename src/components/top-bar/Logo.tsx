import * as React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { getLogo } from '../../redux/Session/actions';
import { MenuMode } from 'antd/lib/menu';
import { MicsReduxState } from '../../redux/ReduxHelper';
import { LocationDescriptor } from 'history';

export interface LogoProps {
  mode: MenuMode;
  linkPath: LocationDescriptor<unknown>;
}

interface LogoStoreProps {
  logoUrl: string;
  getLogoRequest: (a: { organisationId: string }) => void;
}

type Props = LogoProps & RouteComponentProps<{ organisationId: string }> & LogoStoreProps;

class Logo extends React.Component<Props> {
  static defaultProps = {
    logoUrl: '',
  };

  componentDidMount() {
    const {
      match: {
        params: { organisationId },
      },
    } = this.props;
    this.props.getLogoRequest({ organisationId });
  }

  componentDidUpdate(previousProps: Props) {
    const {
      match: {
        params: { organisationId },
      },
    } = this.props;

    const {
      match: {
        params: { organisationId: previousOrganisationId },
      },
    } = previousProps;
    if (organisationId !== previousOrganisationId) {

      this.props.getLogoRequest({ organisationId: organisationId });
    }
  }

  render() {
    const {
      mode,
      logoUrl,
      linkPath,
      match: {
        params: { organisationId },
      },
    } = this.props;

    return (
      <div className='mcs-logo-placeholder'>
        {mode === 'inline' && (
          <div className='mcs-logo'>
            <Link to={linkPath} id='logo'>
              <img alt='logo' src={logoUrl} />
            </Link>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: MicsReduxState) => ({
  logoUrl: state.session.logoUrl,
});

const mapDispatchToProps = {
  getLogoRequest: getLogo.request,
};

export default compose<Props, LogoProps>(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Logo);

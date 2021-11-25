import {
  BookFilled,
  CodeSandboxCircleFilled,
  CompassFilled,
  ReadOutlined,
} from '@ant-design/icons';
import { AppsMenu, McsHeader } from '@mediarithmics-private/mcs-components-library';
import { AppsMenuSections } from '@mediarithmics-private/mcs-components-library/lib/components/apps-navigation/apps-menu/AppsMenu';
import { LocationDescriptor } from 'history';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';
import { compose } from 'recompose';
import { UserProfileResource } from '../../models/directory/UserProfileResource';
import { MicsReduxState } from '../../utils/ReduxHelper';
import OrganisationListSwitcher from '../organisation-switcher/OrganisationListSwitcher';
import Logo from './Logo';
import messages from './messages';
import { Alert } from 'antd';
import KeycloakService from '../../services/KeycloakService';

interface TopBarMapStateToProps {
  connectedUser: UserProfileResource;
  userEmail: string;
}

interface TopBarProps {
  organisationId: string;
  linkPath: LocationDescriptor<unknown>;
  prodEnv: boolean;
  userAccount?: React.ReactNode[];
  headerSettings?: React.ReactNode;
  color?: string;
}

type RouteProps = RouteComponentProps<{ organisation_id: string }>;

type Props = TopBarMapStateToProps & TopBarProps & RouteProps;

export const buildAccountsMenu = () => {
  const formattedMessage = <FormattedMessage {...messages.logout} />;
  if (KeycloakService.isKeycloakEnabled()) {
    const logOut = () => {
      KeycloakService.doLogout();
    };

    return [
      <div onClick={logOut} key={1}>
        {formattedMessage}
      </div>,
    ];
  } else {
    return [
      <Link to='/logout' key={1}>
        {formattedMessage}
      </Link>,
    ];
  }
};

class TopBar extends React.Component<Props> {
  getAppMenuSections(): AppsMenuSections {
    const { connectedUser } = this.props;

    const isFromMics =
      connectedUser.workspaces.filter(workspace => workspace.organisation_id === '1').length > 0;

    const menuSections: AppsMenuSections = {
      userLinks: [
        {
          name: 'Navigator',
          icon: <CompassFilled className='mcs-app_icon mcs-app_navigatorIcon' />,
          url: 'https://navigator.mediarithmics.com',
        },
        {
          name: 'Developer Documentation',
          icon: <BookFilled className='mcs-app_icon mcs-app_documentationIcon ' />,
          url: 'https://developer.mediarithmics.com',
        },

        {
          name: 'User Guide',
          icon: <ReadOutlined className='mcs-app_icon mcs-app_documentationIcon' />,
          url: 'https://userguides.mediarithmics.com',
        },
      ],
      adminLinks: [],
    };

    if (isFromMics) {
      menuSections.adminLinks = [
        {
          name: 'Platform Admin',
          url: 'https://admin.mediarithmics.com:8493',
        },
        {
          name: 'Computing Console',
          icon: <CodeSandboxCircleFilled className='mcs-app_icon mcs-app_developerConsoleIcon' />,
          url: 'https://computing-console-mics.francecentral.cloudapp.azure.com/frontprod/login',
        },
      ];
    }
    return menuSections;
  }

  render() {
    const { userEmail, linkPath, prodEnv, userAccount, headerSettings } = this.props;
    const appMenuSections: AppsMenuSections = this.getAppMenuSections();
    const ProductionApiEnvironment = (
      <Alert
        className='mcs-topBar-envAlert'
        message='You are using production API environment !'
        type='error'
        showIcon={true}
      />
    );
    const appMenu =
      appMenuSections.userLinks.length > 0 ||
      (appMenuSections.adminLinks && appMenuSections.adminLinks.length > 0) ? (
        <AppsMenu
          className='mcs-app-menu-main-layout'
          sections={appMenuSections}
          logo={<Logo linkPath={linkPath} mode='inline' />}
        />
      ) : undefined;
    return (
      <McsHeader
        organisationSwitcher={<OrganisationListSwitcher />}
        userEmail={userEmail}
        accountContent={userAccount || buildAccountsMenu()}
        headerSettings={headerSettings}
        menu={appMenu}
        devAlert={prodEnv ? ProductionApiEnvironment : undefined}
      />
    );
  }
}

const mapStateToProps = (state: MicsReduxState) => ({
  connectedUser: state.session.connectedUser,
  userEmail: state.session.connectedUser.email,
});

export default compose<TopBarMapStateToProps & RouteProps, TopBarProps>(
  withRouter,
  connect(mapStateToProps),
)(TopBar);

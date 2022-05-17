import {
  BookFilled,
  CodeSandboxCircleFilled,
  CompassFilled,
  ReadOutlined,
} from '@ant-design/icons';
import { AppsMenu, McsHeader } from '@mediarithmics-private/mcs-components-library';
import { AppsMenuSections } from '@mediarithmics-private/mcs-components-library/lib/components/apps-navigation/apps-menu/AppsMenu';
import { To } from 'history';
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
import MCS_CONSTANTS from '../../react-configuration';

interface TopBarMapStateToProps {
  connectedUser: UserProfileResource;
  userEmail: string;
}

interface AppLauncherMenuItem {
  name: string;
  icon: string;
  url: string;
  link_type: string;
}

interface TopBarProps {
  organisationId: string;
  linkPath: To;
  prodEnv: boolean;
  userAccount?: React.ReactNode[];
  headerSettings?: React.ReactNode;
  className?: string;
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
  getIcon = (icon: string) => {
    switch (icon) {
      case 'compass-filled':
        return <CompassFilled className='mcs-app_icon mcs-app_navigatorIcon' />;
      case 'code-sandbox-circle-filled':
        return <CodeSandboxCircleFilled className='mcs-app_icon mcs-app_developerConsoleIcon' />;
      case 'book-filled':
        return <BookFilled className='mcs-app_icon mcs-app_documentationIcon ' />;
      case 'read-out-lined':
        return <ReadOutlined className='mcs-app_icon mcs-app_documentationIcon' />;
      default:
        return;
    }
  };

  getUserLinksUrl = (url: string) => {
    const { organisationId } = this.props;
    if (url.includes('navigator')) {
      return `${url}/#/v2/o/${organisationId}/campaigns/display`;
    } else if (url.includes('computing-console')) {
      return `${url}/#/o/${organisationId}/home`;
    }
    return url;
  };

  getAppMenuSections(): AppsMenuSections {
    const { connectedUser, organisationId } = this.props;

    const isFromMics =
      connectedUser.workspaces.filter(workspace => workspace.organisation_id === '1').length > 0;

    const APP_LAUNCHER_MENU = (window as any)?.MCS_CONSTANTS?.APP_LAUNCHER_MENU;

    const defaultMenuSections: AppsMenuSections = {
      userLinks: [
        {
          name: 'Navigator',
          icon: <CompassFilled className='mcs-app_icon mcs-app_navigatorIcon' />,
          url: `${MCS_CONSTANTS.NAVIGATOR_URL}/#/v2/o/${organisationId}/campaigns/display`,
        },
        {
          name: 'Computing Console',
          icon: <CodeSandboxCircleFilled className='mcs-app_icon mcs-app_developerConsoleIcon' />,
          url: `${MCS_CONSTANTS.COMPUTING_CONSOLE_URL}/#/o/${organisationId}/home`,
        },
      ],
      adminLinks: [],
      resourceLinks: [
        {
          name: 'Developer Documentation',
          icon: <BookFilled className='mcs-app_icon mcs-app_documentationIcon ' />,
          url: 'https://developer.mediarithmics.io',
        },

        {
          name: 'User Guide',
          icon: <ReadOutlined className='mcs-app_icon mcs-app_documentationIcon' />,
          url: 'https://userguides.mediarithmics.io',
        },
      ],
    };

    const menuSections: AppsMenuSections = APP_LAUNCHER_MENU
      ? {
          userLinks: APP_LAUNCHER_MENU.filter(
            (menuItem: AppLauncherMenuItem) => menuItem.link_type === 'user',
          ).map((menuItem: AppLauncherMenuItem) => {
            return {
              name: menuItem.name,
              icon: this.getIcon(menuItem.icon),
              url: this.getUserLinksUrl(menuItem.url),
            };
          }),
          adminLinks: [],
          resourceLinks: APP_LAUNCHER_MENU.filter(
            (menuItem: AppLauncherMenuItem) => menuItem.link_type === 'resource',
          ).map((menuItem: AppLauncherMenuItem) => {
            return {
              name: menuItem.name,
              icon: this.getIcon(menuItem.icon),
              url: menuItem.url,
            };
          }),
        }
      : defaultMenuSections;

    if (isFromMics) {
      menuSections.adminLinks = [
        {
          name: 'Platform Admin',
          url: 'https://admin.mediarithmics.com:8493',
        },
      ];
    }
    return menuSections;
  }

  render() {
    const { userEmail, linkPath, prodEnv, userAccount, headerSettings, className } = this.props;
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
      (appMenuSections.adminLinks && appMenuSections.adminLinks.length > 0) ||
      (appMenuSections.resourceLinks && appMenuSections.resourceLinks.length > 0) ? (
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
        className={className}
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

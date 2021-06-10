import { BookFilled, CodeSandboxCircleFilled, CompassFilled, ReadOutlined } from '@ant-design/icons';
import { AppsMenu, McsHeader } from '@mediarithmics-private/mcs-components-library';
import { AppsMenuSection } from '@mediarithmics-private/mcs-components-library/lib/components/apps-navigation/apps-menu/AppsMenu';
import { LocationDescriptor } from 'history';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { UserProfileResource } from '../../models/directory/UserProfileResource';
import { MicsReduxState } from '../../redux/ReduxHelper';
import OrganisationListSwitcher from '../organisation-switcher/OrganisationListSwitcher';
import Logo from './Logo';
import messages from './messages';
import { Alert } from 'antd';

interface TopBarMapStateToProps {
  connectedUser: UserProfileResource;
  userEmail: string;
}

interface TopBarProps {
  organisationId: string;
  linkPath: LocationDescriptor<unknown>;
  prodEnv: boolean;
}

type Props = TopBarMapStateToProps & TopBarProps;

export const buildAccountsMenu = () => [
  <Link to='/logout' key={1}>
    <FormattedMessage {...messages.logout} />
  </Link>,
];

class TopBar extends React.Component<Props> {
  getAppMenuSections(): AppsMenuSection[] {
    const { connectedUser } = this.props;

    const isFromMics =
      connectedUser.workspaces.filter(workspace => workspace.organisation_id === '1').length > 0;

    if (isFromMics) {
      return [
        {
          items: [
            {
              name: 'Platform Admin',
              url: 'https://admin.mediarithmics.com:8493',
            },
          ],
        },
        {
          items: [
            {
              name: 'Computing Console',
              icon: (
                <CodeSandboxCircleFilled className='mcs-app_icon mcs-app_developerConsoleIcon' />
              ),
              url:
                'https://computing-console-mics.francecentral.cloudapp.azure.com/frontprod/login',
            },
          ],
        },
        {
          items: [
            {
              name: 'Navigator',
              icon: (
                <CompassFilled className='mcs-app_icon mcs-app_navigatorIcon' />
              ),
              url:
                'https://navigator.mediarithmics.com',
            },
          ],
        },
        {
          items: [
            {
              name: 'Developer Documentation',
              icon: (
                <BookFilled className='mcs-app_icon mcs-app_documentationIcon ' />
              ),
              url:
                'https://developer.mediarithmics.com',
            },
          ],
        },
        {
          items: [
            {
              name: 'User Guide',
              icon: (
                <ReadOutlined className='mcs-app_icon mcs-app_documentationIcon' />
              ),
              url:
                'https://userguides.mediarithmics.com',
            },
          ],
        },
      ];
    } else {
      return [];
    }
  }

  render() {
    const { userEmail, linkPath, prodEnv } = this.props;
    const appMenuSections: AppsMenuSection[] = this.getAppMenuSections();
    const ProductionApiEnvironment = (
      <Alert
        className='mcs-topBar-envAlert'
        message='You are using production API environment !'
        type='error'
        showIcon={true}
      />
    );
    const appMenu =
      appMenuSections.length > 0 ? (
        <AppsMenu
          className='mcs-app-menu-main-layout'
          sections={appMenuSections}
          logo={<Logo linkPath={linkPath} mode='inline' />}
        />
      ) : undefined;
    return <McsHeader
      organisationSwitcher={<OrganisationListSwitcher />}
      userEmail={userEmail}
      accountContent={buildAccountsMenu()}
      menu={appMenu} 
      devAlert={prodEnv ? ProductionApiEnvironment : undefined}/>;
  }
}

const mapStateToProps = (state: MicsReduxState) => ({
  connectedUser: state.session.connectedUser,
  userEmail: state.session.connectedUser.email,
});

export default compose<TopBarMapStateToProps, TopBarProps>(
  connect(mapStateToProps),
)(TopBar);
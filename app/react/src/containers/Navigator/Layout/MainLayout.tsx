import * as React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  AppstoreOutlined,
  BarsOutlined,
  CodeSandboxCircleFilled,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { push as PushMenu, State } from 'react-burger-menu';
import { Row, Col } from 'antd/lib/grid';
import { NavigatorHeader } from '../../../containers/Header';
import { NavigatorMenu } from '../../../containers/Menu';
import { Logo } from '../../../containers/Logo';
import * as MenuActions from '../../../redux/Menu/actions';
import { compose } from 'recompose';
import { MenuMode } from 'antd/lib/menu';
import { MicsReduxState } from '../../../utils/ReduxHelper';
import {
  Button,
  AppsMenu,
  McsHeader,
} from '@mediarithmics-private/mcs-components-library';
import { UserProfileResource } from '../../../models/directory/UserProfileResource';
import { InjectedFeaturesProps, injectFeatures } from '../../Features';
import { AppsMenuSection } from '@mediarithmics-private/mcs-components-library/lib/components/apps-navigation/apps-menu/AppsMenu';
import {
  buildAccountsMenu,
  buildSettingsButton,
  ProductionApiEnvironment,
} from './LayoutHelper';
import OrganisationListSwitcher from '../../Menu/organisation-switcher/OrganisationListSwitcher';

const { Content, Sider } = Layout;

const messages = defineMessages({
  switchOrg: {
    id: 'navigator.layout.mainLayout.sideMenu.switchOrg.label',
    defaultMessage: 'Switch Org.',
  },
  collapse: {
    id: 'navigator.layout.mainLayout.sideMenu.collapse',
    defaultMessage: 'Collapse',
  },
});

export interface MainLayoutProps {
  contentComponent: React.ComponentType;
  actionBarComponent: React.ComponentType | null;
  showOrgSelector: boolean;
  organisationSelector: any;
  orgSelectorSize: number;
}

interface MainLayoutStoreProps {
  collapsed: boolean;
  mode: MenuMode;
  openCloseMenu: (a: { collapsed: boolean; mode: MenuMode }) => void;
  connectedUser: UserProfileResource;
  userEmail: string;
}

interface MainLayoutState {
  isSelectorOpen: boolean;
  leftColumnSize: number;
  rightColumnSize: number;
}

type Props = MainLayoutProps &
  InjectedFeaturesProps &
  RouteComponentProps<{ organisationId: string }> &
  InjectedFeaturesProps &
  MainLayoutStoreProps;

const LayoutId = Layout as any;
const ColAny = Col as any;

// waiting for https://github.com/ant-design/ant-design/commit/518c424ca4a023f3faebce0adf64219989be0018 to be released to remove any

class MainLayout extends React.Component<Props, MainLayoutState> {
  public static defaultProps: Partial<
    MainLayoutProps & MainLayoutStoreProps
  > = {
    actionBarComponent: null,
    collapsed: false,
    mode: 'inline',
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      isSelectorOpen: false,
      leftColumnSize: 12,
      rightColumnSize: 12,
    };
  }

  onCollapse = (collapsed: boolean) => {
    const { openCloseMenu } = this.props;

    openCloseMenu({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    });

    const event = new Event('redraw');

    window.dispatchEvent(event);
  };

  onMenuItemClick = () => {
    const { collapsed } = this.props;

    if (collapsed === true) {
      this.onCollapse(false);
    }
  };

  renderTrigger = () => {
    const { showOrgSelector } = this.props;

    const orgSelector = () => {
      this.setState({ isSelectorOpen: !this.state.isSelectorOpen });
    };

    const onCollapse = () => {
      this.onCollapse(!this.props.collapsed);
    };

    const resizeBox = (type?: 'left' | 'right') => () => {
      switch (type) {
        case 'left':
          return this.setState({ leftColumnSize: 20, rightColumnSize: 4 });
        case 'right':
          return this.setState({ leftColumnSize: 4, rightColumnSize: 20 });
        default:
          return this.setState({ leftColumnSize: 12, rightColumnSize: 12 });
      }
    };

    return showOrgSelector ? (
      <Row>
        <ColAny
          span={this.state.leftColumnSize}
          className="left"
          onMouseEnter={resizeBox('left')}
          onMouseLeave={resizeBox()}
        >
          <Button onClick={orgSelector} style={{ width: '100%' }}>
            <React.Fragment>
              <BarsOutlined />{' '}
              {this.state.leftColumnSize > 12 && !this.props.collapsed && (
                <FormattedMessage {...messages.switchOrg} />
              )}
            </React.Fragment>
          </Button>
        </ColAny>
        <ColAny
          span={this.state.rightColumnSize}
          className="right"
          onMouseEnter={resizeBox('right')}
          onMouseLeave={resizeBox()}
        >
          <Button onClick={onCollapse} style={{ width: '100%' }}>
            {this.props.collapsed ? (
              <RightOutlined />
            ) : (
              <React.Fragment>
                <LeftOutlined />{' '}
                {this.state.rightColumnSize > 12 && (
                  <FormattedMessage {...messages.collapse} />
                )}
              </React.Fragment>
            )}
          </Button>
        </ColAny>
      </Row>
    ) : (
      <Row>
        <Col span={24} className="all">
          <Button
            onClick={onCollapse}
            style={{ width: '100%' }}
            onMouseEnter={resizeBox('right')}
            onMouseLeave={resizeBox()}
          >
            {this.props.collapsed ? (
              <RightOutlined />
            ) : (
              <span>
                <LeftOutlined />{' '}
                <span
                  className={
                    this.state.rightColumnSize > 12 ? 'visible' : 'hidden'
                  }
                >
                  <FormattedMessage {...messages.collapse} />
                </span>
              </span>
            )}
          </Button>
        </Col>
      </Row>
    );
  };

  getAppMenuSections(): AppsMenuSection[] {
    const { connectedUser } = this.props;

    const isFromMics =
      connectedUser.workspaces.filter(
        (workspace) => workspace.organisation_id === '1',
      ).length > 0;

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
              name: 'Developer Console',
              icon: (
                <CodeSandboxCircleFilled className="mcs-app_icon mcs-app_icon_developer_console" />
              ),
              url:
                'https://computing-console-mics.francecentral.cloudapp.azure.com/frontprod/login',
            },
          ],
        },
      ];
    } else {
      return [];
    }
  }

  render() {
    const {
      contentComponent: ContentComponent,
      actionBarComponent: ActionBarComponent,
      organisationSelector: OrganisationSelector,
      collapsed,
      mode,
      orgSelectorSize,
      hasFeature,
      userEmail,
      match: {
        params: { organisationId },
      },
    } = this.props;

    const listOrganizationSwitcher = hasFeature('new-navigation-system');

    const onStateChange = (state: State) =>
      this.setState({ isSelectorOpen: state.isOpen });
    const onClick = () => this.setState({ isSelectorOpen: false });

    const appMenuSections: AppsMenuSection[] = this.getAppMenuSections();

    const appMenu =
      appMenuSections.length > 0 ? (
        <AppsMenu
          className="mcs-app-menu-main-layout"
          sections={appMenuSections}
          logo={<Logo mode="inline" />}
        />
      ) : undefined;

    const accounts = buildAccountsMenu(organisationId);
    const settings = buildSettingsButton(organisationId);

    return (
      <div id="mcs-full-page" className="mcs-fullscreen">
        <PushMenu
          pageWrapId={'mcs-main-layout'}
          outerContainerId={'mcs-full-page'}
          isOpen={this.state.isSelectorOpen}
          onStateChange={onStateChange}
          width={orgSelectorSize}
        >
          {this.state.isSelectorOpen && (
            <OrganisationSelector
              size={orgSelectorSize}
              onItemClick={onClick}
            />
          )}
        </PushMenu>
        {hasFeature('new-navigation-system') ? (
          <LayoutId id="mcs-main-layout" className="mcs-fullscreen">
            <McsHeader
              className="mcs-header-main-layout"
              userEmail={userEmail}
              accountContent={accounts}
              headerSettings={settings}
              menu={appMenu}
              devAlert={
                process.env.API_ENV === 'prod'
                  ? ProductionApiEnvironment
                  : undefined
              }
              menuIcon={<AppstoreOutlined className="mcs-header_menu-icon" />}
            />
            <Layout>
              <Sider
                className="mcs-sider"
                collapsible={!listOrganizationSwitcher}
                collapsed={collapsed}
                trigger={this.renderTrigger()}
              >
                <Logo mode={mode} />
                {listOrganizationSwitcher && <OrganisationListSwitcher />}
                <NavigatorMenu
                  mode={mode}
                  onMenuItemClick={this.onMenuItemClick}
                  className="mcs-mainLayout-menu"
                />
              </Sider>
              <Layout>
                {ActionBarComponent ? <ActionBarComponent /> : null}
                {ActionBarComponent ? (
                  <div className="ant-layout">
                    <Content className="mcs-content-container">
                      <ContentComponent />
                    </Content>
                  </div>
                ) : (
                  <ContentComponent />
                )}
              </Layout>
            </Layout>
          </LayoutId>
        ) : (
          <LayoutId id="mcs-main-layout" className="mcs-fullscreen">
            <Sider
              className="mcs-sider"
              collapsible={true}
              collapsed={collapsed}
              trigger={this.renderTrigger()}
            >
              <Logo mode={mode} />
              <NavigatorMenu
                mode={mode}
                onMenuItemClick={this.onMenuItemClick}
                className="mcs-mainLayout-menu"
              />
            </Sider>
            <Layout>
              <NavigatorHeader isInSettings={false} />
              {ActionBarComponent ? <ActionBarComponent /> : null}
              {ActionBarComponent ? (
                <div className="ant-layout">
                  <Content className="mcs-content-container">
                    <ContentComponent />
                  </Content>
                </div>
              ) : (
                <ContentComponent />
              )}
            </Layout>
          </LayoutId>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: MicsReduxState) => ({
  connectedUser: state.session.connectedUser,
  collapsed: state.menu.collapsed,
  mode: state.menu.mode,
  userEmail: state.session.connectedUser.email,
});

const mapDispatchToProps = {
  openCloseMenu: MenuActions.openCloseMenu,
};

export default compose<Props, MainLayoutProps>(
  withRouter,
  injectFeatures,
  connect(mapStateToProps, mapDispatchToProps),
)(MainLayout);

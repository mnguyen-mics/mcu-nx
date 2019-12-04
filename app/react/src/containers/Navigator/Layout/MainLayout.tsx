import * as React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Layout, Icon } from 'antd';
import { connect } from 'react-redux';
import { push as PushMenu, State } from 'react-burger-menu';
import { Row, Col } from 'antd/lib/grid';

import { NavigatorHeader } from '../../../containers/Header';
import { NavigatorMenu } from '../../../containers/Menu';
import { Logo } from '../../../containers/Logo';
import * as MenuActions from '../../../state/Menu/actions';
import { ButtonStyleless } from '../../../components';
import { compose } from 'recompose';
import { MenuMode } from 'antd/lib/menu';
import { MicsReduxState } from '../../../utils/ReduxHelper';

const { Content, Sider } = Layout;

const messages = defineMessages({
  switchOrg: {
    id: 'navigator.layout.mainLayout.sideMenu.switchOrg.label',
    defaultMessage: 'Switch Org.'
  },
  collapse: {
    id: 'navigator.layout.mainLayout.sideMenu.collapse',
    defaultMessage: 'Collapse'
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
  openCloseMenu: (a: { collapsed: boolean, mode: MenuMode }) => void;
}

interface MainLayoutState {
  isSelectorOpen: boolean;
  leftColumnSize: number;
  rightColumnSize: number;
}

type Props = MainLayoutProps & RouteComponentProps<{ organisationId: string }> & MainLayoutStoreProps;

const LayoutId = Layout as any;
const ColAny = Col as any;

// waiting for https://github.com/ant-design/ant-design/commit/518c424ca4a023f3faebce0adf64219989be0018 to be released to remove any

class MainLayout extends React.Component<Props, MainLayoutState> {

  public static defaultProps: Partial<MainLayoutProps & MainLayoutStoreProps> = {
    actionBarComponent: null,
    collapsed: false,
    mode: 'inline'
  }

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
  }

  onMenuItemClick = () => {
    const { collapsed } = this.props;

    if (collapsed === true) {
      this.onCollapse(false);
    }
  }

  renderTrigger = () => {

    const {
      showOrgSelector
    } = this.props;

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
        <ColAny span={this.state.leftColumnSize} className="left" onMouseEnter={resizeBox('left')} onMouseLeave={resizeBox()} >
          <ButtonStyleless onClick={orgSelector} style={{ width: '100%' }}>
            <span><Icon type="bars" /> <span className={this.state.leftColumnSize > 12 && !this.props.collapsed ? 'visible' : 'hidden'}><FormattedMessage {...messages.switchOrg} /></span></span>
          </ButtonStyleless>
        </ColAny>
        <ColAny span={this.state.rightColumnSize} className="right" onMouseEnter={resizeBox('right')} onMouseLeave={resizeBox()}>
          <ButtonStyleless onClick={onCollapse} style={{ width: '100%' }}>
            {this.props.collapsed ? <Icon type="right" /> : <span><Icon type="left" /> <span className={this.state.rightColumnSize > 12 ? 'visible' : 'hidden'}><FormattedMessage {...messages.collapse} /></span></span>}
          </ButtonStyleless>
        </ColAny>
      </Row>
    ) : (
      <Row>
        <Col span={24} className="all">
          <ButtonStyleless onClick={onCollapse} style={{ width: '100%' }} onMouseEnter={resizeBox('right')} onMouseLeave={resizeBox()}>
            {this.props.collapsed ? <Icon type="right" /> : <span><Icon type="left" /> <span className={this.state.rightColumnSize > 12 ? 'visible' : 'hidden'}><FormattedMessage {...messages.collapse} /></span></span>}
          </ButtonStyleless>
        </Col>
      </Row>
    );
  }

  render() {
    const {
      contentComponent: ContentComponent,
      actionBarComponent: ActionBarComponent,
      organisationSelector: OrganisationSelector,
      collapsed,
      mode,
      orgSelectorSize,
    } = this.props;

    const onStateChange = (state: State) => this.setState({ isSelectorOpen: state.isOpen })
    const onClick = () => this.setState({ isSelectorOpen: false })
    return (
      <div id="mcs-full-page" className="mcs-fullscreen">
        <PushMenu
          pageWrapId={'mcs-main-layout'}
          outerContainerId={'mcs-full-page'}
          isOpen={this.state.isSelectorOpen}
          onStateChange={onStateChange}
          width={orgSelectorSize}
        >
          { this.state.isSelectorOpen && <OrganisationSelector size={orgSelectorSize} onItemClick={onClick} /> }
        </PushMenu>

        <LayoutId id="mcs-main-layout" className="mcs-fullscreen">

          <Sider
            style={collapsed ? {} : { overflow: 'auto' }}
            collapsible={true}
            collapsed={collapsed}
            trigger={this.renderTrigger()}
          >
            <Logo mode={mode} />
            <NavigatorMenu
              mode={mode}
              onMenuItemClick={this.onMenuItemClick}
            />
          </Sider>
          <Layout>
            <NavigatorHeader />
            { ActionBarComponent ? <ActionBarComponent /> : null }
            { ActionBarComponent
              ? (
                <div className="ant-layout">
                  <Content className="mcs-content-container">
                    <ContentComponent />
                  </Content>
                </div>
              )
              : <ContentComponent />
            }
          </Layout>

        </LayoutId>
      </div>
    );
  }
}

const mapStateToProps = (state: MicsReduxState) => ({
  collapsed: state.menu.collapsed,
  mode: state.menu.mode,
});

const mapDispatchToProps = {
  openCloseMenu: MenuActions.openCloseMenu,
};


export default compose<Props, MainLayoutProps>(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )
)(MainLayout);

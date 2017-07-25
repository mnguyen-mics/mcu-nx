import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Layout } from 'antd';
import { connect } from 'react-redux';

import { NavigatorHeader } from '../../containers/Header';
import { NavigatorMenu } from '../../containers/Menu';
import { Logo } from '../../containers/Logo';
import * as MenuActions from '../../state/Menu/actions';

const { Content, Sider } = Layout;

class MainLayout extends Component {

  constructor(props) {
    super(props);

    this.onCollapse = this.onCollapse.bind(this);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
  }

  onCollapse(collapsed) {

    const {
      openCloseMenu
    } = this.props;
    openCloseMenu({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline'
    });

    const event = new Event('redraw'); // eslint-disable-line no-undef
    global.window.dispatchEvent(event);
  }

  getActionBar() {
    const { actionBarComponent: ActionBarComponent } = this.props;

    if (ActionBarComponent) return <ActionBarComponent />;
    return null;
  }

  onMenuItemClick() {
    const { collapsed } = this.props;
    if (collapsed === true) {
      this.onCollapse(false);
    }
  }

  render() {

    const { contentComponent: ContentComponent, actionBarComponent: ActionBarComponent, collapsed, mode } = this.props;

    return (
      <Layout id="mcs-main-layout" className="mcs-fullscreen">
        <Sider style={collapsed ? {} : { overflow: 'auto' }} collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <Logo mode={mode} />
          <NavigatorMenu mode={mode} collapsed={collapsed} onMenuItemClick={this.onMenuItemClick} />
        </Sider>
        <Layout>
          <NavigatorHeader />
          { ActionBarComponent ? (
            <div className="ant-layout">
              <ActionBarComponent />
              <Content className="mcs-content-container">
                <ContentComponent />
              </Content>
            </div>
          ) : (
            <ContentComponent />
          ) }
        </Layout>
      </Layout>
    );
  }
}

MainLayout.defaultProps = {
  actionBarComponent: null,
  collapsed: false,
  mode: 'inline',
  openCloseMenu: () => {}
};

MainLayout.propTypes = {
  contentComponent: PropTypes.func.isRequired,
  actionBarComponent: PropTypes.func,
  collapsed: PropTypes.bool,
  mode: PropTypes.string,
  openCloseMenu: PropTypes.func,
};

const mapStateToProps = (state) => ({
  collapsed: state.menu.collapsed,
  mode: state.menu.mode
});

const mapDispatchToProps = {
  openCloseMenu: MenuActions.openCloseMenu
};


MainLayout = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainLayout);

MainLayout = withRouter(MainLayout);

export default MainLayout;


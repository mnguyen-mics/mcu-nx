import { Route, Switch } from 'react-router-dom';
import * as React from "react";
import MainMenu from '../../components/Menu/MainMenu';
import { McsHeader } from '@mediarithmics-private/mcs-components-library';
import Sider from 'antd/lib/layout/Sider';
import Layout from 'antd/lib/layout/layout';
import { Login } from '@mediarithmics-private/advanced-component';

class Main extends React.Component {

  getRouteMapping = () => {
    return
  }
  render() {

    const loginRouteRender = () => {
      return  <Login />
    };
    return <Layout id="mcs-main-layout" className="mcs-fullScreen">
      <McsHeader className="mcs-header-main-layout" userEmail="dev@mediarithmics.com" accountContent={[]} />
      <Layout className="mcs-fullScreen">
        <Sider className="mcs-sider">
          <MainMenu className="mcs-mainLayout-menu" mode={'inline'} onMenuItemClick={() => { }} />
        </Sider>
        <Layout> 
          <Switch>
            <Route path="/login" render={loginRouteRender} />
          </Switch>
        </Layout>
      </Layout>
    </Layout>
  }
}


export default Main

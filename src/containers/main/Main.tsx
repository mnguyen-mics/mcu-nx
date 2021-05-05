import { Route, Switch } from 'react-router-dom';
import * as React from "react";
import routes from '../../routes/routes';
import { NavigatorRoute } from '../../routes/domain';
import MainMenu from '../../components/Menu/MainMenu';
import { McsHeader } from '@mediarithmics-private/mcs-components-library';
import Sider from 'antd/lib/layout/Sider';
import Layout from 'antd/lib/layout/layout';
import { HomePage } from '../home';

class Main extends React.Component {

  getRouteMapping = () => {
    return
  }
  render() {
    return <Layout id="mcs-main-layout" className="mcs-fullScreen">
      <McsHeader className="mcs-header-main-layout" userEmail="dev@mediarithmics.com" accountContent={[]} />
      <Layout className="mcs-fullScreen">
        <Sider className="mcs-sider">
          <MainMenu className="mcs-mainLayout-menu" mode={'inline'} onMenuItemClick={() => { }} />
        </Sider>
        <Layout> 
          <Switch>
            {routes.map((route: NavigatorRoute) => {
              const ElementTag =
                route.layout === 'main'
                  ? route.contentComponent
                  : route.layout === 'edit'
                    ?
                    route.editComponent

                    : route.contentComponent;

              return <Route path={route.path}>
                <ElementTag />
              </Route>
            })}
            <Route exact={true} path="/">
              <HomePage />
            </Route>
          </Switch>
        </Layout>
      </Layout>
    </Layout>


  }
}

export default Main;
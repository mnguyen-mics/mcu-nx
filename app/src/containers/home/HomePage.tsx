import 'reflect-metadata';
import Layout from 'antd/lib/layout/layout';
import * as React from 'react';
import { McsHeader } from '@mediarithmics-private/mcs-components-library';
import { MainMenu } from '../../components/Menu';
import Sider from 'antd/lib/layout/Sider';

class HomePage extends React.Component {
  render() {
    return <Layout id="mcs-main-layout" className="mcs-fullScreen">
      <McsHeader className="mcs-header-main-layout" userEmail="dev@mediarithmics.com" accountContent={[]} />
      <Layout className="mcs-fullScreen">
        <Sider className="mcs-sider">
          <MainMenu className="mcs-mainLayout-menu" mode={'inline'} onMenuItemClick={() => { }} />
        </Sider>
        <Layout>
        </Layout>
      </Layout>
    </Layout>
  }
}

export default HomePage;
import Layout, { Content } from 'antd/lib/layout/layout';
import * as React from 'react';

class HomePage extends React.Component {
  render() {
    return <Layout className="App">
      <Content className="mcs-contentContainer"> 
        <h1>New Computing Console homepage :)</h1>
      </Content>
    </Layout>
  }
}

export default HomePage;
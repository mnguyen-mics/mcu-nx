import * as React from 'react';
import { Layout } from 'antd';
import { compose } from 'recompose';

import FirstPartyRegistriesList from './FirstPartyRegistriesList';
import ThirdPartyRegistriesList from './ThirdPartyRegistriesList';

const { Content } = Layout;

type Props = {};

class DeviceIdRegistriesPage extends React.Component<Props, {}> {
  render() {
    return (
      <Layout className='ant-layout'>
        <Content className='mcs-content-container'>
          <FirstPartyRegistriesList />
          <ThirdPartyRegistriesList />
        </Content>
      </Layout>
    );
  }
}

export default compose<Props, {}>()(DeviceIdRegistriesPage);

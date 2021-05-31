import 'reflect-metadata';
import Layout from 'antd/lib/layout/layout';
import * as React from 'react';
import Sider from 'antd/lib/layout/Sider';
import { TopBar } from '@mediarithmics-private/advanced-component';
import { MainMenu } from '../Menu';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';

interface LayoutManagerProps {
  routeComponent: JSX.Element;
}


interface RouteProps {
  organisationId: string;
}


type Props = LayoutManagerProps & RouteComponentProps<RouteProps>;

class LayoutManager extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const { routeComponent,
      match: {
        params: { organisationId },
      }, } = this.props
    return <Layout id="mcs-main-layout" className="mcs-fullScreen">
      <TopBar organisationId={organisationId} />
      <Layout className="mcs-fullScreen">
        <Sider className="mcs-sider">
          <MainMenu className="mcs-mainLayout-menu" mode={'inline'} onMenuItemClick={() => { }} />
        </Sider>
        <Layout>
          {routeComponent}
        </Layout>
      </Layout>
    </Layout>
  }
}



export default compose<Props, LayoutManagerProps>(
  withRouter,
)(LayoutManager);

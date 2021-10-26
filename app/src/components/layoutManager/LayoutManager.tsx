import 'reflect-metadata';
import Layout from 'antd/lib/layout/layout';
import * as React from 'react';
import Sider from 'antd/lib/layout/Sider';
import { Logo, TopBar } from '@mediarithmics-private/advanced-components';
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
    const {
      routeComponent,
      match: {
        params: { organisationId },
      },
    } = this.props;
    const logoLinkPath = `/o/${organisationId}/home`;
    return (
      <Layout id='mcs-main-layout' className='mcs-fullScreen'>
        <TopBar
          organisationId={organisationId}
          linkPath={logoLinkPath}
          prodEnv={process.env.API_ENV === 'prod'}
        />
        <Layout className='mcs-fullScreen'>
          <Sider className='mcs-sider'>
            <Logo mode={'inline'} linkPath={logoLinkPath} />
            <MainMenu className='mcs-mainLayout-menu' mode={'inline'} />
          </Sider>
          <Layout>{routeComponent}</Layout>
        </Layout>
      </Layout>
    );
  }
}

export default compose<Props, LayoutManagerProps>(withRouter)(LayoutManager);

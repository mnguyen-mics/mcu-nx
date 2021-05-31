import 'reflect-metadata';
import Layout from 'antd/lib/layout/layout';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
interface RouteProps {
  organisationId: string;
}

type Props = RouteComponentProps<RouteProps>

class HomePage extends React.Component<Props> {
  render() {
    const {
      match: {
        params: { organisationId },
      },
    } = this.props;
    return <Layout className="mcs-fullScreen">
      Hello From the homepage :) {organisationId}
    </Layout>
  }
}


export default compose<Props, {}>(
  withRouter
)(HomePage);
import 'reflect-metadata';
import { Layout } from 'antd';
import { Card } from '@mediarithmics-private/mcs-components-library';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
interface RouteProps {
  organisationId: string;
}

type Props = RouteComponentProps<RouteProps>;
const { Content } = Layout;
class HomePage extends React.Component<Props> {
  render() {
    const {
      match: {
        params: { organisationId },
      },
    } = this.props;
    return (
      <div className='ant-layout'>
        <Content className='mcs-content-container'>
          <Card>
            <div>Homepage</div>
            <div>{process.env.API_ENV}</div>
            <div>{`OrganisationId: ${organisationId}`}</div>
          </Card>
        </Content>
      </div>
    );
  }
}

export default compose<Props, {}>(withRouter)(HomePage);

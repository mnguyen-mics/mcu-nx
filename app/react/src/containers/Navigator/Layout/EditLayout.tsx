import * as React from 'react';
import { Layout } from 'antd';
import { NavigatorHeader } from '../../../containers/Header';

interface EditLayoutProps {
  editComponent: React.ComponentType;
}

const EditLayout: React.SFC<EditLayoutProps> = props => {
  const EditComponent = props.editComponent;
  return (
    <Layout className="mcs-fullscreen">
      <NavigatorHeader />
      <EditComponent />
    </Layout>
  );
};

export default EditLayout;

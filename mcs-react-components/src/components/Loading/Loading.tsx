import * as React from 'react';
import { Spin } from 'antd';

export interface LoadingProps {
  className?: string;
}

const Loading: React.SFC<LoadingProps> = props => {

  return (
    <div className={`mcs-centered-container ${props.className}`}>
      <Spin size="large" />
    </div>
  );
};

export default Loading;

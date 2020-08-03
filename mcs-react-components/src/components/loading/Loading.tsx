import * as React from 'react';
import { Spin } from 'antd';

export interface LoadingProps {
  className?: string;
  isFullScreen: boolean;
}

const Loading: React.SFC<LoadingProps> = props => {
  return (
    <Spin
      size="large"
      className={`mcs-loading ${
        props.isFullScreen ? 'loading-full-screen' : ''
      } ${props.className}`}
    />
  );
};

export default Loading;

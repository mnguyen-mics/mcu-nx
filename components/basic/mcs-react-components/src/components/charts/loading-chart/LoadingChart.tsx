import * as React from 'react';
import { Row, Col, Spin } from 'antd';

export interface LoadingChartProps {
  className?: string;
}

const LoadingChart: React.SFC<LoadingChartProps> = ({ className }) => {
  return (
    <Row className={`mcs-loading-chart-no-data ${className ? className : ''}`}>
      <Col span={24}>
        <Spin size='large' />
      </Col>
    </Row>
  );
};

export default LoadingChart;

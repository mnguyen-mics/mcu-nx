import * as React from 'react';
import { Row, Col } from 'antd';

import McsIcon, { McsIconType } from '../../mcs-icon';

export interface EmptyChartProps {
  className?: string;
  title: React.ReactNode;
  icon?: McsIconType;
}

const EmptyChart: React.SFC<EmptyChartProps> = ({ title, icon, className }) => {
  return (
    <Row className={`mcs-empty-chart-no-data ${className ? className : ''}`}>
      <Col span={24} className=''>
        <McsIcon type={icon!} />
      </Col>
      <Col span={24} className=''>
        {title}
      </Col>
    </Row>
  );
};

export default EmptyChart;

import * as React from 'react';
import { Row, Col } from 'antd';

import McsIcon, { McsIconType } from '../mcs-icon';

export interface EmptyChartsProps {
  title: React.ReactNode;
  icon?: McsIconType;
}

const EmptyCharts: React.SFC<EmptyChartsProps> = ({ title, icon }) => {
  return (
    <Row className="mcs-card-no-data">
      <Col span={24} className="">
        <McsIcon type={icon!} />
      </Col>
      <Col span={24} className="">
        {title}
      </Col>
    </Row>
  );
};

export default EmptyCharts;

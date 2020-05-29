import * as React from 'react';
import { Row, Col, Icon } from 'antd';
import McsIcon from '../../../mcs-icon';
import { FormFactor } from '../../../../models/timeline/timeline';

export interface Device {
  brand?: string;
  browser_family?: string;
  browser_version?: string;
  carrier?: string;
  form_factor?: FormFactor;
  model?: string;
  os_family?: string;
  os_version?: string;
  raw_value?: string;
}

export interface DeviceProps {
  vectorId: string;
  device?: Device;
}

const Device = (props: DeviceProps) => {
  const { vectorId, device } = props;

  const formFactorIcon = (f?: FormFactor) => {
    switch (f) {
      case 'TABLET':
        return <McsIcon type="tablet" />;
      case 'SMARTPHONE':
        return <McsIcon type="smartphone" />;
      case 'PERSONAL_COMPUTER':
        return <McsIcon type="laptop" />;
      default:
        return <Icon type="question" />;
    }
  };
  return device && vectorId ? (
    <Row gutter={10} key={vectorId} className="table-line border-top">
      <Col className="table-left" span={12}>
        <span style={{ float: 'left' }}>
          {formFactorIcon(device.form_factor)}
        </span>
        <span style={{ float: 'left' }}>
          <span className="title">{device.browser_family}</span>
          <br />
          <span className="subtitle">{device.os_family}</span>
        </span>
      </Col>
      <Col className="table-right" span={12}>
        <span style={{ float: 'right' }} className="subtitle">
          {vectorId}
        </span>
      </Col>
    </Row>
  ) : null;
};

export default Device;

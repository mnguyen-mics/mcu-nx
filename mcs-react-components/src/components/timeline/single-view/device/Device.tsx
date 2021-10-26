import * as React from 'react';
import { Row, Col } from 'antd';
import { QuestionOutlined } from '@ant-design/icons';
import McsIcon from '../../../mcs-icon';
import { Device as IDevice, FormFactor } from '../../../../models/timeline/timeline';

export interface DeviceProps {
  className?: string;
  vectorId: string;
  device?: IDevice;
}

const Device = (props: DeviceProps) => {
  const { vectorId, device, className } = props;

  const formFactorIcon = (f?: FormFactor) => {
    switch (f) {
      case 'TABLET':
        return <McsIcon type='tablet' />;
      case 'SMARTPHONE':
        return <McsIcon type='smartphone' />;
      case 'PERSONAL_COMPUTER':
        return <McsIcon type='laptop' />;
      default:
        return <QuestionOutlined />;
    }
  };
  return device && vectorId ? (
    <Row
      gutter={10}
      key={vectorId}
      className={`table-line border-top ${className ? className : ''}`}
    >
      <Col className='table-left' span={12}>
        <span style={{ float: 'left' }}>{formFactorIcon(device.form_factor)}</span>
        <span style={{ float: 'left' }}>
          {device.browser_family && (
            <span>
              <span className='title'> {device.browser_family}</span>
              <br />{' '}
            </span>
          )}
          <span className='subtitle'>{device.os_family}</span>
        </span>
      </Col>
      <Col className='table-right' span={12}>
        <span style={{ float: 'right' }} className='subtitle'>
          {vectorId}
        </span>
      </Col>
    </Row>
  ) : null;
};

export default Device;

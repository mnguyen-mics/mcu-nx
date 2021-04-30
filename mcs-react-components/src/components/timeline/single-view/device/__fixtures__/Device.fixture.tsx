import * as React from 'react';
import Device, { DeviceProps } from '../Device';

const props: DeviceProps = {
  vectorId: 'vec:9068495166',
  device: {
    form_factor: 'PERSONAL_COMPUTER',
    os_family: 'LINUX',
    browser_family: 'CHROME',
    browser_version: undefined,
    brand: undefined,
    model: undefined,
    os_version: undefined,
    carrier: undefined,
    raw_value: undefined,
  },
};

export default <Device {...props} />;

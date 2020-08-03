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

const component = (_props: DeviceProps) => <Device {..._props} />;

component.displayName = "Device";

// const component = (_props: DeviceProps) => (
//   <div className="mcs-card">
//     <Device {..._props} />
//   </div>
// );

export default {
  component,
  props,
};

import * as React from 'react';
import Device, { DeviceProps } from '../Device';

const props: DeviceProps = {
  vectorId: 'abc123',
  device: {
    brand: 'apple',
    browser_family: 'safari',
    browser_version: '1.2.3',
    carrier: undefined,
    form_factor: 'SMARTPHONE',
    model: 'pamasl',
    os_family: undefined,
    os_version: undefined,
    raw_value: undefined,
  },
};

const component = (_props: DeviceProps) => <Device {..._props} />;

component.displayName = "Device";

export default {
  component,
  props,
};

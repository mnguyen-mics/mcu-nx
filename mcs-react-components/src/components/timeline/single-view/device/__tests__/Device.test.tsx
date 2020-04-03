import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import Device, { DeviceProps } from '../Device';

it('renders the Device', () => {
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
  const component = TestRenderer.create(
    <Device {...props} />,
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

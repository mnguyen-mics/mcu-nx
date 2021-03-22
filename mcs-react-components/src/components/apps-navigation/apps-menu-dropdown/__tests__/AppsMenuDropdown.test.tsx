import { Divider } from 'antd';
import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import AppsMenuDropdown, { AppsMenuDropdownProps } from '../AppsMenuDropdown';

jest.mock('cuid', () => () => '123');
it('render the AppsMenuDropdown', () => {
  const props: AppsMenuDropdownProps = {
    overlay: <Divider type="vertical" />,
  };

  const component = TestRenderer.create(<AppsMenuDropdown {...props} />);

  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

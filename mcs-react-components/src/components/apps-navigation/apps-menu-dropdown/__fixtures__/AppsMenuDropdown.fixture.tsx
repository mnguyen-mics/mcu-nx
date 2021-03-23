import { Divider } from 'antd';
import * as React from 'react';
import AppsMenuDropdown, { AppsMenuDropdownProps } from '../AppsMenuDropdown';

const props: AppsMenuDropdownProps = {
  overlay: <Divider type="vertical" />,
};

const component = (_props: AppsMenuDropdownProps) => (
  <AppsMenuDropdown {..._props} />
);
component.displayName = 'AppsMenuDropdown';

export default {
  component,
  props,
};

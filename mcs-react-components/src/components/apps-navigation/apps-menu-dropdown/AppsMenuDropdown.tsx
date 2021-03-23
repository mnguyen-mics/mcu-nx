import * as React from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { Dropdown } from '../../popupContainer/PopupContainer';

export interface AppsMenuDropdownProps {
  overlay: React.ReactElement | (() => React.ReactElement);
}

class AppsMenuDropdown extends React.Component<AppsMenuDropdownProps> {
  constructor(props: AppsMenuDropdownProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { overlay } = this.props;
    return (
      <Dropdown overlay={overlay} trigger={['click']}>
        <a>
          <AppstoreOutlined className="menu-icon" />
        </a>
      </Dropdown>
    );
  }
}

export default AppsMenuDropdown;

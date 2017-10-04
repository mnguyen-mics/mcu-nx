import * as React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Dropdown, Menu } from 'antd';
import { MenuProps } from 'antd/lib/menu'

import McsIcons from './McsIcons';

export interface DropdownButtonItemProps {
  id: string;
  message: FormattedMessage.MessageDescriptor;
  onClick: Function;
}

export interface DropdownButtonProps {
  items: DropdownButtonItemProps[];
}


class DropdownButton extends React.Component<DropdownButtonProps> {

  render() {
    const { items } = this.props;

    const displayOptions = items.map((item) => (
      <Menu.Item key={item.id}>
        <FormattedMessage {...item.message} />
      </Menu.Item>
    ));

    const handleClick = (e) => {
      const currentItem = items.find(item => item.id === e.key);
      // const currentItem = items.filter(item => item.id === e.key);

      currentItem.onClick();
    };

    const overlay = (
      <Menu className="mcs-dropdown-actions" onClick={handleClick}>
        { displayOptions }
      </Menu>
    );

    return (
      <Dropdown
        overlay={overlay}
        trigger={['click']}
      >
        <Button>
          <McsIcons type="pen" />
          <McsIcons type="chevron" />
        </Button>
      </Dropdown>
    );
  }
}

export default DropdownButton;


import * as React from 'react';
import { CheckOutlined } from '@ant-design/icons';
import { Menu, Button } from 'antd';
import { MenuInfo } from '../../../node_modules/rc-menu/lib/interface';
import SubMenu from 'antd/lib/menu/SubMenu';
import { Dropdown } from '../popupContainer/PopupContainer';

export interface MultiSelectProps<T> {
  displayElement: JSX.Element;
  items: T[];
  subItems?: T[];
  subItemsTitle?: string;
  selectedItems: T[];
  display?: (t: T) => React.ReactNode;
  getKey: (t: T) => string;
  handleItemClick?: (item: T) => void;
  handleMenuClick?: (selectedItems: T[]) => void;
  onCloseMenu?: (selectedItems: T[]) => void;
  singleSelectOnly?: boolean;
  buttonClass?: string;
}

export interface MultiSelectState<T> {
  overlayVisible: boolean;
}

class MultiSelect<T> extends React.Component<MultiSelectProps<T>, MultiSelectState<T>> {
  static defaultProps: Partial<MultiSelectProps<any>> = {
    buttonClass: '',
    display: t => t.toString(),
  };

  state = {
    overlayVisible: false,
  };

  buildMenuItems = () => {
    const { items, display, getKey, subItems, subItemsTitle } = this.props;
    const selectedItems = this.props.selectedItems;
    const renderItems = (elements: T[]) => {
      return elements.map(element => {
        const isItemSelected =
          selectedItems.findIndex(selectedItem => getKey(selectedItem) === getKey(element)) !== -1;
        return (
          <Menu.Item key={getKey(element)}>
            {isItemSelected && <CheckOutlined />}
            <span>{display!(element)}</span>
          </Menu.Item>
        );
      });
    };
    return (
      <Menu onClick={this.onMenuClick}>
        {renderItems(items)}
        {subItems && subItemsTitle && (
          <SubMenu title={subItemsTitle}>{renderItems(subItems)}</SubMenu>
        )}
      </Menu>
    );
  };

  handleVisibleChange = (isVisible: boolean) => {
    this.setVisibility(isVisible);

    if (!isVisible && this.props.onCloseMenu) {
      this.props.onCloseMenu(this.props.selectedItems);
    }
  };

  onMenuClick = (param: MenuInfo) => {
    const { items, handleMenuClick, getKey, handleItemClick, singleSelectOnly, subItems } =
      this.props;
    const { selectedItems } = this.props;

    const allItems = subItems ? items.concat(subItems) : items;

    const clickedItem = allItems.find(item => getKey(item) === param.key);

    // Add or remove item on selectedItems
    let newArray: T[] = [];
    const index = selectedItems!.findIndex(
      selectedItem => getKey(selectedItem) === getKey(clickedItem!),
    );

    if (index !== -1) {
      newArray = singleSelectOnly
        ? []
        : [...selectedItems.slice(0, index), ...selectedItems.slice(index + 1)];
    } else {
      newArray = singleSelectOnly ? [clickedItem!] : [...selectedItems, clickedItem!];
    }

    if (handleMenuClick) {
      handleMenuClick(newArray);
    }
    if (handleItemClick) {
      handleItemClick(clickedItem!);
    }
  };

  setVisibility(isVisible: boolean) {
    this.setState({
      overlayVisible: isVisible,
    });
  }

  render() {
    const { displayElement, buttonClass } = this.props;
    const { overlayVisible } = this.state;
    const menu = this.buildMenuItems();

    return (
      <Dropdown
        overlay={menu}
        trigger={['click']}
        onVisibleChange={this.handleVisibleChange}
        visible={overlayVisible}
      >
        <Button className={buttonClass}>{displayElement}</Button>
      </Dropdown>
    );
  }
}

export default MultiSelect;

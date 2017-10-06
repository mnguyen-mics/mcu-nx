import * as React from 'react';
import { Icon, Dropdown, Menu, Button } from 'antd';



interface Item {
  key: string;
  value: string;
}
interface MenuItem {
  handleMenuClick?: (obj: { [name: string]: object[] }) => void;
  selectedItems?: Item[];
  items: Item[];
}
export interface MultiSelectProps {
  name: string;
  displayElement: JSX.Element;
  onCloseMenu?: (selectedItems: object[]) => void;
  menuItems: MenuItem;
  buttonClass?: string;
}

interface MultiSelectState {
  selectedItems: Item[];
  overlayVisible: boolean;
}

class MultiSelect extends React.Component<MultiSelectProps, MultiSelectState> {

  static defaultprops: Partial<MultiSelectProps> = {
    buttonClass: '',
    onCloseMenu: () => {},
  }

  state = {
    overlayVisible: false,
    selectedItems: this.props.menuItems.selectedItems,
  }

  buildMenuItems = () => {
    const { menuItems: { items } } = this.props;
    const { selectedItems } = this.state;
    const getItem = value => items.find(item => item.value === value);

    return (
      <Menu onClick={value => this.onMenuClick(getItem(value.key))}>
        { items.map(item => {
          const isItemSelected = selectedItems.find(selectedItem => selectedItem.value === item.value);
          return (
            <Menu.Item key={item.value}>
              {isItemSelected && (<Icon type="check" />)}
              <span>{item.key}</span>
            </Menu.Item>
          );
        })}
      </Menu>
    );

  }

  handleVisibleChange = (isVisible) => {
    this.setVisibility(isVisible);

    if (!isVisible) {
      this.props.onCloseMenu(this.state.selectedItems);
    }
  }

  onMenuClick = (item) => {
    const { name, menuItems: { handleMenuClick } } = this.props;
    const { selectedItems } = this.state;

    // Add or remove item on selectedItems
    let newArray = [];
    const index = selectedItems.findIndex(selectedItem => selectedItem.value === item.value);

    if (index !== -1) {
      newArray = [
        ...selectedItems.slice(0, index),
        ...selectedItems.slice(index + 1),
      ];
    } else {
      newArray = [
        ...selectedItems,
        item,
      ];
    }

    this.setState({ selectedItems: newArray });

    if (typeof handleMenuClick === 'function') {
      handleMenuClick({
        [name]: newArray,
      });
    }
  }

  setVisibility(isVisible) {
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
        <Button className={buttonClass}>
          { displayElement }
        </Button>
      </Dropdown>
    );

  }
}

export default MultiSelect;


import * as React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Checkbox, Menu } from 'antd';
import Input from 'antd/lib/input/Input';
import { MenuInfo } from '../../../node_modules/rc-menu/lib/interface';
import { Dropdown } from '../popupContainer/PopupContainer';

export interface MenuItemProps {
  key: string;
  label: string;
}

export interface SearchAndMultiSelectProps {
  onClick: (elementKey: string) => void;
  placeholder?: string;
  datasource: MenuItemProps[];
  value: string[];
  loading?: boolean;
  onSearch?: (keywords: string) => void;
}

interface SearchAndMultiSelectState {
  inputValue?: string;
  dropdownVisibility: boolean;
}

// TODO handle loading in case of async external search
export default class SearchAndMultiSelect extends React.Component<
  SearchAndMultiSelectProps,
  SearchAndMultiSelectState
> {
  constructor(props: SearchAndMultiSelectProps) {
    super(props);
    this.state = { dropdownVisibility: false };
  }

  search = (keywords: string): MenuItemProps[] => {
    const { datasource } = this.props;
    return datasource.filter(
      item =>
        !keywords || item.label.toLowerCase().includes(keywords.toLowerCase()),
    );
  };

  handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onSearch } = this.props;
    const keywords = e.target.value;
    if (onSearch) {
      // handle search externaly
      onSearch(keywords);
    } else {
      // handle search internaly by setting input value in state
      this.setState({
        inputValue: keywords,
      });
    }
  };

  handleVisibleChange = (visible?: boolean) => {
    this.setState({ dropdownVisibility: !!visible });
  };

  isChecked = (key: string) => {
    const { value } = this.props;
    return !!value.find(v => v === key);
  };

  handleOnClick = (param: MenuInfo) => {
    this.props.onClick(param.key.toString());
  };

  render() {
    const { placeholder, datasource } = this.props;
    const { inputValue, dropdownVisibility } = this.state;
    const prefixCls = 'mcs-search-multi-select';

    // if inputValue is defined, search is handled internaly
    const menuItems = (inputValue ? this.search(inputValue) : datasource).map(
      item => {
        return (
          <Menu.Item key={item.key}>
            <span>{item.label}</span>
            <Checkbox
              className={`${prefixCls}_checkbox`}
              checked={this.isChecked(item.key)}
            />
          </Menu.Item>
        );
      },
    );

    const menu = (
      <Menu
        className={`${prefixCls}_menu`}
        onClick={this.handleOnClick}
      >
        {menuItems}
      </Menu>
    );

    return (
      <Dropdown
        className={prefixCls}
        overlay={menu}
        trigger={['click']}
        visible={dropdownVisibility}
        onVisibleChange={this.handleVisibleChange}
        placement="bottomLeft"
      >
        <Input
          placeholder={placeholder}
          suffix={<DownOutlined />}
          onChange={this.handleOnChange}
        />
      </Dropdown>
    );
  }
}

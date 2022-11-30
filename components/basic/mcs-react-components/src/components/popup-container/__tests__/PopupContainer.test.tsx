import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import { DownOutlined } from '@ant-design/icons';
import { Button, Menu, Select as AntdSelect, Divider } from 'antd';
import { DatePicker, Dropdown, Popover, Select } from '../PopupContainer';

const menu = (
  <Menu>
    <Menu.Item>
      <a target='_blank' rel='noopener noreferrer' href='https://www.mediarithmics.com'>
        1st menu item
      </a>
    </Menu.Item>
    <Menu.Item icon={<DownOutlined />} disabled={true}>
      <a target='_blank' rel='noopener noreferrer' href='https://www.mediarithmics.com'>
        2nd menu item (disabled)
      </a>
    </Menu.Item>
    <Menu.Item disabled={true}>
      <a target='_blank' rel='noopener noreferrer' href='https://www.mediarithmics.com'>
        3rd menu item (disabled)
      </a>
    </Menu.Item>
    <Menu.Item danger={true}>a danger item</Menu.Item>
  </Menu>
);

const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

const { Option } = AntdSelect;

const preventDefault = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => e.preventDefault();

const TestedComponent = () => {
  return (
    <div>
      <h1>DatePicker</h1>
      <DatePicker />
      <Divider />
      <h1>Dropdown</h1>
      <Dropdown overlay={menu}>
        <a className='ant-dropdown-link' onClick={preventDefault}>
          Hover me <DownOutlined />
        </a>
      </Dropdown>
      <Divider />
      <h1>Popover</h1>
      <Popover content={content} title='Title'>
        <Button type='primary'>Hover me</Button>
      </Popover>
      <Divider />
      <h1>Select</h1>
      <Select defaultValue='lucy' style={{ width: 120 }}>
        <Option value='jack'>Jack</Option>
        <Option value='lucy'>Lucy</Option>
        <Option value='disabled' disabled={true}>
          Disabled
        </Option>
        <Option value='Yiminghe'>yiminghe</Option>
      </Select>
    </div>
  );
};

it('renders PopContainer components', () => {
  const component = TestRenderer.create(<TestedComponent />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

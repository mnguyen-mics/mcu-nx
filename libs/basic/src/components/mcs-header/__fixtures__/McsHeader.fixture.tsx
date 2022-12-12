import { Alert, Menu } from 'antd';
import React from 'react';
import McsIcon from '../../mcs-icon';
import McsHeader, { McsHeaderProps } from '../McsHeader';

const props: McsHeaderProps = {
  userEmail: 'toto@mix.com',
  devAlert: (
    <Alert
      style={{
        display: 'flex',
        margin: 'auto',
        marginRight: 0,
        borderColor: 'red',
      }}
      message='You are using production API environment !'
      type='error'
      showIcon={true}
    />
  ),
  headerSettings: (
    <a>
      <McsIcon type='options' className='mcs-header-menu-icon' style={{ display: 'flex' }} />
    </a>
  ),
  menu: (
    <Menu>
      <Menu.Item>Completely optionnal</Menu.Item>
      <Menu.Item>Really optionnal</Menu.Item>
    </Menu>
  ),
  className: 'fake-class-name',
  /* tslint:disable */
  accountContent: [<div>Account Menu #1</div>, <div>Account Menu #2</div>],
  /* tslint:enable */
};

export default <McsHeader {...props} />;

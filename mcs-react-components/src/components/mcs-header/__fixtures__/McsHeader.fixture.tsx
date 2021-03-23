import { Alert, Menu } from 'antd';
import * as React from 'react';
import McsIcon from '../../mcs-icon';
import McsHeader, { McsHeaderProps } from '../McsHeader';

const props: McsHeaderProps = {
  headerTitle: 'Mediarithmics New App',
  userEmail: 'toto@mix.com',
  devAlert: (
    <Alert
      style={{
        display: 'flex',
        margin: 'auto',
        marginRight: 0,
        borderColor: 'red',
      }}
      message="You are using production API environment !"
      type="error"
      showIcon={true}
    />
  ),
  headerSettings: (
    <a>
      <McsIcon
        type="options"
        className="mcs-header-menu-icon"
        style={{ display: 'flex' }}
      />
    </a>
  ),
  menu: (
    <Menu>
      <Menu.Item>Completely optionnal</Menu.Item>
      <Menu.Item>Really optionnal</Menu.Item>
    </Menu>
  ),
  /* tslint:disable */
  accountContent: [<div>Account Menu #1</div>, <div>Account Menu #2</div>],
  /* tslint:enable */
};

const component = (_props: McsHeaderProps) => <McsHeader {..._props} />;

component.displayName = 'McsHeader';

export default {
  component,
  props,
};

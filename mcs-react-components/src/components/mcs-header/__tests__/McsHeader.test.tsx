import { Alert, Menu } from 'antd';
import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import McsIcon from '../../mcs-icon';
import McsHeader, { McsHeaderProps } from '../McsHeader';

it('renders the Error component', () => {
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

  const component = TestRenderer.create(<McsHeader {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

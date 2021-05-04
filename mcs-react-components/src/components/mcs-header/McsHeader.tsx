import * as React from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { Layout, Menu, Dropdown } from 'antd';
import McsIcon from '../mcs-icon';

const { Header } = Layout;

export interface McsHeaderProps {
  menu?: React.ReactElement;
  menuIcon?: React.ReactElement;
  userEmail: string;
  accountContent: React.ReactNode[];
  headerSettings?: React.ReactNode;
  devAlert?: React.ReactNode;
  className?: string;
  organisationSwitcher?: React.ReactNode;
}

class McsHeader extends React.Component<McsHeaderProps> {
  render() {
    const {
      menu,
      userEmail,
      accountContent,
      headerSettings,
      devAlert,
      menuIcon,
      className,
      organisationSwitcher
    } = this.props;

    const accountMenu = (
      <Menu>
        <Menu.Item key="email" disabled={true}>
          {userEmail}
        </Menu.Item>
        {accountContent.length > 0 && <Menu.Divider />}
        {accountContent.map((item, index) => {
          return <Menu.Item key={index}>{item}</Menu.Item>;
        })}
      </Menu>
    );

    return (
      <Header className={`mcs-header ${className ? className : ''}`}>
        <div className="mcs-header_wrapper">
          <span className="mcs-header_leftComponent">
           {organisationSwitcher}
          </span>
          {devAlert}
        </div>
        <div className="mcs-header_actions">
          {menu && (
              <span className="mcs-header_actions_appLauncher">
                <Dropdown overlay={menu} trigger={['click']}>
                  <a>
                    {menuIcon ? (
                      menuIcon
                    ) : (
                      <AppstoreOutlined className="mcs-header_menuIcon" />
                    )}
                  </a>
                </Dropdown>
              </span>
            )}
          {headerSettings && (
            <div className="mcs-header_actions_settings mcs-header_menuIcon">{headerSettings}</div>
          )}
          <div className="mcs-header_actions_account">
            <Dropdown
              overlay={accountMenu}
              trigger={['click']}
              placement="bottomRight"
            >
              <a>
                <McsIcon type="user" className="mcs-header_menuIcon" />
              </a>
            </Dropdown>
          </div>
        </div>
      </Header>
    );
  }
}

export default McsHeader;

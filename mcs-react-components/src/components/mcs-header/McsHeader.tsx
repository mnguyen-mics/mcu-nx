import * as React from 'react';
import { AppstoreFilled } from '@ant-design/icons';
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
      <Header className="mcs-header">
        <div className="mcs-header-wrapper">
          <span className="mcs-header-left-component">
            {menu && (
              <span className="mcs-header-wrapper-launcher">
                <Dropdown overlay={menu} trigger={['click']}>
                  <a>
                    {menuIcon ? (
                      menuIcon
                    ) : (
                      <AppstoreFilled className="mcs-header-menu-icon" />
                    )}
                  </a>
                </Dropdown>
              </span>
            )}
          </span>
          {devAlert}
        </div>
        <div className="mcs-header-actions">
          {headerSettings && (
            <div className="mcs-header-actions-settings">{headerSettings}</div>
          )}
          <div className="mcs-header-actions-account">
            <Dropdown
              overlay={accountMenu}
              trigger={['click']}
              placement="bottomRight"
            >
              <a>
                <McsIcon type="user" className="mcs-header-menu-icon" />
              </a>
            </Dropdown>
          </div>
        </div>
      </Header>
    );
  }
}

export default McsHeader;

import * as React from 'react';
import { Menu } from 'antd';

import CompassFilled from '@ant-design/icons/lib/icons/CompassFilled';
import CodeSandboxCircleFilled from '@ant-design/icons/lib/icons/CodeSandboxCircleFilled';

export interface AppsMenuProps {
  availableAppUrlsMap: Map<AppMenuOption, string>;
  logo: React.ReactElement;
}

export type AppMenuOption =
  | 'NAVIGATOR'
  | 'DEVELOPER_CONSOLE'
  | 'PLATFORM_ADMIN';

const userAppList: AppMenuOption[] = ['DEVELOPER_CONSOLE', 'NAVIGATOR'];
const adminAppList: AppMenuOption[] = ['PLATFORM_ADMIN'];

class AppsMenu extends React.Component<AppsMenuProps> {
  constructor(props: AppsMenuProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { availableAppUrlsMap, logo } = this.props;

    const userAppsToDisplay: AppMenuOption[] = Array.from(
      availableAppUrlsMap.keys(),
    ).filter((item) => userAppList.includes(item));

    const adminAppsToDisplay: AppMenuOption[] = Array.from(
      availableAppUrlsMap.keys(),
    ).filter((item) => adminAppList.includes(item));

    return (
      <Menu mode="inline" className="mcs-app_dropdown_menu">
        {logo}

        {adminAppsToDisplay.length > 0 && <Menu.Divider />}

        {adminAppsToDisplay.includes('PLATFORM_ADMIN') && (
          <Menu.Item>
            <a href={availableAppUrlsMap.get('PLATFORM_ADMIN')}>
            <span>Platform Admin</span>
            </a>
          </Menu.Item>
        )}

        {userAppsToDisplay.length > 0 && <Menu.Divider />}

        {userAppsToDisplay.includes('NAVIGATOR') && (
          <Menu.Item
            icon={
              <CompassFilled className="mcs-app_icon mcs-app_icon_navigator" />
            }
          >
            <a href={availableAppUrlsMap.get('NAVIGATOR')}>
              <span>Navigator</span>
            </a>
          </Menu.Item>
        )}

        {userAppsToDisplay.includes('DEVELOPER_CONSOLE') && (
          <Menu.Item
            icon={
              <CodeSandboxCircleFilled className="mcs-app_icon mcs-app_icon_developer_console" />
            }
          >
            <a href={availableAppUrlsMap.get('DEVELOPER_CONSOLE')}>
              <span>Developer Console</span> 
            </a>
          </Menu.Item>
        )}
      </Menu>
    );
  }
}

export default AppsMenu;

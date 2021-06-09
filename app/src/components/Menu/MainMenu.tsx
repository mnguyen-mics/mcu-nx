import * as React from 'react';
import { Link, withRouter, matchPath } from 'react-router-dom';
import { Menu } from 'antd';
import { menuDefinitions } from '../../routes/menuDefinition';
import { compose } from 'recompose';
import { RouteComponentProps } from 'react-router';
import { MenuMode } from 'antd/lib/menu';
import { NavigatorMenuDefinition, NavigatorSubMenuDefinition } from '../../routes/domain';
import { McsIcon, MentionTag } from '@mediarithmics-private/mcs-components-library';

const { SubMenu } = Menu;

const basePath = '/o/:organisationId(\\d+)';

export interface MenuInfo {
  key: React.Key;
  keyPath: React.Key[];
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement>;
}
export interface NavigatorMenuProps {
  mode: MenuMode;
  className?: string;
}

interface RouteProps {
  organisationId: string;
}

type Props = NavigatorMenuProps & RouteComponentProps<RouteProps>;

interface NavigatorMenuState {
  inlineOpenKeys: string[];
  vecticalOpenKeys: string[];
}

class MainMenu extends React.Component<Props, NavigatorMenuState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      inlineOpenKeys: [],
      vecticalOpenKeys: [],
    };
  }

  componentDidMount() {
    const {
      location: { pathname },
    } = this.props;
    this.checkInitialState(pathname);
  }

  componentDidUpdate(previousProps: Props) {
    const {
      location: { pathname: previousPathname },
    } = previousProps;
    const {
      location: { pathname },
    } = this.props;

    if (pathname !== previousPathname) {
      this.checkInitialState(pathname);
    }
  }

  checkInitialState = (pathname: string) => {
    const currentOpenSubMenu = menuDefinitions
      .filter(item => item.type === 'multi' && item.subMenuItems && item.subMenuItems.length > 0)
      .find(
        item =>
          item.type === 'multi' &&
          item.subMenuItems.reduce((acc: boolean, val) => {
            return matchPath(pathname, {
              path: `${basePath}${val.path}`,
              exact: false,
              strict: false,
            })
              ? true
              : acc;
          }, false),
      );

    if (currentOpenSubMenu) this.setState({ inlineOpenKeys: [currentOpenSubMenu.iconType] });
  };

  onOpenChange = (openKeys: string[]) => {
    const state = this.state;
    const { mode } = this.props;

    if (mode === 'inline') {
      const latestOpenKey = openKeys.find(key => !(state.inlineOpenKeys.indexOf(key) > -1));
      let nextOpenKeys: string[] = [];
      if (latestOpenKey) {
        nextOpenKeys = [latestOpenKey];
      }

      this.setState({ inlineOpenKeys: nextOpenKeys });
    } else {
      this.setState({ vecticalOpenKeys: openKeys });
    }
  };

  onClick = (e: MenuInfo) => {
    const hasClickOnFirstLevelMenuItem = menuDefinitions.find(item => item.iconType === e.key);
    if (hasClickOnFirstLevelMenuItem) this.setState({ inlineOpenKeys: [] });
  };

  getAvailableItems = (): NavigatorMenuDefinition[] => {
    return menuDefinitions.reduce((acc, item) => {
      if (item.type === 'multi') {
        const subMenuItems = item.subMenuItems || [];
        return [...acc, { ...item, subMenuItems }];
      }
      return [...acc, { ...item }] as any;
    }, []);
  };

  buildItems = () => {
    const {
      match: {
        params: { organisationId },
      },
    } = this.props;

    const baseUrl = `/o/${organisationId}`;

    return this.getAvailableItems().map(itemDef => {
      if (itemDef.type === 'multi') {
        const onTitleClick = () => {
          this.setState({ inlineOpenKeys: [itemDef.iconType] });
        };
        return (
          <SubMenu
            key={itemDef.iconType}
            onTitleClick={onTitleClick}
            title={
              <span>
                <McsIcon type={itemDef.iconType} />
                {itemDef.mention && (
                  <MentionTag
                    mention={itemDef.mention}
                    className='mcs-menuMentionTag mcs-menuMentionTag--west'
                  />
                )}
                <span className='nav-text'>{itemDef.displayName}</span>
              </span>
            }
            className={`mcs-sideBar-subMenu_${itemDef.displayName}`}
          >
            {itemDef.subMenuItems.map((subMenuItem: NavigatorSubMenuDefinition) => {
              let linkUrl = `${baseUrl}${subMenuItem.path}`;
              if (subMenuItem.legacyPath) {
                if (subMenuItem.requireDatamart) {
                  linkUrl = subMenuItem.path;
                } else {
                  linkUrl = `/${organisationId}${subMenuItem.path}`;
                }
              }
              return (
                <Menu.Item
                  key={subMenuItem.path}
                  className={`mcs-sideBar-subMenuItem_${subMenuItem.displayName}`}
                >
                  {subMenuItem.mention && (
                    <MentionTag
                      mention={subMenuItem.mention}
                      className='mcs-menuMentionTag mcs-menuMentionTag--east'
                    />
                  )}
                  <Link to={linkUrl}>subMenuItem.displayName</Link>
                </Menu.Item>
              );
            })}
          </SubMenu>
        );
      }

      return (
        <Menu.Item key={itemDef.iconType}>
          <Link to={`${baseUrl}${itemDef.path}`}>
            <McsIcon type={itemDef.iconType} />
            <span className='nav-text'>{itemDef.displayName}</span>
          </Link>
        </Menu.Item>
      );
    });
  };

  getAllKeysWithPath = (): Array<{
    path: string;
    key: string;
    mainKey: string;
  }> => {
    return this.getAvailableItems().reduce((acc, item) => {
      let subMenuKeys;
      if (item.type === 'multi') {
        subMenuKeys = item.subMenuItems.reduce(
          (subAcc: any, subItem: NavigatorSubMenuDefinition) => {
            return [
              ...subAcc,
              {
                key: subItem.path,
                path: subItem.path,
                mainKey: item.iconType,
              },
            ];
          },
          [],
        );
        return [...acc, ...subMenuKeys];
      } else {
        return [
          ...acc,
          {
            key: item.iconType,
            path: item.path,
            mainKey: item.iconType,
          },
        ] as any;
      }
    }, []);
  };

  render() {
    const {
      mode,
      location: { pathname },
    } = this.props;

    const getSelectedKeys = (): string[] => {
      const currentItem = this.getAllKeysWithPath().find(item => {
        const matched = matchPath(pathname, {
          path: `${basePath}${item.path}`,
        });
        return !!matched; // && matched.isExact;
      });
      return currentItem ? [currentItem.key] : [];
    };

    const getOpenKeysInMode = () => {
      if (mode === 'inline') return this.state.inlineOpenKeys;
      return this.state.vecticalOpenKeys;
    };

    return (
      <Menu
        mode={mode}
        selectedKeys={getSelectedKeys()}
        openKeys={getOpenKeysInMode()}
        onOpenChange={this.onOpenChange as any}
        onClick={this.onClick}
        className={`mcs-asideMenu ${this.props.className}`}
      >
        {this.buildItems()}
      </Menu>
    );
  }
}

export default compose<Props, NavigatorMenuProps>(withRouter)(MainMenu);

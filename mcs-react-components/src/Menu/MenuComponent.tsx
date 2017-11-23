import * as React  from 'react';
import { Link, withRouter, matchPath } from 'react-router-dom';
import {RouteComponentProps} from 'react-router';
import { Menu } from 'antd';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import McsIcons from '../McsIcons';
import { MenuItem } from '../Menu';
import { flatten } from '../utils/Tree';
import {ClickParam, MenuProps} from "antd/lib/menu";
// import {LayoutMode} from '../Layout/View';
import {compose} from 'recompose';

const { SubMenu } = Menu;

export interface McsMenuProps extends MenuProps{
  mode: 'vertical' | 'horizontal' | 'inline',
  collapsed:boolean,
  onMenuItemClick: () => void,
  items: MenuItem[]
}

type McsMenuProvidedProps =
  RouteComponentProps<MenuItem> &
  McsMenuProps &
  InjectedIntlProps;

interface MenuState {
  inlineOpenKeys: any[],
  vecticalOpenKeys:any[]
}

class McsMenu extends React.Component<McsMenuProvidedProps, MenuState> {

  flatMenuCache: MenuItem[] = [];

  constructor(props : McsMenuProvidedProps) {
    super(props);
    this.state = {
      inlineOpenKeys: [],
      vecticalOpenKeys: [],
    };

    this.flatMenuCache = flatten(props.items);
  }


  componentDidMount() {
    const {
      location,
      items
     } = this.props;

    const currentOpenSubMenu = items
      .filter((item : MenuItem ) => item.children && item.children.length > 0)
      .find((item : MenuItem ) => {
        const res = matchPath(location!.pathname, { path: item.path });
        return !!(res && res.isExact);
      });

    if (currentOpenSubMenu) this.setState({ inlineOpenKeys: [currentOpenSubMenu.key] }); // eslint-disable-line react/no-did-mount-set-state
  }

  onOpenChange = (openKeys: string[]) => {
    const state = this.state;
    const {
      mode,
    } = this.props;

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

  onClick = ({ key } : ClickParam) => {
    const hasClickOnFirstLevelMenuItem = this.props.items.find(item => item.key === key);
    if (hasClickOnFirstLevelMenuItem) this.setState({ inlineOpenKeys: [] });
  };



  buildItems() {
    const {
      collapsed,
      intl
    } = this.props;

    const makeTitle = (item : MenuItem) => {
      const text = <span className="nav-text">{intl.formatMessage(item.name)}</span>;
      if(item.iconType)
        return <span><McsIcons type={item.iconType} />{text}</span>;

      return text;
    };


    return this.props.items.map(itemDef => {
      const buildSubMenu = itemDef.children && itemDef.children.length > 0;
      if (buildSubMenu) {
        return (
          <SubMenu
            key={itemDef.key}
            onTitleClick={() => { this.setState({ inlineOpenKeys: [itemDef.key] }); this.props.onMenuItemClick(); }}
            title={makeTitle(itemDef)}>
            {
              itemDef.children!.map(subMenuItem => {

                return (
                  <Menu.Item style={collapsed === true ? { display: 'none' } : { display: 'block' }} key={subMenuItem.key}>
                          <Link to={subMenuItem.path}>{intl.formatMessage(subMenuItem.name)}</Link>
                  </Menu.Item>);
              })
            }
          </SubMenu>
        );
      }

      return (<Menu.Item key={itemDef.key}>
                  <Link to={itemDef.path}>
                    { makeTitle(itemDef) }
                  </Link>
              </Menu.Item>);
    });
  }

  render() {

    const {
      mode,
      location,
    } = this.props;

    const getSelectedKeys = () : string[] => {
      const currentItem = this.flatMenuCache.find( (item : MenuItem) => {
        const matched = matchPath(location!.pathname, { path: item.path });
        return matched && matched.isExact || false;
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
        onOpenChange={this.onOpenChange}
        onClick={this.onClick}
      >
        { this.buildItems() }
      </Menu>
    );
  }
}

export default compose<McsMenuProvidedProps, McsMenuProps>(
  withRouter,
  injectIntl,
)(McsMenu);



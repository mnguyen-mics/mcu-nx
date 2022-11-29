import * as React from 'react';
import { Tabs } from 'antd';
import { TabsProps } from 'antd/lib/tabs';
import classNames from 'classnames';

export interface McsTabsItem {
  className?: string;
  title: React.ReactChild;
  display?: JSX.Element;
  forceRender?: boolean;
  key?: string;
}

export interface McTabsProps extends TabsProps {
  items: McsTabsItem[];
  isCard?: boolean;
}

class McsTabs extends React.Component<McTabsProps> {
  buildMenuItems() {
    const { items } = this.props;

    return items.map((item, index) => (
      <Tabs.TabPane
        tab={
          <div className={classNames(`mcs-tabs_tab mcs-tabs_${item.key}`, item.className)}>
            {item.title}
          </div>
        }
        key={item.key || index}
        forceRender={item.forceRender ? item.forceRender : false}
      >
        {item.display}
      </Tabs.TabPane>
    ));
  }

  render() {
    const { items, animated, ...rest } = this.props;
    const menuItems = this.buildMenuItems();

    return (
      <div>
        <Tabs
          className='mcs-tabs'
          defaultActiveKey={items[0] ? items[0].key || '0' : '0'}
          animated={animated !== undefined ? animated : true}
          {...rest}
        >
          {menuItems}
        </Tabs>
      </div>
    );
  }
}

export default McsTabs;

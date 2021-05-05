import * as React from 'react';
import { Tabs } from 'antd';
import { TabsProps } from 'antd/lib/tabs';

interface McsTabsItem {
  title: string;
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
        tab={<div className='mcs-tabs'>{item.title}</div>}
        key={item.key || item.title}
        forceRender={item.forceRender ? item.forceRender : false}
      >
        {item.display}
      </Tabs.TabPane>
    ));
  }

  render() {
    const { items, ...rest } = this.props;
    const menuItems = this.buildMenuItems();

    return (
      <div>
        <Tabs defaultActiveKey={items[0].title} {...rest} animated={true}>
          {menuItems}
        </Tabs>
      </div>
    );
  }
}

export default McsTabs;

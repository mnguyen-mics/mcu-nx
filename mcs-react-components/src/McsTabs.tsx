import * as React from 'react';
import { Tabs } from 'antd';

export interface McsPane{
    title: string;
    display?: React.ReactNode;
    forceRender?: boolean;
}

export interface McTabsProps {
  items: Array<McsPane>;
  isCard?: boolean;
}

class McsTabs extends React.Component<McTabsProps> {

  static defaultProps: Partial<McTabsProps> = {
    isCard: true,
  };

  buildMenuItems() {
    const { items } = this.props;

    return items.map((item, index) => (
      <Tabs.TabPane tab={item.title} key={item.title} forceRender={item.forceRender ? item.forceRender : false}>
        {item.display}
      </Tabs.TabPane>
    ));
  }

  render() {
    const { isCard, items } = this.props;
    const menuItems = this.buildMenuItems();

    return (
      <div
        className={isCard
          ? 'mcs-campaign-dashboard-tabs card'
          : 'mcs-campaign-dashboard-tabs standalone'
        }
      >
        <Tabs defaultActiveKey={items[0].title}>
          {menuItems}
        </Tabs>
      </div>
    );

  }
}

export default McsTabs;

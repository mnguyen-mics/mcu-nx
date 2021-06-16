import * as React from 'react';
import { Menu } from 'antd';

export type AppsMenuSection = {
  items: AppsMenuItem[];
};
export interface AppsMenuItem {
  icon?: React.ReactElement;
  name: string;
  url: string;
}

export interface AppsMenuProps {
  logo: React.ReactElement;
  sections: AppsMenuSection[];
  className?: string;
}

class AppsMenu extends React.Component<AppsMenuProps> {
  constructor(props: AppsMenuProps) {
    super(props);
    this.state = {};
  }

  renderItem(item: AppsMenuItem): React.ReactElement {
    return (
      <Menu.Item icon={item.icon} className={'mcs_appMenu_item--withDivider'}>
        <a href={item.url}>
          <span>{item.name}</span>
        </a>
      </Menu.Item>
    );
  }

  renderSection(section: AppsMenuSection, key: number): React.ReactElement[] {
    return section.items.map((item, index) => this.renderItem(item));
  }

  render() {
    const { sections, logo, className } = this.props;

    return (
      <Menu mode='inline' className={`mcs_appMenu ${className ? className : ''}`}>
        {logo}
        {sections.map((section, index) => this.renderSection(section, index))}
      </Menu>
    );
  }
}

export default AppsMenu;

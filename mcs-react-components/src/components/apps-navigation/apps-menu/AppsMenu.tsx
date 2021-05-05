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
      <Menu.Item icon={item.icon}>
        <a href={item.url}>
          <span>{item.name}</span>
        </a>
      </Menu.Item>
    );
  }

  renderSection(section: AppsMenuSection, key: number): React.ReactElement[] {
    const elements: React.ReactElement[] = [<Menu.Divider key={'div_' + key} />];
    return elements.concat(section.items.map((item, index) => this.renderItem(item)));
  }

  render() {
    const { sections, logo, className } = this.props;

    return (
      <Menu mode='inline' className={`mcs-app_dropdown_menu ${className ? className : ''}`}>
        {logo}
        {sections.map((section, index) => this.renderSection(section, index))}
      </Menu>
    );
  }
}

export default AppsMenu;

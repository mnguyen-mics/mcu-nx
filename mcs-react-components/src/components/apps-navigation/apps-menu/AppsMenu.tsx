import * as React from 'react';
import { Menu } from 'antd';

export type AppsMenuSections = {
  adminLinks: AppsMenuItem[];
  userLinks: AppsMenuItem[];
  resourceLinks?: AppsMenuItem[];
};
export interface AppsMenuItem {
  icon?: React.ReactElement;
  name: string;
  url: string;
}

export interface AppsMenuProps {
  logo: React.ReactElement;
  sections: AppsMenuSections;
  className?: string;
}

class AppsMenu extends React.Component<AppsMenuProps> {
  constructor(props: AppsMenuProps) {
    super(props);
    this.state = {};
  }

  renderItem(item: AppsMenuItem, displayBorder: boolean): React.ReactElement {
    return (
      <Menu.Item
        icon={item.icon}
        className={
          displayBorder ? 'mcs_appMenu_item mcs_appMenu_item--withDivider' : 'mcs_appMenu_item'
        }
      >
        <a href={item.url}>
          <span>{item.name}</span>
        </a>
      </Menu.Item>
    );
  }

  renderSection(links: AppsMenuItem[], displayBorder?: boolean): React.ReactElement[] {
    return links.map((link, index) =>
      this.renderItem(link, !!displayBorder && links.length === index + 1),
    );
  }

  render() {
    const { sections, logo, className } = this.props;

    return (
      <Menu mode='inline' className={`mcs_appMenu ${className ? className : ''}`}>
        {logo}
        {sections.adminLinks && this.renderSection(sections.adminLinks, true)}
        {sections.userLinks && this.renderSection(sections.userLinks, true)}
        {sections.resourceLinks && this.renderSection(sections.userLinks)}
      </Menu>
    );
  }
}

export default AppsMenu;

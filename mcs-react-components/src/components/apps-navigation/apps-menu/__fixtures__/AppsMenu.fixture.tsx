import * as React from 'react';
import AppsMenu, { AppMenuOption, AppsMenuProps } from '../AppsMenu';

const props: AppsMenuProps = {
  availableAppUrlsMap: new Map<AppMenuOption, string>([
    ['NAVIGATOR', 'url1'],
    ['DEVELOPER_CONSOLE', 'url2'],
    ['PLATFORM_ADMIN', 'url3'],
  ]),
  logo: <span />,
};

const component = (_props: AppsMenuProps) => <AppsMenu {..._props} />;
component.displayName = 'AppsMenu';

export default {
  component,
  props,
};

import * as React from 'react';
import AppsMenu, { AppsMenuProps } from '../AppsMenu';

const props: AppsMenuProps = {
  sections: [
    { items: [{ name: 'Platform Admin', url: 'url1' }] },
    { items: [{ name: 'Navigator', url: 'url2' }] },
  ],
  logo: <span />,
  className: "fake-class-name"
};

const component = (_props: AppsMenuProps) => <AppsMenu {..._props} />;
component.displayName = 'AppsMenu';

export default {
  component,
  props,
};

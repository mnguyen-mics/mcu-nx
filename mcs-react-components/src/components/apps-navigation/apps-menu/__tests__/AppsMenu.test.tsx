import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import AppsMenu, { AppMenuOption, AppsMenuProps } from '../AppsMenu';

it('render the AppsMenu', () => {
  const props: AppsMenuProps = {
    availableAppUrlsMap: new Map<AppMenuOption, string>([
      ['NAVIGATOR', 'url1'],
      ['DEVELOPER_CONSOLE', 'url2'],
      ['PLATFORM_ADMIN', 'url3'],
    ]),
    logo: <span />,
  };
  const component = TestRenderer.create(<AppsMenu {...props} />);

  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

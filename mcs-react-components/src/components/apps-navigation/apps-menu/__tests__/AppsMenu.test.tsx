import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import AppsMenu, { AppsMenuProps } from '../AppsMenu';

it('render the AppsMenu', () => {
  const props: AppsMenuProps = {
    sections: [
      { items: [{ name: 'Platform Admin', url: 'url1' }] },
      { items: [{ name: 'Navigator', url: 'url2' }] },
    ],
    logo: <span />,
  };
  const component = TestRenderer.create(<AppsMenu {...props} />);

  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

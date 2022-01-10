import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import AppsMenu, { AppsMenuProps } from '../AppsMenu';

it('render the AppsMenu', () => {
  const props: AppsMenuProps = {
    sections: {
      adminLinks: [
        { name: 'Platform Admin', url: 'url1' },
        { name: 'computing console', url: 'url2' },
      ],
      userLinks: [
        { name: 'Navigator2', url: 'url2' },
        { name: 'Navigator3', url: 'url2' },
      ],
      resourceLinks: [
        { name: 'Doc 1', url: 'url2' },
        { name: 'Doc 2', url: 'url2' },
      ],
    },
    logo: <div>toto</div>,
    className: 'fake-class-name',
  };
  const component = TestRenderer.create(<AppsMenu {...props} />);

  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

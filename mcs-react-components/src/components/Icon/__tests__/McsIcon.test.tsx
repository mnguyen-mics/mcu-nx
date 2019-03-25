import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';

import McsIcon from '../McsIcon';

it('renders an user icon', () => {
  const component = TestRenderer.create(
    <McsIcon type="user" className="pass-class1 pass-class2" id="pass-id" />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

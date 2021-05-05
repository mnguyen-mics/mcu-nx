import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';

import McsIcon from '../McsIcon';

it('renders an user icon', () => {
  const component = TestRenderer.create(<McsIcon type='user' />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

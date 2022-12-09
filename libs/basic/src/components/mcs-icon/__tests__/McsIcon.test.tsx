import 'jest';
import React from 'react';
import TestRenderer from 'react-test-renderer';

import McsIcon from '../McsIcon';

it('renders an user icon', () => {
  const component = TestRenderer.create(<McsIcon type='user' />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

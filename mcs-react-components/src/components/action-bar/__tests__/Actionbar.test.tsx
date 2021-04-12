import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import Actionbar, { ActionbarProps } from '../Actionbar';

it('renders the actionBar', () => {
  const props: ActionbarProps = {
    pathItems: [
      <a key="1" href="https://www.google.fr">Campaigns</a>,
      <a key="2" href="https://www.github.fr">Display</a>,
    ],
  };
  
  const component = TestRenderer.create(<Actionbar {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

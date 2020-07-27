import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import Actionbar, { ActionbarProps } from '../Actionbar';
import { MemoryRouter } from 'react-router';

it('renders the actionBar', () => {
  const props: ActionbarProps = {
    paths: [
      { name: 'Campaigns', path: 'www.google.fr' },
      { name: 'Display', path: 'www.github.com' },
    ],
  };

  const component = TestRenderer.create(
    <MemoryRouter>
      <Actionbar {...props} />
    </MemoryRouter>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

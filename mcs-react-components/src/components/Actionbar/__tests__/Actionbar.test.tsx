import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import Actionbar, { ActionbarProps } from '../Actionbar';
import { MemoryRouter } from 'react-router';
import { IntlProvider } from 'react-intl';

it('renders the actionBar', () => {
  const props: ActionbarProps = {
    paths: [
      { name: 'Campaigns', path: 'www.google.fr' },
      { name: 'Display', path: 'www.github.com' },
    ],
  };

  const component = TestRenderer.create(
    <IntlProvider locale="en">
      <MemoryRouter>
        <Actionbar {...props} />
      </MemoryRouter>
    </IntlProvider>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

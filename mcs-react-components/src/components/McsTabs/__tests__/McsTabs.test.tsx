import * as React from 'react';
import { List } from 'antd';
import { MemoryRouter } from 'react-router';
import { IntlProvider } from 'react-intl';
import * as TestRenderer from 'react-test-renderer';

import McsTabs, { McTabsProps } from '../McsTabs';

it('renders the tabs', () => {
  const props: McTabsProps = {
    items: [
      {
        title: 'Tabun',
        key: 'tab1',
        display: <div>Content tab 1</div>,
      },
      {
        title: 'Tabdeu',
        key: 'tab2',
        display: <div>Content tab 2</div>,
      },
      {
        title: 'Tabtroi',
        key: 'tab3',
        display: <div>Content tab 3</div>,
      },
    ],
  };

  const component = TestRenderer.create(
    <IntlProvider locale="en">
      <MemoryRouter>
        <McsTabs {...props} />
      </MemoryRouter>
    </IntlProvider>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

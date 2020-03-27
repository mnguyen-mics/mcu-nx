import * as React from 'react';
import { MemoryRouter } from 'react-router';
import { IntlProvider } from 'react-intl';
import McsTabs, { McTabsProps } from '../McsTabs';
import { render } from 'enzyme';

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

  const component = render(
    <IntlProvider locale="en">
      <MemoryRouter>
        <McsTabs {...props} />
      </MemoryRouter>
    </IntlProvider>,
  );
  expect(component).toMatchSnapshot();
});

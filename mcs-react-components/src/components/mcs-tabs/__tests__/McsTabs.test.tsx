import * as React from 'react';
import McsTabs, { McTabsProps } from '../McsTabs';
import { render } from 'enzyme';

it('renders the tabs', () => {
  const props: McTabsProps = {
    items: [
      {
        className: 'mcs-tabs_tab1',
        title: 'Tabun',
        key: 'tab1',
        display: <div>Content tab 1</div>,
      },
      {
        className: 'mcs-tabs_tab2',
        title: 'Tabdeu',
        key: 'tab2',
        display: <div>Content tab 2</div>,
      },
      {
        className: 'mcs-tabs_tab3',
        title: 'Tabtroi',
        key: 'tab3',
        display: <div>Content tab 3</div>,
      },
    ],
  };

  const component = render(<McsTabs {...props} />);
  expect(component).toMatchSnapshot();
});

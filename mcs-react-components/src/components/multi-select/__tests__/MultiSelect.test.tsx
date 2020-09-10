import * as React from 'react';
import { MemoryRouter } from 'react-router';
import { IntlProvider } from 'react-intl';
import { render } from 'enzyme';
import MultiSelect, { MultiSelectProps } from '../MultiSelect';

jest.mock('cuid', () => () => '123');

it('renders the multi select', () => {
  const props: MultiSelectProps<string> = {
    displayElement: <div>Click To Test</div>,
    items: ['Willy Denzey', 'Matt Huston'],
    subItems: ['Billy Crawford', 'Tragédie'],
    subItemsTitle: '... mais aussi',
    selectedItems: [],
    getKey: (a: string) => a,
    handleItemClick: (a: string) => console.log(a),
    handleMenuClick: (selectedItems: string[]) =>
      selectedItems.forEach(s => console.log('> clicked on: ' + s)),
    onCloseMenu: (selectedItems: string[]) =>
      selectedItems.forEach(s => console.log('> closing: ' + s)),
    singleSelectOnly: false,
    buttonClass: 'test-class',
  };

  const component = render(
    <IntlProvider locale="en">
      <MemoryRouter>
        <MultiSelect {...props} />
      </MemoryRouter>
    </IntlProvider>,
  );
  expect(component).toMatchSnapshot();
});

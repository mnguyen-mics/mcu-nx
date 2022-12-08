import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import SelectorLayout, { SelectorLayoutProps } from '../SelectorLayout';

it('renders the SelectorLayout with no element', () => {
  const props: SelectorLayoutProps = {
    actionBarTitle: 'Action Bar Title',
    handleAdd: () => {
      //
    },
    handleClose: () => {
      //
    },
    disabled: true,
    noElementText: 'No data found',
    addButtonText: 'Add',
  };
  const component = TestRenderer.create(<SelectorLayout {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

it('renders the SelectorLayout with children', () => {
  const props: SelectorLayoutProps = {
    actionBarTitle: 'Action Bar Title',
    handleAdd: () => {
      //
    },
    disabled: false,
    handleClose: () => {
      //
    },
    noElementText: 'No data found',
    addButtonText: 'Add',
  };
  const component = TestRenderer.create(
    <SelectorLayout {...props}>
      <div>Children elements</div>
    </SelectorLayout>,
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

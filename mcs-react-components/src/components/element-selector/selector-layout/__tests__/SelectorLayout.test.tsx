import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import SelectorLayout, { SelectorLayoutProps } from '../SelectorLayout';
import { defineMessages, IntlProvider } from 'react-intl';

const messages = defineMessages({
  noElementMessage: {
    id: 'id1',
    defaultMessage: 'No element',
  },
});

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
    noElementMessage: messages.noElementMessage,
  };
  const component = TestRenderer.create(
    <IntlProvider>
      <SelectorLayout {...props} />
    </IntlProvider>,
  );
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
    noElementMessage: messages.noElementMessage,
  };
  const component = TestRenderer.create(
    <IntlProvider>
      <SelectorLayout {...props}>
        <div>Children elements</div>
      </SelectorLayout>
    </IntlProvider>,
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

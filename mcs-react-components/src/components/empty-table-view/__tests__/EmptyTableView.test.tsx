import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import EmptyTableView, { EmptyTableViewProps } from '../EmptyTableView';
import { defineMessages, IntlProvider } from 'react-intl';

const messages = defineMessages({
  noData: {
    id: 'id1',
    defaultMessage: 'No data found',
  },
});

it('renders the EmptyTableView', () => {
  const props: EmptyTableViewProps = {
    intlMessage: messages.noData,
    iconType: 'warning',
  };
  const component = TestRenderer.create(
    <IntlProvider>
      <EmptyTableView {...props} />
    </IntlProvider>,
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

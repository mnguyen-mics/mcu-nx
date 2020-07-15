import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import SelectionNotifyer, {
  SelectionNotifyerProps,
} from '../SelectionNotifyer';
import { IntlProvider } from 'react-intl';

interface Data {
  key: string;
  name: string;
  age: string;
  address: string;
  description: string;
}

it('renders the SelectionNotifyer with all items selected', () => {
  const props: SelectionNotifyerProps<Data> = {
    rowSelection: {
      selectedRowKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      allRowsAreSelected: true,
    },
    pagination: {
      total: 10,
    },
  };

  const component = TestRenderer.create(<SelectionNotifyer {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders the SelectionNotifyer with all the page items selected', () => {
  const props: SelectionNotifyerProps<Data> = {
    rowSelection: {
      selectedRowKeys: ['1', '2', '3', '4', '5'],
      allRowsAreSelected: true,
    },
    pagination: {
      total: 10,
      pageSize: 5,
    },
  };

  const component = TestRenderer.create(<SelectionNotifyer {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders the SelectionNotifyer with 3 items selected', () => {
  const props: SelectionNotifyerProps<Data> = {
    rowSelection: {
      selectedRowKeys: ['1', '4', '7'],
      allRowsAreSelected: true,
    },
    pagination: {
      total: 10,
      pageSize: 5,
    },
  };

  const component = TestRenderer.create(
    <IntlProvider>
      <SelectionNotifyer {...props} />
    </IntlProvider>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

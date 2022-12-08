import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import SearchAndMultiSelect, { SearchAndMultiSelectProps } from '../SearchAndMultiSelect';
jest.mock('cuid', () => () => '123');
it('renders the SearchAndMultiSelect', () => {
  const props: SearchAndMultiSelectProps = {
    onClick: (elementKey: string) => {
      //
    },
    placeholder: 'Placeholder',
    datasource: [
      {
        key: '1',
        label: 'Item 1',
      },
      {
        key: '2',
        label: 'Item 2',
      },
    ],
    value: ['1'],
    loading: false,
  };
  const component = TestRenderer.create(<SearchAndMultiSelect {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

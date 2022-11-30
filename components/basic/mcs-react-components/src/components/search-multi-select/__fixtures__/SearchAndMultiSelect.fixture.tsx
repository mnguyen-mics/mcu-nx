import * as React from 'react';
import SearchAndMultiSelect, { SearchAndMultiSelectProps } from '../SearchAndMultiSelect';

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
    {
      key: '3',
      label: 'Item 3',
    },
  ],
  value: ['1'],
  loading: false,
};
export default <SearchAndMultiSelect {...props} />;

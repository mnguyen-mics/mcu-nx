import * as React from 'react';
import { IntlProvider } from 'react-intl';
import CollectionViewFilters, {
  CollectionViewFiltersProps,
} from '../CollectionViewFilters';

const items = [];

for (let i = 1; i <= 30; i++) {
  items.push(<div>This is supposed to be a creative Card</div>);
}

const props: CollectionViewFiltersProps = {
  collectionItems: items,
  loading: false,
  pagination: {
    current: 0,
    total: 60,
  },
  searchOptions: {
    placeholder: "The search isn't supposed to work buddy !",
  },
};

export default (
  <IntlProvider locale="en">
    <CollectionViewFilters {...props} />
  </IntlProvider>
);

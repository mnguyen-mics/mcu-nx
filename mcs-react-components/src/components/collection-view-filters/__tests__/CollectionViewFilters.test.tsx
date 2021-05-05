import 'jest';
import * as React from 'react';
import CollectionViewFilters, { CollectionViewFiltersProps } from '../CollectionViewFilters';
import * as TestRenderer from 'react-test-renderer';

it('should display a loading collection view filters', () => {
  const items = [];

  for (let i = 1; i <= 30; i++) {
    items.push(<div key={i}>This is supposed to be a creative Card</div>);
  }

  const props: CollectionViewFiltersProps = {
    loading: true,
    collectionItems: items,
  };
  const component = TestRenderer.create(<CollectionViewFilters {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

it('should display a collection view filters with pagination and a search panel', () => {
  const items = [];

  for (let i = 1; i <= 30; i++) {
    items.push(<div key={i}>This is supposed to be a creative Card</div>);
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
  const component = TestRenderer.create(<CollectionViewFilters {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

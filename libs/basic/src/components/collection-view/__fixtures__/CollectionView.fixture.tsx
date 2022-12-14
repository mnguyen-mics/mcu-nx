import React from 'react';
import CollectionView, { CollectionViewProps } from '../CollectionView';
import { Col } from 'antd';

const items = [];

for (let i = 1; i <= 30; i++) {
  items.push(
    <Col key='test'>
      <li>test {i}</li>
    </Col>,
  );
}

const props: CollectionViewProps = {
  collectionItems: items,
  loading: false,
  gutter: 50,
  span: 24,
  pagination: {
    current: 0,
    total: 60,
  },
};

export default <CollectionView {...props} />;

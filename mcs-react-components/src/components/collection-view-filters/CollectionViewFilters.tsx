import * as React from 'react';
import { Row, Col, Input } from 'antd';
import { SearchProps } from 'antd/lib/input/Search';

import CollectionView, { CollectionViewProps } from '../collection-view';

const { Search } = Input;

export interface CollectionViewFiltersProps extends CollectionViewProps {
  searchOptions?: SearchProps;
}

class CollectionViewFilters extends React.Component<CollectionViewFiltersProps> {
  render() {
    const prefixCls = 'mcs-collection-view-filters';

    const { searchOptions } = this.props;

    const searchInput = searchOptions ? <Search {...searchOptions} /> : null;

    return (
      <div className={prefixCls}>
        <Row className={`${prefixCls}-table-header`}>
          <Col span={24}>{searchInput}</Col>
        </Row>
        <Row>
          <Col span={24}>
            <CollectionView {...this.props} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default CollectionViewFilters;

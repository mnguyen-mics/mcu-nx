import React from 'react';
import { Row, Col, Spin, Pagination } from 'antd';
import cuid from 'cuid';
import { PaginationProps } from 'antd/lib/pagination/Pagination';

export interface CollectionViewProps {
  collectionItems: JSX.Element[];
  pagination?: PaginationProps;
  gutter?: number;
  span?: number;
  loading?: boolean;
  className?: string;
}

class CollectionView extends React.Component<CollectionViewProps> {
  static defaultProps: Partial<CollectionViewProps> = {
    gutter: 20,
    span: 6,
    loading: false,
  };

  render() {
    const prefixCls = 'mcs-collection-view';
    const { collectionItems, gutter, span, pagination, loading, className } = this.props;

    return loading ? (
      <Row className={`${prefixCls}-loading`}>
        <Row className={`${prefixCls}-loading-content`}>
          <Spin />
        </Row>
      </Row>
    ) : (
      <div className={`${prefixCls} ${className ? className : ''}`}>
        <Row gutter={gutter}>
          {collectionItems.map(item => {
            return (
              <Col key={item.key || cuid()} span={span!}>
                {item}
              </Col>
            );
          })}
        </Row>
        {pagination && (
          <div className={`${prefixCls}-text-right`}>
            <Pagination {...pagination} />
          </div>
        )}
      </div>
    );
  }
}

export default CollectionView;

import React from 'react';
import {Row, Col, Pagination, Spin} from 'antd';
import {PaginationProps} from 'antd/lib/pagination';


const defaultProps = {
    gutter: 20,
    span: 6,
    loading: false,
    collectionItems: null
};

export interface CollectionViewProps<T> {
    collectionItems: Array<T>,
    getKey:(item: T) => string,
    gutter?: number,
    span?: number,
    loading?: boolean,
    pagination?: PaginationProps,
}


function getOrElse<T>(t: T | undefined, _default: T): T {
    return t ? t : _default;
}

function CollectionView<T>(props: CollectionViewProps<T>) {

    const {getKey, collectionItems} = props;
    const gutter = getOrElse(props.gutter, defaultProps.gutter);
    const loading = getOrElse(props.loading, defaultProps.loading);
    const span = getOrElse(props.span, defaultProps.span);
    const pagination = getOrElse(props.pagination, {total: collectionItems.length});

    return loading ? (<Row style={{height: '350px'}}><Row className="mcs-aligner"><Spin/></Row></Row>) : (
        <Row className="mcs-table-card">
            <Row gutter={gutter}>
                {collectionItems.map(item => {
                    return (
                        <Col key={getKey(item)} span={span}>
                            {item}
                        </Col>
                    );
                })}

            </Row>
            <Row className="text-right">
                <Pagination {...pagination} />
            </Row>
        </Row>
    );
}

export default CollectionView;

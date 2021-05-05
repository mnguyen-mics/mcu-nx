import * as React from 'react';
import * as _moment from 'moment';
import { Row, Col, Tooltip } from 'antd';
import { OriginProps } from '../../../../models/timeline/timeline';

const moment = _moment;

export interface Props {
  title: string;
  noOriginText: string;
  origin: OriginProps;
}

const renderLine = (key: string, value: string | number) => {
  return (
    <Row key={key}>
      <Col className='table-left' span={12}>
        <span>
          <Tooltip title={key}>{key}</Tooltip>
        </span>
      </Col>
      <Col className='table-right' span={12}>
        <span>
          <Tooltip title={key === '$ts' ? moment(value).format('YYYY MM DD, hh:mm:ss') : value}>
            {key === '$ts' ? moment(value).format('YYYY MM DD, hh:mm:ss') : value}
          </Tooltip>
        </span>
      </Col>
    </Row>
  );
};

class Origin extends React.Component<Props> {
  render() {
    const { origin, title, noOriginText } = this.props;

    return (
      <Row gutter={10} className='section table-line border-top mcs-origin'>
        <Col span={5} className='section-title'>
          {title}
        </Col>
        <Col span={19}>
          {origin ? (
            Object.keys(origin).map(key => {
              const originKey = (origin as {
                [propertyName: string]: string | number;
              })[key];
              return originKey ? renderLine(key, originKey) : null;
            })
          ) : (
            <span>{noOriginText}</span>
          )}
        </Col>
      </Row>
    );
  }
}

export default Origin;

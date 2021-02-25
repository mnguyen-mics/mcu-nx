import * as React from 'react';
import { Col, Row } from 'antd';
import { MetricsColumnProps } from '../metrics-column';

class MetricsHighlight extends React.Component<MetricsColumnProps> {
  static defaultProps = {
    isLoading: false,
  };

  render() {
    const { metrics, isLoading } = this.props;

    const nbOfVal: number = metrics ? metrics.length : 1;
    const cellSize: number = Math.round(24 / nbOfVal);
    const prefixCls = 'mcs-metrics-column';

    return (
      <div className={prefixCls}>
        <Row>
          {metrics.map(metric => {
            return (
              <Col key={metric.name} span={cellSize}>
                <div className={`${prefixCls}_title`}>{metric.name}</div>
                <div className={`${prefixCls}_metric`}>
                  {isLoading ? (
                    <i
                      className={`${prefixCls}_loading`}
                      style={{ width: '130px' }}
                    />
                  ) : (
                    metric.value
                  )}
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}

export default MetricsHighlight;

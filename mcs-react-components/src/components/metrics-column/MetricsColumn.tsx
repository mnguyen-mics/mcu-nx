import * as React from 'react';

export interface Metric {
  name: string;
  value?: string;
}

export interface MetricsColumnProps {
  className?: string;
  metrics: Metric[];
  isLoading?: boolean;
}

class MetricsColumn extends React.Component<MetricsColumnProps> {
  static defaultProps = {
    isLoading: false,
  };

  render() {
    const { metrics, isLoading, className } = this.props;

    const height = 375;
    const nbOfVal: number = metrics ? metrics.length : 1;
    const cellHeight: number = height / nbOfVal;
    const prefixCls = 'mcs-metrics-column';

    return (
      <div className={`${prefixCls} ${className ? className : ''}`}>
        {metrics.map(metric => {
          return (
            <div key={metric.name} style={{ height: `${cellHeight}px` }}>
              <div className={`${prefixCls}_title`}>{metric.name}</div>
              <div className={`${prefixCls}_metric`}>
                {isLoading ? (
                  <i className={`${prefixCls}_loading`} style={{ width: '130px' }} />
                ) : (
                  metric.value
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default MetricsColumn;

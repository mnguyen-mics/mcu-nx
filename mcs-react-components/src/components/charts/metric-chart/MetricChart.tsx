import React from 'react';
import CountUp from 'react-countup';

export declare type MetricChartFormat = 'percentage' | 'count' | 'float';

export interface MetricChartProps {
  value: number;
  format?: MetricChartFormat;
  start?: number;
  separator?: string;
  decimal?: string;
  duration?: number;
}

export class MetricChart extends React.Component<MetricChartProps> {
  constructor(props: MetricChartProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { value, start, separator, decimal, duration } = this.props;

    const countUpProps = {
      start: start || 0,
      separator: separator || ',',
      decimal: decimal || '.',
      duration: duration || 0.5,
    };

    return (
      <div className='mcs-dashboardMetric'>
        <CountUp className={'mcs-otqlChart_resultMetrics'} end={value} {...countUpProps} />
      </div>
    );
  }
}

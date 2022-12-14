import React from 'react';

interface Options {
  color: string;
  domain: string;
}

export interface LegendChartProps {
  className?: string;
  identifier: string;
  options: Options[];
}

class LegendChart extends React.Component<LegendChartProps> {
  constructor(props: LegendChartProps) {
    super(props);
  }
  render() {
    const { options, className } = this.props;
    return (
      <div className={`mcs-legend-chart ${className ? className : ''}`}>
        {options.map(option => {
          return (
            <div key={option.domain} className='mcs-legend-chart_item'>
              <div
                style={{
                  backgroundColor: option.color,
                }}
                className='mcs-legend-chart_item_line'
              />
              <span className='mcs-legend-chart_item_name'>{option.domain}</span>
            </div>
          );
        })}
      </div>
    );
  }
}

export default LegendChart;

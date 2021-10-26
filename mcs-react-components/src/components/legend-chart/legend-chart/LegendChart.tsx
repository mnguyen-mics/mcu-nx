import * as React from 'react';

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
      <div className={`mcs-legend-container ${className ? className : ''}`}>
        {options.map(option => {
          return (
            <div key={option.domain} className='wrapper'>
              <div
                style={{
                  backgroundColor: option.color,
                }}
                className='mcs-line'
              />
              <span className='mcs-legend'>{option.domain}</span>
            </div>
          );
        })}
      </div>
    );
  }
}

export default LegendChart;

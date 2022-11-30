import * as React from 'react';
import Counter, { CounterProps } from '../counter/Counter';

export interface CounterDashboardProps {
  className?: string;
  counters: CounterProps[];
  invertedColor?: boolean;
}

export default class CounterDashboard extends React.Component<CounterDashboardProps> {
  render() {
    const { counters, invertedColor, className } = this.props;

    if (counters.length === 0) return null;

    return (
      <div
        className={`mcs-counter-dashboard ${invertedColor ? 'inverted' : ''} ${
          className ? className : ''
        }`}
      >
        {counters.map((counter, index) => {
          return <Counter key={index} {...counter} />;
        })}
      </div>
    );
  }
}

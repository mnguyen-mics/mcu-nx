import * as React from 'react';
import McsIcon, { McsIconType } from '../McsIcon';
import { Spin } from 'antd';
import { FormattedNumber } from 'react-intl';

export interface LoadingCounterValue {
  value?: number;
  loading?: boolean;
}

export interface CounterProps extends LoadingCounterValue {
  iconType: McsIconType;
  title: React.ReactNode | string;
}

export default class Counter extends React.Component<CounterProps> {
  render() {
    const { iconType, title, value, loading } = this.props;

    return (
      <div className="counter">
        <McsIcon type={iconType} />
        <div className="title">{title}</div>
        <div className="number">
          {loading ? (
            <Spin />
          ) : value !== undefined ? (
            <FormattedNumber value={value} />
          ) : (
            '--'
          )}
        </div>
      </div>
    );
  }
}

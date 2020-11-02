import * as React from 'react';
import McsIcon, { McsIconType } from '../../mcs-icon';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { Spin, Statistic } from 'antd';
import { FormattedNumber } from 'react-intl';

export interface LoadingCounterValue {
  value?: number;
  loading?: boolean;
}

export interface Trend {
  value: number;
  type: 'up' | 'down';
}

export interface CounterProps extends LoadingCounterValue {
  iconType: McsIconType;
  iconStyle?: React.CSSProperties;
  title: React.ReactNode | string;
  unit?: string;
  trend?: Trend;
}

export default class Counter extends React.Component<CounterProps> {
  render() {
    const { iconType, iconStyle, title, value, loading, unit, trend } = this.props;

    return (
      <div className="mcs-counter" >
        <McsIcon type={iconType} styleIcon={iconStyle ? iconStyle : {}} />
        <div className="title">{title}</div>
        <div className="number">
          {loading ? (
            <Spin />
          ) : (value !== undefined && value !== null) ? (
            <React.Fragment>
              <FormattedNumber value={value} />{unit ? ' ' + unit : ''}
              {trend ? <Statistic
                title=""
                value={trend.value}
                precision={1}
                valueStyle={{ color: trend.type === 'up' ? '#4ea500' : '#ed2333' }}
                prefix={trend.type === 'up' ? <UpOutlined /> : <DownOutlined />}
                suffix="%"
              /> : null}
            </React.Fragment>
          ) : (
                '--'
              )}
        </div>
      </div>
    );
  }
}

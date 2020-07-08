import * as React from 'react';
import { Col } from 'antd';

import McsIcon, { McsIconType } from '../mcs-icon';

export interface EmptyTableViewProps {
  text?: string;
  defaultMessage?: string;
  iconType: McsIconType;
  className?: string;
}

const EmptyTableView: React.SFC<EmptyTableViewProps> = props => {
  const prefixCls="mcs-empty-table-view"
  const {defaultMessage, className, iconType}=props
  return (
    <div className={prefixCls}>
      <Col 
        span={24} 
        className={
          className ? 
          `${prefixCls}-content ${className}` :
          `${prefixCls}-content`
        }
      >
        <div className={`${prefixCls}-logo`}>
          <McsIcon type={iconType} />
        </div>
        {defaultMessage}
      </Col>
    </div>
  );
};

EmptyTableView.defaultProps = {
  iconType: 'warning',
  defaultMessage:'No data found' ,
  text: undefined,
};

export default EmptyTableView;
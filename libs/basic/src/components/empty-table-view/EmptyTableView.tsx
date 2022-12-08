import * as React from 'react';
import { Col } from 'antd';
import McsIcon, { McsIconType } from '../../components/mcs-icon';

export interface EmptyTableViewProps {
  message: string;
  iconType: McsIconType;
  className?: string;
}

const EmptyTableView: React.SFC<EmptyTableViewProps> = props => {
  const prefixCls = 'mcs-empty-table-view';
  const { message, className, iconType } = props;
  return (
    <div className={prefixCls}>
      <Col
        span={24}
        className={className ? `${prefixCls}-content ${className}` : `${prefixCls}-content`}
      >
        <div className={`${prefixCls}-logo`}>
          <McsIcon type={iconType} />
        </div>
        {message}
      </Col>
    </div>
  );
};

EmptyTableView.defaultProps = {
  iconType: 'warning',
  className: 'mcs-table-view-empty',
};

export default EmptyTableView;

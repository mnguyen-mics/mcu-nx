import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Col } from 'antd';
import McsIcon, { McsIconType } from '../../components/mcs-icon';

export interface EmptyTableViewProps {
  intlMessage: FormattedMessage.MessageDescriptor;
  iconType: McsIconType;
  className?: string;
}

const EmptyTableView: React.SFC<EmptyTableViewProps> = props => {
  return (
    <div className="mcs-aligner">
      <Col span={24} className={props.className}>
        <div className="logo">
          <McsIcon type={props.iconType} />
        </div>
        <FormattedMessage {...props.intlMessage} />
      </Col>
    </div>
  );
};

EmptyTableView.defaultProps = {
  iconType: 'warning',
  className: 'mcs-table-view-empty',
};

export default EmptyTableView;
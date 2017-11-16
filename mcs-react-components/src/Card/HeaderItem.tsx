import * as React from 'react';
import { Col } from 'antd';
import { FormattedMessage } from 'react-intl';
import McsIcons, { McsIconType } from '../McsIcons';

export interface HeaderItemDataProp {
  iconType: McsIconType;
  translationKey: string;
  number: number;
}
export interface HeaderItemProps {
  className?: string;
  data: HeaderItemDataProp;
}

const HeaderItem: React.SFC<HeaderItemProps> = props => {
  let className = '';
  if (props.className) className = props.className;
  return (
    <Col span={6} className={className}>
      <McsIcons type={props.data.iconType} />
      <div className="title" >
        <FormattedMessage id={props.data.translationKey} />
      </div>
      <div className="number">{props.data.number}</div>
    </Col>);
};

export default HeaderItem;

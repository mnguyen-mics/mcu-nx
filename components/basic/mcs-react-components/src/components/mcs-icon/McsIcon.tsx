import { HomeOutlined } from '@ant-design/icons';
import * as React from 'react';

export type McsIconType =
  | 'adGroups'
  | 'ads'
  | 'automation'
  | 'bell'
  | 'bolt'
  | 'check-rounded-inverted'
  | 'check-rounded'
  | 'check'
  | 'chevron-right'
  | 'chevron'
  | 'close-big'
  | 'close-rounded'
  | 'close'
  | 'code'
  | 'creative'
  | 'data'
  | 'delete'
  | 'display'
  | 'dots'
  | 'download'
  | 'email-inverted'
  | 'email'
  | 'extend'
  | 'filters'
  | 'full-users'
  | 'file'
  | 'gears'
  | 'goals-rounded'
  | 'goals'
  | 'home'
  | 'image'
  | 'info'
  | 'laptop'
  | 'library'
  | 'magnifier'
  | 'menu-close'
  | 'minus'
  | 'optimization'
  | 'options'
  | 'partitions'
  | 'pause'
  | 'pen'
  | 'phone'
  | 'play'
  | 'plus'
  | 'query'
  | 'question'
  | 'refresh'
  | 'settings'
  | 'smartphone'
  | 'status'
  | 'tablet'
  | 'user'
  | 'users'
  | 'user-query'
  | 'user-pixel'
  | 'user-list'
  | 'video'
  | 'warning';

const antdIcons: McsIconType[] = ['home'];

export interface McsIconProps {
  type: McsIconType;
  styleIcon?: React.CSSProperties;
}

class McsIcon extends React.Component<
  McsIconProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
> {
  render() {
    const { type, styleIcon, className, ...rest } = this.props;

    if (antdIcons.includes(type)) {
      if (type === 'home') return <HomeOutlined className={'mcs-icon'} style={rest.style} />;
      else return <span />;
    } else
      return (
        <span className={`mcs-icon ${className ? className : ''}`} {...rest}>
          <i className={`mcs-${type}`} style={styleIcon ? styleIcon : {}} />
        </span>
      );
  }
}

export default McsIcon;

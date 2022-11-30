import * as React from 'react';
import McsIcon from '../../mcs-icon';
import classNames from 'classnames';

export interface MenuListProps {
  title: React.ReactChild;
  icon_path?: string;
  subtitles?: string[];
  select: React.FormEventHandler<any>;
  disabled?: boolean;
  className?: string;
}

const MenuList: React.SFC<MenuListProps> = ({
  title,
  icon_path,
  subtitles,
  select,
  disabled,
  className,
}) => {
  const prefixCls = 'mcs-menu-list';
  const classString = classNames(prefixCls, className);
  return (
    <button className={classString} onClick={select} disabled={disabled}>
      <div className={subtitles ? `${prefixCls}-content` : `${prefixCls}-content alone`}>
        {icon_path ? <img className={`${prefixCls}-image-title`} src={icon_path} /> : undefined}
        <div>
          <div className={`${prefixCls}-content-title`}>{title}</div>
          {subtitles ? (
            <div className={`${prefixCls}-content-subtitles`}>
              {subtitles.map((subtitle, index) => {
                return index !== subtitles.length - 1 ? `${subtitle}, ` : subtitle;
              })}
            </div>
          ) : null}
        </div>
      </div>
      <div className={`${prefixCls}-selector`}>
        <McsIcon type='chevron-right' />
      </div>
    </button>
  );
};

export default MenuList;

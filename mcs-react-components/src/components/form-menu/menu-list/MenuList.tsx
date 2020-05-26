
import * as React from 'react';
import McsIcon from '../../icon/McsIcon';

export interface MenuListProps {
  title: string;
  icon_path?: string;
  subtitles?: string[];
  select: React.FormEventHandler<any>;
  disabled?: boolean;
}

const MenuList: React.SFC<MenuListProps> = ({ title, icon_path, subtitles, select, disabled }) => {
  const prefixCls = "mcs-menu-list"
  return (
    <button className={prefixCls} onClick={select} disabled={disabled}>
      <div className={subtitles ? `${prefixCls}-content` : `${prefixCls}-content alone`}>
        {icon_path ? <img className={`${prefixCls}-image-title`} src={icon_path} /> : undefined}
        <div>
          <div className={`${prefixCls}-content-title`}>{title}</div>
          {subtitles ? <div className={`${prefixCls}-content-subtitles`}>{subtitles.map((subtitle, index) => {
            return index !== subtitles.length - 1 ? `${subtitle}, ` : subtitle;
          })}</div> : null}
        </div>
      </div>
      <div className={`${prefixCls}-selector`}>
        <McsIcon type="chevron-right" />
      </div>
    </button>
  );
};

export default MenuList;

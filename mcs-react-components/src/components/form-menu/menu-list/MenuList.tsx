
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

  return (
    <div className="mcs-menu-list">
      <button className="menu-item" onClick={select} disabled={disabled}>
        <div className={subtitles ? 'content' : 'content alone'}>
          {icon_path ? <img className="image-title" src={icon_path} /> : undefined}
          <div>
            <div className="title">{title}</div>
            {subtitles ? <div className="subtitles">{subtitles.map((subtitle, index) => {
              return index !== subtitles.length - 1 ? `${subtitle}, ` : subtitle;
            })}</div> : null}
          </div>
        </div>
        <div className="selector">
          <McsIcon type="chevron-right" />
        </div>
      </button>
    </div>
  );
};

export default MenuList;

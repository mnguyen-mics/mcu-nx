import * as React from 'react';
import MenuSubList, { MenuSubListProps } from '../MenuSubList';

const props: MenuSubListProps = {
  title: 'Title',
  subtitles: ['subtitle_1', 'subtitle_2'],
  submenu: [{
    title: 'submenu_1',
    select: () => { /* tslint:disable */ console.log('click submenu_1') /* tslint:enable */ },
  },
  {
    title: 'submenu_2',
    select: () => { /* tslint:disable */ console.log('click submenu_2') /* tslint:enable */ },
  }],
};

export default (
  <MenuSubList {...props}/>
);

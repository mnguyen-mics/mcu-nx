import * as React from 'react';
import MenuList, { MenuListProps } from '../MenuList';

const props: MenuListProps = {
  title: 'Title',
  subtitles: ['subtitle_1', 'subtitle_2'],
  select: () => {
    /* tslint:disable */ console.log('click'); /* tslint:enable */
  },
};

export default <MenuList {...props} />;

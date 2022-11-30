import * as React from 'react';
import MenuPresentational, { MenuPresentationalProps } from '../MenuPresentational';

const props: MenuPresentationalProps = {
  title: 'Title',
  type: 'automation',
  subtitles: ['subtitle_1', 'subtitle_2'],
  select: () => {
    /* tslint:disable */ console.log('click'); /* tslint:enable */
  },
};

export default <MenuPresentational {...props} />;

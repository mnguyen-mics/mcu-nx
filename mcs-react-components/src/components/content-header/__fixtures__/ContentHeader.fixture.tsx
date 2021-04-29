import * as React from 'react';
import ContentHeader, { ContentHeaderProps } from '../ContentHeader';

const props: ContentHeaderProps = {
  title: 'Titre',
  subTitle: 'SubTitre',
  loading: false,
  size: 'large',
};

export default <ContentHeader {...props} />;

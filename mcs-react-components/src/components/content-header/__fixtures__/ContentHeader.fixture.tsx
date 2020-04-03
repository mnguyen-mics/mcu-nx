import * as React from 'react';
import ContentHeader, { ContentHeaderProps } from '../ContentHeader';

const props: ContentHeaderProps = {
  title: 'Titre',
  subTitle: 'SubTitre',
  loading: false,
};

const component = (_props: ContentHeaderProps) => <ContentHeader {..._props} />;

component.displayName = "ContentHeader";

export default {
  component,
  props,
};

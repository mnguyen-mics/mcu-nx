import * as React from 'react';
import { MemoryRouter } from 'react-router';
import { IntlProvider } from 'react-intl';
import ContentHeader, { ContentHeaderProps } from '../ContentHeader';

const props: ContentHeaderProps = {
  title: 'Titre',
  subTitle: 'SubTitre',
  loading: false,
};

const component = (_props: ContentHeaderProps) => (
  <IntlProvider locale="en">
    <MemoryRouter>
      <ContentHeader {..._props} />
    </MemoryRouter>
  </IntlProvider>
);

export default {
  component,
  props,
};

import * as React from 'react';
import { MemoryRouter } from 'react-router';
import { IntlProvider } from 'react-intl';
import * as TestRenderer from 'react-test-renderer';

import ContentHeader, { ContentHeaderProps } from '../ContentHeader';

it('renders a medium content header', () => {
  const props: ContentHeaderProps = {
    title: 'Titre',
    size: 'medium'
  };

  const component = TestRenderer.create(
    <IntlProvider locale="en">
      <MemoryRouter>
        <ContentHeader {...props} />
      </MemoryRouter>
    </IntlProvider>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders a large content header', () => {
  const props: ContentHeaderProps = {
    title: 'Titre',
    size: 'large'
  };

  const component = TestRenderer.create(
    <IntlProvider locale="en">
      <MemoryRouter>
        <ContentHeader {...props} />
      </MemoryRouter>
    </IntlProvider>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders the "evolved" content header', () => {
  const props: ContentHeaderProps = {
    title: 'Titre',
    subTitle: 'SubTitre',
    loading: false,
  };

  const component = TestRenderer.create(
    <IntlProvider locale="en">
      <MemoryRouter>
        <ContentHeader {...props} />
      </MemoryRouter>
    </IntlProvider>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders the loading content header', () => {
  const props: ContentHeaderProps = {
    title: 'Titre',
    subTitle: 'SubTitre',
    loading: true,
  };

  const component = TestRenderer.create(
    <IntlProvider locale="en">
      <MemoryRouter>
        <ContentHeader {...props} />
      </MemoryRouter>
    </IntlProvider>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

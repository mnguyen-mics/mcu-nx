import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import MenuPresentational, { MenuPresentationalProps } from '../MenuPresentational';

it('renders the MenuPresentational', () => {
  const props: MenuPresentationalProps = {
    title: 'Title',
    type: 'automation',
    subtitles: ['subtitle_1', 'subtitle_2'],
    select: () => { /* tslint:disable */ console.log('click') /* tslint:enable */ },
  };
  const component = TestRenderer.create(
    <MenuPresentational {...props}/>
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

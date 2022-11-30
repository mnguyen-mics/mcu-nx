import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import MenuList, { MenuListProps } from '../MenuList';

it('renders the MenuList', () => {
  const props: MenuListProps = {
    title: 'Title',
    subtitles: ['subtitle_1', 'subtitle_2'],
    select: () => {
      /* tslint:disable */ console.log('click'); /* tslint:enable */
    },
  };
  const component = TestRenderer.create(<MenuList {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

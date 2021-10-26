import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import MenuSubList, { MenuSubListProps } from '../MenuSubList';
const messages = {
  empty: 'Empty',
};
it('renders the MenuSubList', () => {
  const props: MenuSubListProps = {
    title: 'Title',
    subtitles: [],
    submenu: [
      {
        title: 'submenu_1',
        select: () => {
          /* tslint:disable */ console.log('click submenu_1'); /* tslint:enable */
        },
      },
    ],
    messages,
  };
  const component = TestRenderer.create(<MenuSubList {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

it('renders the MenuSubList with submenu', () => {
  const props: MenuSubListProps = {
    title: 'Title',
    subtitles: ['subtitle_1', 'subtitle_2'],
    submenu: [
      {
        title: 'submenu_1',
        select: () => {
          /* tslint:disable */ console.log('click submenu_1'); /* tslint:enable */
        },
      },
    ],
    messages,
  };
  const component = TestRenderer.create(<MenuSubList {...props} />);
  component.root.findByType('button').props.onClick();
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

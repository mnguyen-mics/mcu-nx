import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import Slide, { SlideProps } from '../Slide';

it('renders the Slide horizontally', () => {
  const props: SlideProps = {
    toShow: true,
    content: <div style={{ backgroundColor: '#EFEFEF' }}>Hello world !</div>,
    horizontal: true,
  };

  const component = TestRenderer.create(<Slide {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders the Slide vertically', () => {
  const props: SlideProps = {
    toShow: true,
    content: <div style={{ backgroundColor: '#EFEFEF' }}>Hello world !</div>,
    horizontal: false,
  };

  const component = TestRenderer.create(<Slide {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('does not render the Slide', () => {
  const props: SlideProps = {
    toShow: false,
    content: <div style={{ backgroundColor: '#EFEFEF' }}>Hello world !</div>,
    horizontal: true,
  };

  const component = TestRenderer.create(<Slide {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

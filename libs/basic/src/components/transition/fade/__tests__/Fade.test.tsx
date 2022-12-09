import 'jest';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import Fade, { FadeProps } from '../Fade';

it('renders the Fade component', () => {
  const _props: FadeProps = {};
  const component = TestRenderer.create(
    <Fade {..._props}>
      <div style={{ backgroundColor: '#EFEFEF' }}>Hello world !</div>
    </Fade>,
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

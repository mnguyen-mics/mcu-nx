import * as React from 'react';
import Fade, { FadeProps } from '../Fade';
// import { Button } from 'antd';

const props: FadeProps = {};

const component = (_props: FadeProps) => (
  <Fade {..._props}>
    <div style={{ backgroundColor: '#EFEFEF' }}>Hello world !</div>
  </Fade>
);

component.displayName = 'Fade';

export default {
  component,
  props,
};

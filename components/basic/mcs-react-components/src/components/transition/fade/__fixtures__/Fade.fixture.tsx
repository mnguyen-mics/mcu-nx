import * as React from 'react';
import Fade, { FadeProps } from '../Fade';
// import { Button } from 'antd';

const props: FadeProps = {};

export default (
  <Fade {...props}>
    <div style={{ backgroundColor: '#EFEFEF' }}>Hello world !</div>
  </Fade>
);

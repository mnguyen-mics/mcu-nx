import * as React from 'react';
import Slide, { SlideProps } from '../Slide';

const props: SlideProps = {
  toShow: true,
  content: <div> Hello world ! </div>,
  horizontal: false,
};

export default (
  <React.Fragment>
    <Slide {...props}>
      <div style={{ backgroundColor: '#EFEFEF' }}>Hello world !</div>
    </Slide>
  </React.Fragment>
);

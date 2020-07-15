import * as React from 'react';
import Slide, { SlideProps } from '../Slide';

const props: SlideProps = {
  toShow: true,
  content: <div> Hello world ! </div>,
  horizontal: false,
};

const component = (_props: SlideProps) => (
  <React.Fragment>
    <Slide {..._props}>
      <div style={{ backgroundColor: '#EFEFEF' }}>Hello world !</div>
    </Slide>
  </React.Fragment>
);

component.displayName = 'Slide';

export default {
  component,
  props,
};

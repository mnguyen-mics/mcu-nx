import * as React from 'react';
import ColoredButton, { ColoredButtonProps } from '../ColoredButton';

const props: ColoredButtonProps = {
  backgroundColor: '#003056',
  color: '#fff',
  onClick: () => { /* tslint:disable */ console.log('clicked!') /* tslint:enable */ }
};


export default (
  <ColoredButton {...props}>Save</ColoredButton>
);

import * as React from 'react';
import Progress, { ProgressProps } from '../Progress';

const props: ProgressProps = {
  percent: 66,
  label: " % Test",
};

const component = (_props: ProgressProps) => (
  <Progress {...props}/>
);

component.displayName =  'Progress';

export default {
  component,
  props,
};

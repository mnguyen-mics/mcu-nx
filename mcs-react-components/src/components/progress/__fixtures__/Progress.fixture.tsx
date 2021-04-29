import * as React from 'react';
import Progress, { ProgressProps } from '../Progress';

const props: ProgressProps = {
  percent: 66,
  label: " % Test",
};

export default (
  <Progress {...props}/>
);

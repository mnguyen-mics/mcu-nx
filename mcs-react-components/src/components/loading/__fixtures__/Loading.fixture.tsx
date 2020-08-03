import * as React from 'react';
import Loading, { LoadingProps } from '../Loading';

const props: LoadingProps = {
  isFullScreen: true
};


const component = (_props: LoadingProps) => (
  <Loading {..._props} />
);

component.displayName = "Loading";

export default {
  component,
  props,
};

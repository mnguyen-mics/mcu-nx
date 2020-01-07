import * as React from 'react';
import Loading, { LoadingProps } from '../Loading';

const props: LoadingProps = {
  className: 'loading-full-screen',
};


const component = (_props: LoadingProps) => (
  <Loading {..._props} />
);

export default {
  component,
  props,
};

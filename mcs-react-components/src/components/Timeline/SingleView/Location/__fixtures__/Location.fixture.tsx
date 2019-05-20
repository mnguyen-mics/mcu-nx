import * as React from 'react';
import Location, { LocationProps } from '../Location';

const props: LocationProps = {
  location: 123156465456,
  longitude: 687876796,
  latitude: 787685963,
  containerWidth: 800,
};

const component = (_props: LocationProps) => <Location {..._props} />;

export default {
  component,
  props,
};

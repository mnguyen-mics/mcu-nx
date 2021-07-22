import * as React from 'react';
import Location, { LocationProps } from '../Location';

const props: LocationProps = {
  latitude: 48.85,
  longitude: 2.35,
  containerWidth: 800,
  mapboxToken:
    'pk.eyJ1Ijoiem9iaW9uZTE0MyIsImEiOiJjajZtMHZpYngxcm4yMndvMXVibXJwZGx3In0.9s_vDS6h2pU5ampVcydvCA',
};

export default <Location {...props} />;

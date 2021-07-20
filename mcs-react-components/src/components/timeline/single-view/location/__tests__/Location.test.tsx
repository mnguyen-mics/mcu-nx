import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import Location, { LocationProps } from '../Location';

it('renders the Location', () => {
  const props: LocationProps = {
    longitude: -122.45,
    latitude: 37.78,
    containerWidth: 800,
    mapboxToken:
      'pk.eyJ1Ijoiem9iaW9uZTE0MyIsImEiOiJjajZtMHZpYngxcm4yMndvMXVibXJwZGx3In0.9s_vDS6h2pU5ampVcydvCA',
  };
  const component = TestRenderer.create(<Location {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

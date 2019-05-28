import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import Location, { LocationProps } from '../Location';

it('renders the Location', () => {
  const props: LocationProps = {
    location: 123156465456,
    longitude: 687876796,
    latitude: 787685963,
    containerWidth: 800,
  };
  const component = TestRenderer.create(<Location {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

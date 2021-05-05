import * as React from 'react';
import { render } from 'enzyme';
import Progress, { ProgressProps } from '../Progress';

it('renders the progress', () => {
  const props: ProgressProps = {
    percent: 66,
    label: ' % Test',
  };

  const component = render(<Progress {...props} />);
  expect(component).toMatchSnapshot();
});

import 'jest';
import * as React from 'react';
import LegendChartWithModal, { LegendChartWithModalProps } from '../LegendChartWithModal';
import * as TestRenderer from 'react-test-renderer';

it('renders the legendchartWithModal', () => {
  const props: LegendChartWithModalProps = {
    options: [
      {
        key: '1',
        color: '#003056',
        domain: 'Domain #1',
      },
      {
        key: '2',
        color: '#00ab67',
        domain: 'Domain #2',
      },
    ],
    legends: [
      {
        key: '1',
        domain: 'Domain #1',
      },
      {
        key: '2',
        domain: 'Domain #2',
      },
    ],
    onLegendChange: (a, b) => {
      //
    },
  };

  const component = TestRenderer.create(<LegendChartWithModal {...props} />);

  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

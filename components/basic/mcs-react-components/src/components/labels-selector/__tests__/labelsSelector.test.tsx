import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import LabelsSelector, { LabelsSelectorProps } from '../LabelsSelector';
const messages = {
  labelNoResults: 'No Results',
  labelButton: 'Label',
};
it('renders the labelsSelector component', () => {
  const props: LabelsSelectorProps = {
    labels: [
      {
        id: '1',
        name: 'Hamilton',
        organisation_id: '112',
        creation_ts: 1212,
      },
      {
        id: '2',
        name: 'Leclerc',
        organisation_id: '112',
        creation_ts: 1212,
      },
      {
        id: '3',
        name: 'Verstappen',
        organisation_id: '112',
        creation_ts: 1212,
      },
    ],
    selectedLabels: [
      {
        id: '1',
        name: 'Hamilton',
        organisation_id: '112',
        creation_ts: 1212,
      },
    ],
    onChange: () => {
      return 'Label';
    },
    messages,
  };

  const component = TestRenderer.create(<LabelsSelector {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

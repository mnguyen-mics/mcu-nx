import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import LabelsSelector, { LabelsSelectorProps } from '../LabelsSelector';
import { IntlProvider } from 'react-intl';

it('renders the labelsSelector component', () => {
  const props: LabelsSelectorProps = {
    labels: [{
      id: "1",
      name: "Hamilton",
      organisation_id: "112",
      creation_ts: 1212
    },
    {
      id: "2",
      name: "Leclerc",
      organisation_id: "112",
      creation_ts: 1212
    },
    {
      id: "3",
      name: "Verstappen",
      organisation_id: "112",
      creation_ts: 1212
    }],
    selectedLabels: [{
      id: "1",
      name: "Hamilton",
      organisation_id: "112",
      creation_ts: 1212
    }],
    onChange: () => {return 'Label'}
  };

  const component = TestRenderer.create(
    <IntlProvider locale="en">
      <LabelsSelector {...props} />
    </IntlProvider>
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

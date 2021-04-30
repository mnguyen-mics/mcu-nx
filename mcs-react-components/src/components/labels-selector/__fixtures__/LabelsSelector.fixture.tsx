import * as React from 'react';
import LabelsSelector, { LabelsSelectorProps } from '../LabelsSelector';
import { IntlProvider } from 'react-intl';

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
  onChange: () => {return true}
};

export default (
  <IntlProvider locale="en">
    <LabelsSelector {...props} />
  </IntlProvider>
);

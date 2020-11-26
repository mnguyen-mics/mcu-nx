import * as React from 'react';
import RelatedRecords, { RelatedRecordsProps } from '../RelatedRecords';
import { MemoryRouter } from 'react-router';

const props: RelatedRecordsProps = {
  emptyOption: {
    iconType: 'question',
    message: 'Hello world!',
    className: 'mcs-customClass'  
  },
  isLoading: false
};

const component = (_props: RelatedRecordsProps) => (
  <MemoryRouter>
    <RelatedRecords {..._props}>
      <div>
        Hello World
      </div>
    </RelatedRecords>
  </MemoryRouter>
);

component.displayName = 'RelatedRecords';

export default {
  component,
  props,
};

import * as React from 'react';
import EmptyRecords, { EmptyRecordsProps } from '../EmptyRecords';
import { MemoryRouter } from 'react-router';

const props: EmptyRecordsProps = {
  iconType: 'question',
  message: 'Hello world!',
  className: 'mcs-customClass'  
};

const component = (_props: EmptyRecordsProps) => (
  <MemoryRouter>
    <EmptyRecords {..._props} />
  </MemoryRouter>
);

component.displayName = 'EmptyRecords';

export default {
  component,
  props,
};

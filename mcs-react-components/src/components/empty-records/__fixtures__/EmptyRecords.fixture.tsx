import * as React from 'react';
import EmptyRecords, { EmptyRecordsProps } from '../EmptyRecords';

const props: EmptyRecordsProps = {
  iconType: 'question',
  message: 'Hello world!',
  className: 'mcs-customClass'  
};

const component = (_props: EmptyRecordsProps) => (<EmptyRecords {..._props} />);

component.displayName = 'EmptyRecords';

export default {
  component,
  props,
};

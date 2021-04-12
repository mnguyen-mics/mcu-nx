import * as React from 'react';
import RelatedRecords, { RelatedRecordsProps } from '../RelatedRecords';

const props: RelatedRecordsProps = {
  emptyOption: {
    iconType: 'question',
    message: 'Hello world!',
    className: 'mcs-customClass'  
  },
  isLoading: false
};

const component = (_props: RelatedRecordsProps) => (
    <RelatedRecords {..._props}>
      <div>
        Hello World
      </div>
    </RelatedRecords>
);

component.displayName = 'RelatedRecords';

export default {
  component,
  props,
};

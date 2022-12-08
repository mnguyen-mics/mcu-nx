import * as React from 'react';
import RelatedRecords, { RelatedRecordsProps } from '../RelatedRecords';

const props: RelatedRecordsProps = {
  emptyOption: {
    iconType: 'question',
    message: 'Hello world!',
    className: 'mcs-customClass',
  },
  isLoading: false,
};

export default (
  <RelatedRecords {...props}>
    <div>Hello World</div>
  </RelatedRecords>
);

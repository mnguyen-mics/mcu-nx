import * as React from 'react';
import EmptyRecords, { EmptyRecordsProps } from '../EmptyRecords';

const props: EmptyRecordsProps = {
  iconType: 'question',
  message: 'Hello world!',
  className: 'mcs-customClass'  
};

export default (<EmptyRecords {...props} />);


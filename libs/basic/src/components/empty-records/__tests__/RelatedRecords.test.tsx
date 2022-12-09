import 'jest';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import EmptyRecords, { EmptyRecordsProps } from '../EmptyRecords';

it('renders the EmptyRecords', () => {
  const props: EmptyRecordsProps = {
    iconType: 'question',
    message: 'Hello world!',
    className: 'mcs-customClass',
  };

  const component = TestRenderer.create(<EmptyRecords {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

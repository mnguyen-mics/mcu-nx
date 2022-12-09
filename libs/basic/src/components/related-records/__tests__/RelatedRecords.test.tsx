import 'jest';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import RelatedRecords, { RelatedRecordsProps } from '../RelatedRecords';

it('renders the RelatedRecords', () => {
  const props: RelatedRecordsProps = {
    emptyOption: {
      iconType: 'question',
      message: 'Hello world!',
      className: 'mcs-customClass',
    },
    isLoading: false,
  };

  const component = TestRenderer.create(<RelatedRecords {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

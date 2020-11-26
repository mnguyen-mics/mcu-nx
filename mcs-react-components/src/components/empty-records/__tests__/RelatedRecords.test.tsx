import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import EmptyRecords, { EmptyRecordsProps } from '../EmptyRecords';
import { MemoryRouter } from 'react-router';

it('renders the EmptyRecords', () => {
  const props: EmptyRecordsProps = {
    iconType: 'question',
    message: 'Hello world!',
    className: 'mcs-customClass'  
  };

  const component = TestRenderer.create(
    <MemoryRouter>
      <EmptyRecords {...props} />
    </MemoryRouter>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

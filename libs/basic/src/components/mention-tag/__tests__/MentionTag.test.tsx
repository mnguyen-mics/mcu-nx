import 'jest';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import MentionTag, { MentionTagProps } from '../MentionTag';

it('renders the MentionTag', () => {
  const props: MentionTagProps = {
    mention: 'ALPHA',
    tooltip: 'tooltip',
  };
  const component = TestRenderer.create(<MentionTag {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

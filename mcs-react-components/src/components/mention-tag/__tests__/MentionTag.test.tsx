import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
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

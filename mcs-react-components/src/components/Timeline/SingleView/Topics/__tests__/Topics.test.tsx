import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import Topics, { TopicsProps } from '../Topics';

it('renders the Topics', () => {
  const props: TopicsProps = {
    topics: {}, // ??
  };
  const component = TestRenderer.create(<Topics {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

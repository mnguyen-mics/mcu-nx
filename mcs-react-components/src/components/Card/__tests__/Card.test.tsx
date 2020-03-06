import 'jest';
import * as React from 'react';
import { Button } from 'antd';
import * as TestRenderer from 'react-test-renderer';
import Card, { CardProps } from '../Card';

it('renders the Card', () => {
  const props: CardProps = {
    buttons: <Button type="primary" href="">Test</Button>,
    title: 'Title',
  };
  const component = TestRenderer.create(
    <Card {...props}>
      <div>Content</div>
    </Card>,
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});

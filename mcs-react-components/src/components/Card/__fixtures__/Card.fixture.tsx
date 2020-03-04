import * as React from 'react';
import { Button } from 'antd';
import Card, { CardProps } from '../Card';

const props: CardProps = {
  buttons: <Button type="primary">Test</Button>,
  title: 'Title',
};

const component = (_props: CardProps) => (
  <Card {..._props}>
    <div>Content</div>
  </Card>
);

component.displayName = "Card";

export default {
  component,
  props,
};

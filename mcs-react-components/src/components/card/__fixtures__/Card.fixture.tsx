import * as React from 'react';
import { Button } from 'antd';
import Card, { CardProps } from '../Card';

const props: CardProps = {
  buttons: <Button type="primary" href="" style={{padding: '10px 15px'}}>Test</Button>,
  title: 'Title',
};

export default (
  <Card {...props}>
    <div>Content</div>
  </Card>
);

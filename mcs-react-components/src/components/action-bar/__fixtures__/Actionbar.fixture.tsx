import * as React from 'react';
import Actionbar, { ActionbarProps } from '../Actionbar';
import { Button } from 'antd';

const props: ActionbarProps = {
  pathItems: [
    <a key="1" href="https://www.google.fr">Campaigns</a>,
    <a key="2" href="https://www.github.fr">Display</a>,
  ],
};

export default (
  <Actionbar {...props}>
    <div>
      <Button type="primary" href="" style={{ padding: '10px 15px' }}>
        Save
        </Button>
    </div>
  </Actionbar>
);

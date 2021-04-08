import * as React from 'react';
import Actionbar, { ActionbarProps } from '../Actionbar';
import { Button } from 'antd';

const props: ActionbarProps = {
  pathItems: [
    <a key="1" href="https://www.google.fr">Campaigns</a>,
    <a key="2" href="https://www.github.fr">Display</a>,
  ],
};

const component = (_props: ActionbarProps) => (
  <Actionbar {..._props}>
    <div>
      <Button type="primary" href="" style={{ padding: '10px 15px' }}>
        Save
        </Button>
    </div>
  </Actionbar>
);

component.displayName = 'ActionBar';

export default {
  component,
  props,
};

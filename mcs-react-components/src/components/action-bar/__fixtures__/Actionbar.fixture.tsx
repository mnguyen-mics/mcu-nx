import * as React from 'react';
import Actionbar, { ActionbarProps } from '../Actionbar';
import { Button } from 'antd';
import { MemoryRouter } from 'react-router';

const props: ActionbarProps = {
  paths: [
    { name: 'Campaigns', path: 'www.google.fr' },
    { name: 'Display', path: 'www.github.com' },
  ],
};

const component = (_props: ActionbarProps) => (
  <MemoryRouter>
    <Actionbar {..._props}>
      <div>
        <Button type="primary" href="" style={{padding: '10px 15px'}}>
          Save
        </Button>
      </div>
    </Actionbar>
  </MemoryRouter>
);

component.displayName = 'ActionBar';

export default {
  component,
  props,
};

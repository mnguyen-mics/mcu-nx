import * as React from 'react';
import Actionbar, { ActionbarProps } from '../Actionbar';
import { Button } from 'antd';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router';

const props: ActionbarProps = {
  paths: [
    { name: 'Campaings', path: 'www.google.fr' },
    { name: 'Display', path: 'www.github.com' },
  ],
};

const component = (_props: ActionbarProps) => (
  <IntlProvider locale="en">
    <MemoryRouter>
      <Actionbar {..._props}>
        <div>
          <Button type="primary">Save</Button>
        </div>
      </Actionbar>
    </MemoryRouter>
  </IntlProvider>
);

export default {
  component,
  props,
};

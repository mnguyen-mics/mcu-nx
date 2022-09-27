import * as React from 'react';
import { openNextDrawer, closeNextDrawer } from './DrawerStore';
import injectDrawer from './injectDrawer';

export type DrawerSize = 'large' | 'small' | 'medium' | 'extrasmall';

export interface DrawableContentOptions<T = {}> {
  additionalProps: T;
  size?: DrawerSize;
  isModal?: boolean;
  className?: string;
  closingDrawerClassName?: string;
}

export interface DrawableContent extends DrawableContentOptions {
  component: React.ComponentClass;
}

export { openNextDrawer, closeNextDrawer, injectDrawer };

import { connect } from 'react-redux';
import { closeNextDrawer, openNextDrawer } from './DrawerStore';
import { DrawableContentOptions } from './types';

export interface InjectedDrawerProps {
  openNextDrawer: <T>(
    component: React.ComponentClass<T>,
    options: DrawableContentOptions<T>,
  ) => void;
  closeNextDrawer: () => void;
}

const mapDispatchToProps = {
  closeNextDrawer,
  openNextDrawer,
};

export default connect(undefined, mapDispatchToProps) as any;

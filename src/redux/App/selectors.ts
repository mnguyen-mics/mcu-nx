import { MicsReduxState } from '../ReduxHelper';

const isAppInitialized = (state: MicsReduxState) => {
  return state.app.initialized;
};

export { isAppInitialized };

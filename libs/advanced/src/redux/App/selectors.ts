import { MicsReduxState } from '../../utils/MicsReduxState';

const isAppInitialized = (state: MicsReduxState) => {
  return state.app.initialized;
};

export { isAppInitialized };

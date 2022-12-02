import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { apiRequest, logoutListener } from '../middleware';
import rootReducer from '../reducers';
import sagas from '../sagas';
import container from '../../inversify/inversify.config';
import { TYPES } from '../../constants/types';
import { IAuthService } from '../../services/AuthService';
import { MicsReduxState } from '../../utils/ReduxHelper';
import { ILabelService } from '../../services/LabelsService';
import { IOrganisationService } from '../../services/OrganisationService';

function bindDependencies(
  func: (
    authService: IAuthService,
    labelService: ILabelService,
    organisationService: IOrganisationService,
    state: MicsReduxState,
  ) => void,
  dependencies: symbol[],
) {
  const injections = dependencies.map(dependency => {
    return container.container.get(dependency);
  });
  return func.bind(func, ...injections);
}

export { bindDependencies };

function configureStore(
  authService: IAuthService,
  labelService: ILabelService,
  organisationService: IOrganisationService,
  preloadedState: MicsReduxState,
) {
  const middlewares = [];

  const sagaMiddleware = createSagaMiddleware({
    context: {
      authService: authService,
      labelService: labelService,
      organisationService: organisationService,
    },
  });

  middlewares.push(logoutListener);
  middlewares.push(thunkMiddleware);
  middlewares.push(apiRequest);
  middlewares.push(sagaMiddleware);

  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-undef, no-underscore-dangle

  const store = preloadedState
    ? createStore(
        rootReducer,
        preloadedState as any,
        composeEnhancers(applyMiddleware(...middlewares)),
      )
    : createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)));

  sagaMiddleware.run(sagas);

  return store;
}

export default bindDependencies(configureStore, [
  TYPES.IAuthService,
  TYPES.ILabelService,
  TYPES.IOrganisationService,
]);

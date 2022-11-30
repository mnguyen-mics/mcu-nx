import { combineReducers } from 'redux';
import FeaturesReducer from '../Features/reducer';
import FormReducer from './FormReducer';
import LabelsReducers from '../Labels/reducer';
import SessionReducers from '../Session/reducer';
import NotificationsReducers from '../Notifications/reducer';
import keycloakPostLoginReducer from '../KeycloakPostLogin/reducer';
import { drawerReducer } from '../../components/drawer/DrawerStore';

const allReducers = {
  ...keycloakPostLoginReducer,
  ...FeaturesReducer,
  ...LabelsReducers,
  ...SessionReducers,
  ...NotificationsReducers,
  ...FormReducer,
  ...drawerReducer,
};

export default combineReducers(allReducers);

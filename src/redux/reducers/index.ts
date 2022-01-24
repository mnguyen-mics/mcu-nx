import { combineReducers } from 'redux';
import FeaturesReducer from '../Features/reducer';
import FormReducer from './FormReducer';
import LabelsReducers from '../Labels/reducer';
import LoginReducers from '../Login/reducer';
import SessionReducers from '../Session/reducer';
import NotificationsReducers from '../Notifications/reducer';
import AppReducer from '../App/reducer';
import KeycloakService from '../../services/KeycloakService';
import keycloakPostLoginReducer from '../KeycloakPostLogin/reducer';
import { drawerReducer } from '../../components/drawer/DrawerStore';

const allReducers = KeycloakService.isKeycloakEnabled()
  ? {
      ...keycloakPostLoginReducer,
      ...FeaturesReducer,
      ...LabelsReducers,
      ...SessionReducers,
      ...NotificationsReducers,
      ...FormReducer,
      ...drawerReducer,
    }
  : {
      ...AppReducer,
      ...FeaturesReducer,
      ...NotificationsReducers,
      ...LoginReducers,
      ...SessionReducers,
      ...LabelsReducers,
      ...FormReducer,
      ...drawerReducer,
    };

export default combineReducers(allReducers);

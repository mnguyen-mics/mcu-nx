import { combineReducers } from 'redux';
import FeaturesReducer from '../Features/reducer';
import LabelsReducers from '../Labels/reducer';
import LoginReducers from '../Login/reducer';
import SessionReducers from '../Session/reducer';
import NotificationsReducers from '../Notifications/reducer';
import AppReducer from '../App/reducer';
import KeycloakService from '../../services/KeycloakService';
import keycloakPostLoginReducer from '../KeycloakPostLogin/reducer';
import FormReducer from './FormReducer';

const allReducers = KeycloakService.isKeycloakEnabled()
  ? {
      ...keycloakPostLoginReducer,
      ...FeaturesReducer,
      ...LabelsReducers,
      ...SessionReducers,
      ...NotificationsReducers,
      ...FormReducer,
    }
  : {
      ...AppReducer,
      ...FeaturesReducer,
      ...NotificationsReducers,
      ...LoginReducers,
      ...SessionReducers,
      ...LabelsReducers,
      ...FormReducer,
    };

export default combineReducers(allReducers);

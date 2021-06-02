import { combineReducers } from 'redux';
import FeaturesReducer from '../Features/reducer';
import LabelsReducers from '../Labels/reducer';
import LoginReducers from '../Login/reducer';
import SessionReducers from '../Session/reducer';
import NotificationsReducers from '../Notifications/reducer';

const allReducers = Object.assign(
  {},
  FeaturesReducer,
  NotificationsReducers,
  LoginReducers,
  SessionReducers,
  LabelsReducers,
);

export default combineReducers(allReducers);

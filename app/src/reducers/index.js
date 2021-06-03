import { combineReducers } from 'redux';
import { LoginReducers, FeaturesReducer, LabelsReducers, SessionReducers, NotificationsReducers } from '@mediarithmics-private/advanced-component';
import AppReducer from '../redux/App/reducer.ts';


const allReducers = Object.assign(
  {},
  AppReducer,
  LoginReducers,
  SessionReducers,
  LabelsReducers
);

export default combineReducers(allReducers);

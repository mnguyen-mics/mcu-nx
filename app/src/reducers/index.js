import { combineReducers } from 'redux';
import { LoginReducers } from '@mediarithmics-private/advanced-component';
import AppReducer from '../redux/App/reducer.ts';


const allReducers = Object.assign(
  {},
  AppReducer,
  LoginReducers
);

export default combineReducers(allReducers);

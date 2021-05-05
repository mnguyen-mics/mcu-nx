import { combineReducers } from 'redux';
import AppReducer from '../redux/App/reducer.ts';

const allReducers = Object.assign(
  {},
  AppReducer,
);

export default combineReducers(allReducers);

import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form'
import authReducer from './auth_reducer';
import bandsReducer from './bands_reducer';

import { routerReducer } from 'react-router-redux'


const rootReducer = combineReducers({
  form,
  auth: authReducer,
  music: bandsReducer,
  router: routerReducer,
});

export default rootReducer;

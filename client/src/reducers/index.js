import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import authReducer from './auth_reducer';
import musicReducer from './music_reducer';

import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  form,
  auth: authReducer,
  music: musicReducer,
  router: routerReducer
});

export default rootReducer;

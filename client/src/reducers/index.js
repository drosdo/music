import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form'
import authReducer from './auth_reducer';
import { routerReducer } from 'react-router-redux'


const rootReducer = combineReducers({
  form,
  auth: authReducer,
  router: routerReducer
});

export default rootReducer;

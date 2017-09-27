import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createHistory from 'history/createBrowserHistory'
import { Route } from 'react-router'
import 'babel-polyfill';

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import reduxThunk from 'redux-thunk';


import App from './components/app';
import Header from './components/header';
import Signin from './components/auth/signin';
import Signout from './components/auth/signout';
import Signup from './components/auth/signup';
import Feature from './components/feature';
import RequireAuth from './components/auth/require_auth';
import Welcome from './components/welcome';
import { AUTH_USER } from './actions/types';
import reducers from './reducers';

const initialState = {auth: { authenticated: false, error: ''} }
const history = createHistory()

const middleware = [
  reduxThunk,
  routerMiddleware(history)
]

const store = createStore(
  reducers,
  applyMiddleware(...middleware)
)


const token = localStorage.getItem('token');
// If we have a token, consider the user to be signed in
if (token) {
  // we need to update application state
  store.dispatch({ type: AUTH_USER });
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Header/>
        <Route exact path="/" component={Welcome} />
        <Route path="/signin" component={Signin} />
        <Route path="/signout" component={Signout} />
        <Route path="/signup" component={Signup} />
        <Route path="/feature" component={RequireAuth(Feature)} />
      </div>
    </ConnectedRouter>
  </Provider>
  , document.querySelector('.container'));

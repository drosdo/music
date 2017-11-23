import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import createHistory from 'history/createBrowserHistory';
import { Route } from 'react-router';
import 'babel-polyfill';
import { List } from 'immutable';

import { ConnectedRouter, routerMiddleware } from 'react-router-redux';

import reduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

const logger = createLogger({
  level: 'info',
  collapsed: true,
  stateTransformer: state => state
});

import Header from './components/header';
import Signin from './components/auth/signin';
import Signout from './components/auth/signout';
import Signup from './components/auth/signup';
import Feature from './components/feature';
import Music from './components/music/';
import Search from './components/music/search-results';

import requireAuth from './components/auth/require_auth';
import musicRedirect from './components/music/redirect';

// import GuestAccessFor from './components/auth/require_auth_or_url';
import Welcome from './components/welcome';
import { AUTH_USER } from './actions/types';
import reducers from './reducers';

import './style/reset.css';
import './style/app.styl';

const initialState = {
  auth: { authenticated: false, guest: false, error: '' },
  // music: {
  //   bands: new List(),
  //   albums: new List(),
  //   songs: new List()
  // }
  music: {
    isFetching: true,
    didInvalidate: false,
    playingSongId: '',
    items: {
      bands: new List(),
      albums: new List(),
      songs: new List()
    }
  }
};
const history = createHistory();

const middleware = [reduxThunk, routerMiddleware(history), logger];

const store = createStore(
  reducers,
  initialState,
  applyMiddleware(...middleware)
);

const token = localStorage.getItem('token');
// If we have a token, consider the user to be signed in
if (token) {
  // we need to update application state
  store.dispatch({ type: AUTH_USER });
}

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div className='container2'>
          <Header />
          <Route exact path='/'
            component={Welcome} />
          <Route path='/signin' component={Signin} />
          <Route path='/signout' component={Signout} />
          <Route path='/signup' component={Signup} />
          <Route path='/feature' component={requireAuth(Feature)} />
          <Route exact path='/music'
            component={musicRedirect(Music)} />
          <Route exact path='/search'
            component={Search} />

          <Route exact path='/music/:band/'
            component={musicRedirect(Music)} />
          <Route path='/music/:band/:album' component={Music} />
        </div>
      </ConnectedRouter>
    </Provider>,
    document.querySelector('.container')
  );
});

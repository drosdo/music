import axios from 'axios';
import { push } from 'react-router-redux';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE,
  REQUEST_MUSIC,
  RECEIVE_MUSIC,
  PLAYING_SONG
} from './types';

const ROOT_URL = 'http://localhost:3090';
// const ROOT_URL = 'http://37be1641.ngrok.io';

export function signinUser({ email, password }) {
  return function(dispatch) {
    // Submit email/password to the server
    axios
      .post(`${ROOT_URL}/signin`, { email, password })
      .then(response => {
        // If request is good...
        // - Update state to indicate user is authenticated
        dispatch({ type: AUTH_USER });
        // - Save the JWT token
        localStorage.setItem('token', response.data.token);
        // - redirect to the route '/feature'

        dispatch(push('/feature'));
        console.log('AUTH_USER');
      })
      .catch(() => {
        // If request is bad...
        // - Show an error to the user
        dispatch(authError('Bad Login Info'));
      });
  };
}

export function signupUser({ email, password }) {
  return function(dispatch) {
    axios
      .post(`${ROOT_URL}/signup`, { email, password })
      .then(response => {
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
        dispatch(push('/feature'));
      })
      .catch(response => dispatch(authError(response.data.error)));
  };
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function signoutUser() {
  localStorage.removeItem('token');

  return { type: UNAUTH_USER };
}
// export function checkGuestUrl(path, foo) {
//   return function(dispatch) {
//     axios
//       .get(ROOT_URL + '/checkguesturl', {
//         headers: { authorization: localStorage.getItem('token') },
//         params: {
//           foo,
//           path
//         }
//       })
//       .then(response => {
//         console.log(response);
//         if (response.data === 'wrong') {
//           dispatch({
//             type: UNAUTH_GUEST,
//             payload: response.data
//           });
//           dispatch(push('/signin'));
//         } else {
//           dispatch({
//             type: AUTH_GUEST,
//             payload: response.data
//           });
//         }
//       })
//       .catch(response => {
//         dispatch(push('/signin'));
//         dispatch({
//           type: UNAUTH_GUEST,
//           payload: response
//         });
//       });
//   };
// }

export function fetchMessage() {
  return function(dispatch) {
    axios
      .get(ROOT_URL, {
        headers: { authorization: localStorage.getItem('token') }
      })
      .then(response => {
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        });
      });
  };
}

function requestMusic() {
  return {
    type: REQUEST_MUSIC
  };
}
function receiveMusic(data) {
  return {
    type: RECEIVE_MUSIC,
    payload: data,
    receivedAt: Date.now()
  };
}

function fetchMusic() {
  return dispatch => {
    dispatch(requestMusic());
    return axios.get(ROOT_URL + '/get-music').then(response => {
      dispatch(receiveMusic(response.data));
    });
  };
}

function shouldFetchMusic(state) {
  const music = state.music;
  if (!music.items.length) {
    return true;
  } else if (music.isFetching) {
    return false;
  }
  return music.didInvalidate;
}

export function fetchMusicIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.
  return (dispatch, getState) => {
    if (shouldFetchMusic(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchMusic());
    }
    // Let the calling code know there's nothing to wait for.
    return Promise.resolve();
  };
}

export function setPlayingSong(id) {
  return {
    type: PLAYING_SONG,
    payload: id
  };
}

import axios from 'axios';
import { push } from 'react-router-redux';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE,
  AUTH_GUEST,
  UNAUTH_GUEST,
  GET_SONG_LIST,
  GET_BANDS,
  UPDATE_ALBUMS,
  GET_ALBUMS,
  GET_SONGS
} from './types';

const ROOT_URL = 'http://localhost:3090';
//const ROOT_URL = 'http://37be1641.ngrok.io';

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
export function getSongList(path, foo) {
  return function(dispatch) {
    axios
      .get(ROOT_URL + '/get_song_list', {
        headers: { authorization: localStorage.getItem('token') },
        params: {
          foo,
          path
        }
      })
      .then(response => {
        console.log(response);
        if (response.data === 'wrong') {
          dispatch({
            type: UNAUTH_GUEST,
            payload: response.data
          });
          dispatch(push('/signin'));
        } else {
          dispatch({
            type: AUTH_GUEST,
            payload: response.data
          });
        }
      })
      .catch(response => {
        dispatch(push('/signin'));
        dispatch({
          type: UNAUTH_GUEST,
          payload: response
        });
      });
  };
}

export function getBands(path, foo) {
  return function(dispatch) {
    axios
      .get(ROOT_URL + '/get_bands')
      .then(response => {
        console.log(response);
        dispatch({
          type: GET_BANDS,
          payload: response.data
        });
      })
      .catch(response => {

      });
  };
}


export function getAlbums(band) {
  return function(dispatch) {
    axios
      .get(ROOT_URL + '/get-albums', {
        params: {
          band
        }
      })
      .then(response => {
        console.log('get-albums',response);
        dispatch({
          type: GET_ALBUMS,
          payload: response.data
        });
      })
      .catch(response => {

      });
  };
}

export function getSongs(band, album) {
  return function(dispatch) {
    axios
      .get(ROOT_URL + '/get-songs', {
        params: {
          band,
          album
        }
      })
      .then(response => {
        console.log('get-songs',response);
        dispatch({
          type: GET_SONGS,
          payload: response.data
        });
      })
      .catch(response => {

      });
  };
}

export function updateAlbums(band) {
  return function(dispatch) {
    axios
      .get(ROOT_URL + '/update_albums', {
        params: {
          band
        }
      })
      .then(response => {
        console.log('updateAlbums', response);
        dispatch({
          type: UPDATE_ALBUMS,
          payload: response.data
        });
      })
      .catch(response => {

      });
  };
}


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

import { fromJS } from 'immutable';
import {
  REQUEST_MUSIC,
  RECEIVE_MUSIC,
  PLAYING_SONG,
  RECEIVE_SONGS
} from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case REQUEST_MUSIC:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case RECEIVE_MUSIC:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: musicToImmutable(state.items, action.payload),
        lastUpdated: action.receivedAt
      });
    case RECEIVE_SONGS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: setSongs(state.items, action.payload),
        lastUpdated: action.receivedAt
      });
    case PLAYING_SONG:
      return { ...state, playingSongId: action.payload };
    default:
      return state;
  }
}

function setSongs(state = {}, data) {
  const songs = state.songs.merge(fromJS(data));
  return { ...state, songs };
}

function musicToImmutable(state = {}, data) {
  const bands = fromJS(data.bands);
  const albums = fromJS(data.albums);
  // const songs = fromJS(data.songs);
  const songs = state.songs.merge(fromJS(data.songs));

  return {
    bands,
    albums,
    songs
  };
}

// function getMusic(state, payload) {
//   const bands = state.bands.merge(fromJS(payload.bands));
//   const albums = state.albums.merge(fromJS(payload.albums));
//   const songs = state.songs.merge(fromJS(payload.songs));
//
//   return {
//     ...state,
//     bands,
//     albums,
//     songs
//   };
// }

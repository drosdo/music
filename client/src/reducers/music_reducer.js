import { Map, List, fromJS } from 'immutable';
import {
  REQUEST_MUSIC,
  RECEIVE_MUSIC
} from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case RECEIVE_MUSIC:
    case REQUEST_MUSIC:
      return Object.assign({}, state, music(state.music, action));
  }

  return state;
}

function music(
  state = {
    isFetching: true,
    didInvalidate: false,
    items: []
  },
  action
) {
  switch (action.type) {
    // case INVALIDATE_SUBREDDIT:
    //   return Object.assign({}, state, {
    //     didInvalidate: true
    //   })
    case REQUEST_MUSIC:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case RECEIVE_MUSIC:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: musicToImmutable(action.payload),
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
}

function musicToImmutable(music) {
  const bands = fromJS(music.bands);
  const albums = fromJS(music.albums);
  const songs = fromJS(music.songs);

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

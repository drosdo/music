import { fromJS } from 'immutable';
import { REQUEST_MUSIC, RECEIVE_MUSIC, PLAYING_SONG } from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case RECEIVE_MUSIC:
    case REQUEST_MUSIC:
      return Object.assign({}, state, music(state.music, action));
    case PLAYING_SONG:
      return { ...state, playingSongId: action.payload };
    default:
      return state;
  }
}

function music(state, action) {
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

function musicToImmutable(data) {
  const bands = fromJS(data.bands);
  const albums = fromJS(data.albums);
  const songs = fromJS(data.songs);

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

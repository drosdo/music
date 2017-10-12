import { GET_BANDS, GET_ALBUMS, GET_SONGS } from '../actions/types';

export default function(state = {}, action) {
  console.log(action.type);
  switch (action.type) {
    case GET_BANDS:
      return { ...state, bands: action.payload };
    case GET_ALBUMS:
      return { ...state, albums: action.payload };
    case GET_SONGS:
      return { ...state, songs: action.payload };
  }

  return state;
}

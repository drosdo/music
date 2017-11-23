import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { withRouter, Link } from 'react-router-dom';

import Albums from './albums';
import Songs from './songs';
import Upload from './upload';
import styles from './style/music.styl';
import cx from 'classnames';
import ImmutablePropTypes from 'react-immutable-proptypes';

class Music extends Component {
  static propTypes = {
    albums: ImmutablePropTypes.list,
    authenticated: React.PropTypes.bool,
    bands: ImmutablePropTypes.list,
    isFetching: React.PropTypes.bool,
    getMusicByAlbum: React.PropTypes.func,
    match: React.PropTypes.shape({
      params: React.PropTypes.shape({
        band: React.PropTypes.node,
        album: React.PropTypes.node
      }).isRequired
    }).isRequired,
    songs: ImmutablePropTypes.list
  };
  componentDidMount() {
    const { band, album } = this.props.match.params;
    const { songs } = this.props;
    let hasAlbum = songs.findIndex(
      song => song.get('album').toLowerCase() === album
    );
    console.log(album, hasAlbum);

    if (hasAlbum < 0) {
      this.props.getMusicByAlbum(band, album);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { album } = this.props.match.params;
    const nextAlbum = nextProps.match.params.album;
    const nextBand = nextProps.match.params.band;
    const { songs } = nextProps;
    let hasAlbum;
    if (nextAlbum !== album) {
      hasAlbum = songs.findIndex(
        song => song.get('album').toLowerCase() === nextAlbum
      );
      console.log(nextAlbum, hasAlbum);
      if (hasAlbum < 0) {
        this.props.getMusicByAlbum(nextBand, nextAlbum);
      }
    }
  }
  renderBands() {
    const bandSelected = this.props.match.params.band;
    const { bands } = this.props;

    return bands.valueSeq().map(band => {
      let bandItemLowerCase = band.get('name').toLowerCase();
      let itemClasses = cx({
        subnav__item: true,
        _active: bandSelected === bandItemLowerCase
      });
      return (
        <li className={itemClasses} key={band.get('_id')}>
          <Link to={`/music/${bandItemLowerCase}`}>{band.get('name')}</Link>
        </li>
      );
    });
  }
  render() {
    const { band, album } = this.props.match.params;
    const { songs, albums, isFetching } = this.props;
    let songsPerAlbum;
    let albumsPerBand;

    if (!isFetching) {
      songsPerAlbum = songs.filter(song => {
        return song.get('album').toLowerCase() === album;
      });
      albumsPerBand = albums.filter(
        albumItem => albumItem.get('band').toLowerCase() === band
      );
    }

    return (
      <div className='container3'>
        <ul className='subnav'>
          {!isFetching ? this.renderBands() : 'loading...'}
        </ul>
        <div className='wrap'>
          <div className='sidebar'>
            {!isFetching ? (
              <Albums band={band} albums={albumsPerBand} />
            ) : (
              'loading...'
            )}
          </div>
          <div className='content'>
            {!isFetching ? (
              <div className={styles.music}>
                <h1>Songs for {album}</h1>
                <Songs songs={songsPerAlbum} />
              </div>
            ) : (
              'loading...'
            )}
          </div>
          <div className='sidebar'>side 2</div>
        </div>
        <div className='footer'>
          <Upload band={band} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isFetching, items: { bands, albums, songs } } = state.music;
  const { authenticated } = state.auth;

  return {
    isFetching,
    bands,
    albums,
    songs,
    authenticated
  };
}

export default withRouter(connect(mapStateToProps, actions)(Music));

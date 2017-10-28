import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { withRouter, Link } from 'react-router-dom';

import Albums from './albums';
import Songs from './songs';
import Upload from './upload';
import styles from './style/music.styl';
import cx from 'classnames';

class Music extends Component {
  // componentWillMount() {
  //   const { band, album } = this.props.match.params;
  //   const selectedBand = !band ? null : band;
  //   const selectedAlbum = !album ? null : album;
  //
  //   //this.props.getMusic(selectedBand, selectedAlbum);
  // }
  // componentDidMount() {
  //   console.log('componentDidMount');
  // }
  // componentDidUpdate() {
  //   console.log('componentDidUpdate');
  // }
  // shouldComponentUpdate(nextProps){
  //   console.log(nextProps.bands);
  // }
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
    const { songs, bands, albums, isFetching } = this.props;
    let songsPerAlbum;
    let albumsPerBand

    if (!isFetching) {
       songsPerAlbum = songs.filter(
        song => song.get('album').toLowerCase() === album
      );
       albumsPerBand = albums.filter(
        album => album.get('band').toLowerCase() === band
      );
    }
    
    return (
      <div>
        <ul className="subnav">
          {!isFetching ? this.renderBands() : 'loading...'}
        </ul>
        <div className="wrap">
          <div className="sidebar">
            {!isFetching ? (
              <Albums band={band} albums={albumsPerBand} />
            ) : (
              'loading...'
            )}
          </div>
          <div className="content">
            {!isFetching ? (
              <div className={styles.music}>
                <Songs band={band} album={album} songs={songsPerAlbum} />
                <Upload band={band} />
              </div>
            ) : (
              'loading...'
            )}
          </div>
          <div className="sidebar">side 2</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.music.isFetching,
    guest: state.auth.guest,
    bands: state.music.items.bands,
    albums: state.music.items.albums,
    songs: state.music.items.songs,
    authenticated: state.auth.authenticated
  };
}

export default withRouter(connect(mapStateToProps, actions)(Music));

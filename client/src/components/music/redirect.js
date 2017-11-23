import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';

export default function(ComposedComponent) {
  class MusicRedirect extends Component {
    static propTypes = {
      albums: ImmutablePropTypes.list,
      bands: ImmutablePropTypes.list,
      isFetching: React.PropTypes.bool,
      match: React.PropTypes.shape({
        params: React.PropTypes.shape({
          band: React.PropTypes.node,
          album: React.PropTypes.node
        }).isRequired
      }).isRequired,
      history: React.PropTypes.object.isRequired
    };

    componentWillMount() {
      const { isFetching, bands, albums } = this.props;
      const hasBands = bands.size > 0;
      const hasAlbums = albums.size > 0;

      if (hasBands && hasAlbums && !isFetching) {
        this.redirectIfNeedIt(bands, albums);
      }
    }

    componentWillReceiveProps(nextProps) {
      const { bands, albums, isFetching } = nextProps;
      const hasBands = bands.size > 0;
      const hasAlbums = albums.size > 0;

      if (hasBands && hasAlbums && !isFetching) {
        this.redirectIfNeedIt(bands, albums);
      }
    }

    getDefaultBand(bands) {
      return bands
        .first()
        .get('name')
        .toLowerCase();
    }

    getDefaultAlbum(band, albums) {
      const albumsPerBand = albums.filter(
        album => album.get('band').toLowerCase() === band
      );
      return albumsPerBand
        .first()
        .get('name')
        .toLowerCase();
    }

    redirectIfNeedIt(bands, albums) {
      const { band, album } = this.props.match.params;
      const selectedBand = !band ? null : band;
      const selectedAlbum = !album ? null : album;
      let defaultBand;
      let defaultAlbum;

      if (!selectedBand) {
        defaultBand = this.getDefaultBand(bands);
        defaultAlbum = this.getDefaultAlbum(defaultBand, albums);
        this.props.history.push(`/music/${defaultBand}/${defaultAlbum}`);
      }
      if (selectedBand && !selectedAlbum) {
        defaultAlbum = this.getDefaultAlbum(selectedBand, albums);
        this.props.history.push(`/music/${selectedBand}/${defaultAlbum}`);
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      isFetching: state.music.isFetching,
      bands: state.music.items.bands,
      albums: state.music.items.albums
    };
  }

  return withRouter(connect(mapStateToProps)(MusicRedirect));
}

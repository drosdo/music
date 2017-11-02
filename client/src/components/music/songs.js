import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { withRouter } from 'react-router-dom';
import styles from './style/music.styl';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Waveform from './waveform';

class Songs extends Component {
  static propTypes = {
    album: React.PropTypes.string,
    authenticated: React.PropTypes.bool,
    band: React.PropTypes.string,
    isFetching: React.PropTypes.bool,
    playingSongId: React.PropTypes.string,
    setPlayingSong: React.PropTypes.func,
    songs: ImmutablePropTypes.list
  };

  setPlayingSong(id) {
    this.props.setPlayingSong(id);
  }

  renderSongs() {
    const { songs, playingSongId } = this.props;
    return songs.valueSeq().map(song => {
      return (
        <Waveform
          key={song.get('_id')}
          playingSongId={playingSongId}
          setPlayingSong={this.setPlayingSong.bind(this)}
          song={song.toJS()}
        />
      );
    });
  }

  render() {
    return <div className={styles.songs}>{this.renderSongs()}</div>;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    guest: state.auth.guest,
    authenticated: state.auth.authenticated,
    playingSongId: state.music.playingSongId
  };
}

export default withRouter(connect(mapStateToProps, actions)(Songs));

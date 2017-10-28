import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import Waveform from './waveform';

class Songs extends Component {
  componentWillMount() {
    const { band, album } = this.props;
  }
  componentDidUpdate(prevProps) {
    // const { band, album } = this.props;
    // if (prevProps.album !== album) {
    //   this.props.getSongs(band, album);
    // }
  }

  renderSongs() {
    const { songs } = this.props;
    return songs.valueSeq().map(song => {
      return <Waveform key={song.get('_id')} song={song.toJS()} />;
    });
  }

  render() {
    const { band, album } = this.props;
    return (
      <div>
        <h1>Songs for {album}</h1>
        {this.renderSongs()}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    guest: state.auth.guest,
    authenticated: state.auth.authenticated
    };
}

export default withRouter(connect(mapStateToProps, actions)(Songs));

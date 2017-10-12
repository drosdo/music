import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { withRouter } from 'react-router-dom';
import _ from "lodash";

import Waveform from './waveform';

class Songs extends Component {

  componentWillMount() {
    const {band, album} = this.props;
    console.log(band, album);
    this.props.getSongs(band, album);
  }
  renderSongs(){
    console.log(this.props);
    return _.map(this.props.songs, song => {
      return (
        <Waveform key={song._id} song={song}/>
      );
    });
  }

  render() {
    return (
      <div>
        <h1>Songs</h1>
        {this.renderSongs()}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    guest: state.auth.guest,
    authenticated: state.auth.authenticated,
    songs: state.music.songs,
  };
}

export default withRouter(connect(mapStateToProps, actions)(Songs));

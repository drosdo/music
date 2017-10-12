import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { withRouter } from 'react-router-dom';
import _ from "lodash";


import Waveform from './waveform';


class MusicList extends Component {
  componentWillMount() {
    this.props.getAlbums(this.props.match.params.band);

    //this.props.getAlbums(this.props.band);
  }
  // renderSongs() {
  //   return _.map(this.props.songList.entries, song => {
  //     return (
  //       <li key={song.id}>
  //         <Waveform folder={this.props.match.params.id} name={song.name.replace(/\.[^/.]+$/, "")}/>
  //       </li>
  //     );
  //   });
  // }
  renderAlbums(){
    console.log(this.props.albums);
    return _.map(this.props.albums, album => {
      return (
        <li key={album._id}>
          {album.name}
        </li>
      );
    });
  }


  render() {
    return (
      <div>
        <h1>MusicList</h1>

        {this.renderAlbums()}

        <Upload/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(state);
  return {
    guest: state.auth.guest,
    authenticated: state.auth.authenticated,
    albums: state.music.albums,
  };
}

export default withRouter(connect(mapStateToProps, actions)(MusicList));

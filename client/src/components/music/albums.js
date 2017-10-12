import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { withRouter } from 'react-router-dom';
import _ from "lodash";



class Albums extends Component {

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
        <h1>Albums</h1>
        {this.renderAlbums()}
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

export default withRouter(connect(mapStateToProps, actions)(Albums));

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';

class Albums extends Component {
  componentWillMount() {
    const { band } = this.props;

    this.props.getAlbums(band);
    //  this.props.getSongs(band, 'megariff');
  }
  renderAlbums() {
    const { albums, band } = this.props;
    return _.map(albums, album => {
      let path = `/music/${band}/${album.name}`;
      return (
        <li key={album._id}>
          <Link to={path}>{album.name}</Link>
        </li>
      );
    });
  }

  render() {
    const { albums, band } = this.props;
    return (
      <div>
        <h1>Albums</h1>
        {this.renderAlbums()}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    guest: state.auth.guest,
    authenticated: state.auth.authenticated,
    albums: state.music.albums
  };
}

export default withRouter(connect(mapStateToProps, actions)(Albums));

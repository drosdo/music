import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';

class Albums extends Component {

  renderAlbums() {
    const { albums, band } = this.props;
    return albums.valueSeq().map(album => {
      let path = `/music/${band}/${album.get('name').toLowerCase()}`;
      return (
        <li key={album.get('_id')}>
          <Link to={path}>{album.get('name')}</Link>
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
    authenticated: state.auth.authenticated
    };
}

export default withRouter(connect(mapStateToProps, actions)(Albums));

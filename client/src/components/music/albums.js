import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { withRouter, Link } from 'react-router-dom';

class Albums extends Component {
  static propTypes = {
    albums: React.PropTypes.object,
    band: React.PropTypes.object
  };

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

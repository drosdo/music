import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { withRouter } from 'react-router-dom';

import Albums from './albums';
import Songs from './songs';
import Upload from './upload';



class Music extends Component {
  componentWillMount() {
    const {band} = this.props.match.params;
    this.props.getBands();
    this.props.getAlbums(band);
  //  this.props.getSongs(band, 'megariff');
  }

  renderNav() {
    return _.map(this.props.bands, band => {
      return (
        <li key={band._id}>
          {band.name}
        </li>
      );
    });
  }
  render() {
    const {band} = this.props.match.params;
    return (
      <div>
        {this.renderNav()}
        <Albums band={band}/>
        <Songs band={band} album={'superRiff40'}/>

        <Upload band={band}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { guest: state.auth.guest, bands: state.music.bands,  authenticated: state.auth.authenticated };
}

export default withRouter(connect(mapStateToProps, actions)(Music));

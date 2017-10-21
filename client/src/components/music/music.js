import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { withRouter, Link } from 'react-router-dom';

import Albums from './albums';
import Songs from './songs';
import Upload from './upload';
import styles from './style/music.styl';

class Music extends Component {
  componentWillMount() {
    const { band } = this.props.match.params;
    this.props.getBands();
    //this.props.getAlbums(band);
    //  this.props.getSongs(band, 'megariff');
  }

  renderNav() {
    return _.map(this.props.bands, band => {
      return (
        <li key={band._id}>
          <Link to={`/music/${band.name}`}>{band.name}</Link>
        </li>
      );
    });
  }
  render() {
    const { band } = this.props.match.params;
    const { album } = this.props.match.params;
    console.log(styles);
    return (
      <div className="wrap">
        <div className="sidebar">
          {this.renderNav()}
          <Albums band={band} />
        </div>
        <div className="content">
          <div className={styles.music}>
            <Songs band={band} album={album} />
            <Upload band={band} />
          </div>
        </div>
        <div className="sidebar">side 2</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    guest: state.auth.guest,
    bands: state.music.bands,
    authenticated: state.auth.authenticated
  };
}

export default withRouter(connect(mapStateToProps, actions)(Music));

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { withRouter } from 'react-router-dom';

import Songs from './songs';
import styles from './style/music.styl';
import ImmutablePropTypes from 'react-immutable-proptypes';

class Search extends Component {
  static propTypes = {
    isFetching: React.PropTypes.bool,
    songs: ImmutablePropTypes.list
  };

  /* renderBands() {
    const { bands } = this.props;

    return bands.valueSeq().map(band => {
      let bandItemLowerCase = band.get('name').toLowerCase();
      let itemClasses = cx({
        subnav__item: true
      });
      return (
        <li className={itemClasses} key={band.get('_id')}>
          <Link to={`/music/${bandItemLowerCase}`}>{band.get('name')}</Link>
        </li>
      );
    });
  }*/
  render() {
    const { songs, isFetching } = this.props;

    return (
      <div className='container3'>
        <ul className='subnav' />
        <div className='wrap'>
          <div className='sidebar' />
          <div className='content'>
            {!isFetching ? (
              <div className={styles.music}>
                <h1>Songs</h1>
                <Songs songs={songs} />
              </div>
            ) : (
              'loading...'
            )}
          </div>
          <div className='sidebar'>side 2</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isFetching, items: { songs } } = state.music;

  return {
    isFetching,
    songs
  };
}

export default withRouter(connect(mapStateToProps, actions)(Search));

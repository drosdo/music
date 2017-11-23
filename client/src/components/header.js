import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import * as actions from '../actions';
import _ from 'lodash';

import SearchBar from './music/search-bar';

class Header extends Component {
  static propTypes = {
    authenticated: React.PropTypes.bool,
    searchMusic: React.PropTypes.func
  };
  renderLinks() {
    if (this.props.authenticated) {
      // show a link to sign out
      return (
        <li className='nav-item'>
          <Link className='nav-link' key={1}
            to='/signout'>
            Sign Out
          </Link>
        </li>
      );
    }
    // show a link to sign in or sign up
    return [
      <li className='nav-item' key={1}>
        <Link className='nav-link' to='/signin'>
          Sign In
        </Link>
      </li>,
      <li className='nav-item' key={2}>
        <Link className='nav-link' to='/signup'>
          Sign Up
        </Link>
      </li>
    ];
  }

  render() {
    const musicSearch = _.debounce(term => {
      console.log(term);
      if (term.length > 3) {
        this.props.searchMusic(term);
      }
    }, 300);

    return (
      <div className='header'>
        <nav className='navbar'>
          <Link to='/' className='logo'>
            drosdo
          </Link>
          <ul className='nav'>
            <li className='nav-item' key={1}>
              <Link className='nav-link' to='/music'>
                Музыка
              </Link>
            </li>
          </ul>
          <SearchBar onSearchTermChange={musicSearch} />
          <ul className='nav nav-right'>{this.renderLinks()}</ul>
        </nav>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  };
}

export default withRouter(connect(mapStateToProps, actions)(Header));

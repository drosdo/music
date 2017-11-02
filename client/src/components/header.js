import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

class Header extends Component {
  static propTypes = {
    authenticated: React.PropTypes.string
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

export default withRouter(connect(mapStateToProps)(Header));

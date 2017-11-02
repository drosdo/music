import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { withRouter } from 'react-router-dom';

export default function(ComposedComponent) {
  class GuestAccessFor extends Component {
    static contextTypes = {
      router: React.PropTypes.object
    };

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return { guest: state.auth.guest, router: state.router };
  }

  return withRouter(connect(mapStateToProps, actions)(GuestAccessFor));
}

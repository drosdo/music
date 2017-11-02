import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import renderInput from './input';

class Signin extends Component {
  static propTypes = {
    errorMessage: React.PropTypes.string,
    handleSubmit: React.PropTypes.func,
    signinUser: React.PropTypes.func
  };

  handleFormSubmit({ email, password }) {
    this.props.signinUser({ email, password });
  }

  renderAlert() {
    const { errorMessage } = this.prop;
    return (
      <div>
        {errorMessage && (
          <div className='alert alert-danger'>
            <strong>Oops!</strong> {this.props.errorMessage}
          </div>
        )}
      </div>
    );
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <fieldset className='form-group'>
          <label>Email:</label>
          <Field
            name='email' // Specify field name
            component={renderInput} // Specify render component above
            type='text'
          />
        </fieldset>
        <fieldset className='form-group'>
          <label>Password:</label>
          <Field
            name='password' // Specify field name
            component={renderInput} // Specify render component above
            type='password'
          />
        </fieldset>
        {this.renderAlert()}
        <button action='submit' className='btn btn-primary'>
          Sign in
        </button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error, router: state.router };
}

export default reduxForm({ form: 'signin' })(
  withRouter(connect(mapStateToProps, actions)(Signin))
);

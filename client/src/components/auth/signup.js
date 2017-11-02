import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Signup extends Component {
  static propTypes = {
    errorMessage: React.PropTypes.string,
    handleSubmit: React.PropTypes.func,
    signupUser: React.PropTypes.func
  };

  handleFormSubmit(formProps) {
    // Call action creator to sign up the user!
    this.props.signupUser(formProps);
  }

  renderInput = field => (
    <div>
      <input {...field.input} className='form-control'
        type={field.type} />
      {field.meta.touched &&
        field.meta.error && <span className='error'>{field.meta.error}</span>}
    </div>
  );

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
            name='email'
            component={this.renderInput.bind(this)}
            type='text'
          />
        </fieldset>
        <fieldset className='form-group'>
          <label>Password:</label>
          <Field name='password' component={this.renderInput}
            type='password' />
        </fieldset>
        <fieldset className='form-group'>
          <label>Confirm Password:</label>
          <Field
            name='passwordConfirm'
            component={this.renderInput}
            type='password'
          />
        </fieldset>
        {this.renderAlert()}
        <button action='submit' className='btn btn-primary'>
          Sign up!
        </button>
      </form>
    );
  }
}

function validate(formProps) {
  const errors = {};

  if (!formProps.email) {
    errors.email = 'Please enter an email';
  }

  if (!formProps.password) {
    errors.password = 'Please enter a password';
  }

  if (!formProps.passwordConfirm) {
    errors.passwordConfirm = 'Please enter a password confirmation';
  }

  if (formProps.password !== formProps.passwordConfirm) {
    errors.password = 'Passwords must match';
  }

  return errors;
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}
export default reduxForm({ validate, form: 'signup' })(
  withRouter(connect(mapStateToProps, actions)(Signup))
);

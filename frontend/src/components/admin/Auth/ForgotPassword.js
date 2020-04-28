/*
Component Name: Forgot Password
Description:Forgot password
*/

import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateInputs } from 'lib/validation';
import RoutingConstants from 'lib/RoutingConstants';
import { post } from 'lib/api';
import { Link } from 'react-router-dom';

class ForgotPassword extends Component {
  constructor(props) {
    super(props)
    document.body.className += '';
    this.state = {
      inputs: {},
      errorMessage: {
        email: true
      },
      mailText: 'Send Email',
      disabled: false
    }
  }

  // validate user inputs and register user
  onSubmit() {
    this.setState({ mailText:'Email is Sending....', disabled: true });
    const { errorMessage, inputs } = this.state;
    const { email } = this.state.inputs;
    let { mailText, disabled } = this.state
    if (!validateInputs('email', email)) {
      errorMessage.email = 'Please enter valid email ';
      disabled = false
      mailText = 'Send Email'
    } else {
      errorMessage.email = false;
      disabled = true
      mailText = 'Email is Sending ...'
    } 
    if (!errorMessage.email) {
      const url = RoutingConstants.adminForgot;
      inputs.role = 'admin'
      post(url, inputs).then((response) => {
        if(response.status === 200){
          toast.success("Mail Sent Successfully!", {
            position: toast.POSITION.TOP_RIGHT
          });
          mailText = 'Send Email'
          this.setState({ mailText, disabled: false });
        }else{
          toast.error(response.message, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        }

      }).catch(() => {
        errorMessage.email = "Email doesn't exist, Try again."
        mailText = 'Send Email'
        this.setState({ errorMessage, mailText, disabled: false });
      })
    }
    this.setState({ errorMessage, disabled, mailText });
  }

  // set value in state
  updateValue(event) {
    const { errorMessage, inputs } = this.state;
    errorMessage[event.target.name] = true
    inputs[event.target.name] = event.target.value;
    this.setState({ errorMessage, inputs });
  }

  render() {
    const { errorMessage, mailText, disabled } = this.state;

    return (
      <div className="out-pages">
        <div className="bg-gray-nw" />
        <div className="wrapper">
          <div className="admin-login-logo" >
            <img src="/images/logo.png" alt="" />
          </div> 
          <div className = "login-form" >
            <div className = "main-div" >
              <div className = "panel">
                <h2>Forgot Password </h2>
              </div>
              <form id = "Login" onSubmit={() => this.onSubmit( this ) }>
                <div className = "form-group" >
                  <label>Email</label>
                  <input type = "email"
                    className = "form-control"
                    id = "inputEmail"
                    name= "email"
                    onChange={(event) => this.updateValue(event)}
                    placeholder = "Email Address" 
                  />

                  {errorMessage.email !== false ?
                    <span className="error-msg">
                      {errorMessage.email}
                    </span>
                    :
                    null
                  }
                </div>
                <div className = "forgot" >
                  <Link to = "/admin/login" > Login here </Link>
                </div>
                <button 
                  type="button" 
                  className = "btn btn-primary" 
                  onClick={() => this.onSubmit()}
                  disabled={disabled}
                >
                  {mailText}
                  <i className="fas fa-play" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ForgotPassword;

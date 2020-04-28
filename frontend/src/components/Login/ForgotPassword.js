/*
Component Name: Basic
Description: First step of registeration.
*/

import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateInputs } from 'lib/validation';
import RoutingConstants from 'lib/RoutingConstants';
import { post } from 'lib/api';
import history from 'lib/history';
import { Link } from 'react-router-dom';

class CompanyLogin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputs: {},
      error: false,
      errorMessage: {
        email: true,
        password: true,
      },
      mailText: 'Send Email',
      disabled: false,
      loginType: ''
    }
  }
  

  // validate user inputs and register user
  onSubmit(){
    this.setState({ mailText:'Email is Sending....', disabled: true });
    const {errorMessage, inputs} = this.state;
    let { error, mailText, disabled } = this.state
    const { email } = this.state.inputs;
    if (!validateInputs('email', email)) {
      errorMessage.email = 'Please enter valid email ';
      disabled = false
      mailText = 'Send Email'
    } else {
      errorMessage.email = false;
      disabled = true
      mailText = 'Email is Sending ...'
    }
    if(!errorMessage.email) {
      const url = RoutingConstants.adminForgot;
      inputs.role = 'company user'
      
      post(url, inputs).then(() => {
        toast.success("Mail Sent Successfully!", {
          position: toast.POSITION.TOP_RIGHT
        });
        mailText = 'Send Email'
        this.setState({ mailText, disabled: false });
      }).catch(() => {
        error = true
        errorMessage.err = "Email doesn't exist, Try again.";
        mailText = 'Send Email'
        this.setState({ error, mailText, disabled: false });
      })
    }
    this.setState({ errorMessage, disabled, mailText });
  }

  // set value in state
  updateValue(event) {
    const { errorMessage, inputs } = this.state;
    errorMessage[event.target.name] = true
    inputs[event.target.name] = event.target.value;
    this.setState({ errorMessage, inputs, error: false,});
  }

  render() {
    const { email } = this.state.inputs;
    const { errorMessage, error, mailText, disabled, loginType } = this.state;
    const loginLink = '/login' 
    return ( 
      <div className="out-pages">
        <div className="wrapper">
          <header className="text-left">
            <div className="container">
              <div className="">
			           <div className="row">
                  <div className="col-md-6 logo ">
                    <img src="/images/logo.png" alt="" />
                  </div>
			          </div>
		          </div>
            </div>
          </header>
          <section className="main-form">
            <div className="bg-gray-nw" />
            <div className="container">
		
              <div className="full-width text-center before-login">
                <h1>Forgot Password</h1>
                {error ? <span className="error-msg">{errorMessage.err}</span> : null}
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Email Address"
                    name="email"
                    defaultValue={email}
                    onChange={(event)=>this.updateValue(event)}
                  />
                  {errorMessage.email !== false ?
                    <span className="error-msg">
                      {errorMessage.email}
                    </span>
                    :
                    null
                  }
                </div>
                <p>
                  <Link to = {loginLink} > LogIn Here </Link>
                </p>
                <div className="btn-box">
                  <button 
                    className="btn green-btn"
                    onClick={() => this.onSubmit()}
                    disabled={disabled}
                  >
                    {mailText}
                    <i className="fas fa-play" />
                  </button>
                </div>
              </div>
		
              {loginType !== 'team' && 
                <div className="form-othr-info">
                  <p> Don&apos;t have an account? </p>
                  <div className="btn-box text-center">
                    <button 
                      className="btn green-btn signin-btn" 
                      onClick={ () => history.push('/')}
                    >
                      Sign Up <i className="fas fa-play" />
                    </button>
                  </div>
                </div>
              }
            </div>
          </section>
	  
        </div>
      </div>
    );
  }
}
export default CompanyLogin;
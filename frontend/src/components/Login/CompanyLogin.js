/*
Component Name: Basic
Description: First step of registeration.
*/

import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateInputs } from 'lib/validation';
import RoutingConstants from 'lib/RoutingConstants';
import { Link } from 'react-router-dom';
import { post } from 'lib/api';
import history from 'lib/history';

class CompanyLogin extends Component {
  constructor(props) {
    super(props)
    document.body.classNameName += '';
    this.state = {
      inputs: {},
      error: false,
      errorMessage: {
        email: true,
        password: true,
      },
      loader: false
    }
  }

  componentDidMount() {
    if(localStorage.getItem('token') && (localStorage.getItem('role') === 'company user' || localStorage.getItem('role') === 'member' )) {
      history.push('/company/invoices');
    } else {
      localStorage.removeItem('token')
    }  
  }


  // validate user inputs and register user
  onSubmit(){
    const {errorMessage, inputs} = this.state;
    let { error } = this.state
    const {email, password} = this.state.inputs;
    this.setState({ loader: true})
    if (!validateInputs('email', email)) {
      errorMessage.email = 'Please enter valid email ';
    } else {
      errorMessage.email = false;
    }
    if (!password) {
      errorMessage.password = 'Password must be required';
    } else {
      errorMessage.password = false;
    }
    if(!errorMessage.email && !errorMessage.password) {
      const url = RoutingConstants.companyLogin;
      inputs.email = inputs.email.toLowerCase();
      post(url, inputs).then((response) => {
        localStorage.setItem('token',response.token);
        localStorage.setItem('role',response.data.role);
        history.push('/company/invoices')
        toast.success("Login successfully!", {
          position: toast.POSITION.TOP_RIGHT
        });
      }).catch((err) => {
        error = true
        errorMessage.err = 'Sorry! incorrect email or password, Try again.';
        if(err.message === "Email doesn't not exist!") {
          errorMessage.err = 'Your Account is blocked.';
        }
        this.setState({ error, loader: false });
      })
    } else {
      this.setState({ errorMessage, loader: false });
    }
  }

  keyEvent(event) {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }

  // set value in state
  updateValue(event) {
    const { errorMessage, inputs } = this.state;
    errorMessage[event.target.name] = true
    inputs[event.target.name] = event.target.value;
    this.setState({ errorMessage, inputs, error: false });
  }

  render() {
    // const { email, password } = this.state.inputs;
    const { errorMessage, error, loginType, loader } = this.state;
    const forgotLink = '/forgotpassword'
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
              {loader &&
                <div>
                  <div className='loader'/>
                  <div className="modal-backdrop fade in loading" />
                </div>
              }
              <div className="full-width text-center before-login">
                <h1>Log In</h1>
                {error ? <span className="error-msg">{errorMessage.err}</span> : null}
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Email Address"
                    name="email"
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
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onKeyDown={event => this.keyEvent(event)}
                    onChange={(event)=>this.updateValue(event)}
                  />
                  {errorMessage.password !== false ?
                    <span className="error-msg">
                      {errorMessage.password}
                    </span>
                    :
                    null
                  }
                </div>
                <p>
                  <Link to = {forgotLink} > Forgot your password ? </Link>
                </p>
                <div className="btn-box">
                  <button className="btn green-btn" onClick={() => this.onSubmit()}>
                    Sign In
                    <i className="fas fa-play" />
                  </button>
                </div>
              </div>
		
              {loginType !== 'team' && 
                <div className="form-othr-info">
                  <p> Don&apos;t have an account? </p>
                  <div className="btn-box text-center">
                    <button className="btn green-btn signin-btn" onClick={ () => history.push('/')}>
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
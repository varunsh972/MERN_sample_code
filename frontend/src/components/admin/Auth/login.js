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
import { Link } from 'react-router-dom';

class login extends Component {
  constructor(props) {
    super(props)
    document.body.className += '';
    this.state = {
      inputs: {},
      errorMessage: {
        email: true,
        password: true
      },
    }
  }

  // validate user inputs and register user
  onSubmit(e) {
    e.preventDefault();
    const { errorMessage } = this.state;
    const { email, password } = this.state.inputs;
    if (!validateInputs('email', email)) {
      errorMessage.email = 'Please enter valid email ';
    } else {
      errorMessage.email = false;
    }
    if (!validateInputs('password', password)) {
      errorMessage.password = 'It must contain 8+ characters with 1 number or special character.';

    } else {
      errorMessage.password = false;
    }


    if (!errorMessage.email && !errorMessage.password) {
      this.login();
    }
    this.setState({ errorMessage });
  }

  // set value in state
  updateValue(event) {
    const { errorMessage, inputs } = this.state;
    errorMessage[event.target.name] = true
    inputs[event.target.name] = event.target.value;
    this.setState({ errorMessage, inputs });
  }

  login(){
    const { inputs, errorMessage } = this.state
    let { error } = this.state
    const url = RoutingConstants.adminlogin;
    post(url, inputs).then((response) => {
      localStorage.setItem('role',response.data.role);
      localStorage.setItem('token',response.token)
      this.props.history.push("/admin/categories");
      toast.success("Successfull Login!", {
        position: toast.POSITION.TOP_RIGHT
      });

    }).catch(() => {
      error = true
      errorMessage.err = 'Sorry! incorrect email or password, Try again.';
      this.setState({ error });
    })
  }

  render() {
    const { errorMessage, error } = this.state;

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
                <h2> Admin Login </h2>
              </div>
              <form id = "Login" onSubmit={() => this.onSubmit( this ) }>
                {error ? <span className="error-msg">{errorMessage.err}</span> : null}
                <div className = "form-group" >
                  <label>Email</label>
                  <input type = "email"
                    className = "form-control"
                    id = "inputEmail"
                    name= "email"
                    onChange={(event) => this.updateValue(event)}
                    placeholder = "Email Address" />

                  {errorMessage.email !== false ?
                    <span className="error-msg">
                      {errorMessage.email}
                    </span>
                    :
                    null
                  }
                </div>
                <div className = "form-group">
                  <label>Password</label>
                  <input type = "password"
                    className = "form-control"
                    id = "inputPassword"
                    name="password"
                    onChange={(event) => this.updateValue(event)}
                    placeholder = "Password" />
                  {errorMessage.password !== false ?
                    <span className="error-msg">
                      {errorMessage.password}
                    </span>
                    :
                    null
                  }
                </div>

                <div className = "forgot" >
                  <Link to = "/admin/forgot" > Forgot password ? </Link>
                </div>
                <button 
                  type="submit"
                  className = "btn btn-primary "
                  onClick={(e) => this.onSubmit(e)}
                > 
              Login
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
export default login;

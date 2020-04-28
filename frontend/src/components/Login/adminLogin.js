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

class adminLogin extends Component {
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
  onSubmit() {
    const { errorMessage, inputs } = this.state;
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
      const url = RoutingConstants.adminlogin;
      post(url, inputs).then((response) => {
        if(response.status === 200){
          localStorage.setItem('id',response.data.id);
          localStorage.setItem('token',response.token)
          localStorage.setItem('email',email);
          this.props.history.push("/dashboard");
          toast.success("Successfull Login!", {
            position: toast.POSITION.TOP_RIGHT
          });
        }else{
          if(response.status === 404){
            toast.error(response.message, {
              position: toast.POSITION.BOTTOM_RIGHT
            });
          }

          if(response.status === 204){
            toast.error(response.message, {
              position: toast.POSITION.BOTTOM_RIGHT
            });
          }
    
          if(response.status === 400){
            errorMessage.password = response.message;
            this.setState({ errorMessage });
          }

          if(response.status === 500){
            toast.error(response.message, {
              position: toast.POSITION.BOTTOM_RIGHT
            });
          }
        }
       
      }).catch((err) => {
        toast.error(err, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      })
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

  render() {
    const { errorMessage } = this.state;
    return ( 
      
      <div className = "login-form" >
        <div className="bg-gray-nw" />
        <div className = "main-div" >
          <div className = "panel">
            <h2> Admi Login </h2> 
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
            <div className = "form-group">
              <label>Password</label>
              <input type = "password"
                className = "form-control"
                id = "inputPassword"
                name="password"
                onChange={(event) => this.updateValue(event)}
                placeholder = "Password" / >
              {errorMessage.password !== false ?
                <span className="error-msg">
                  {errorMessage.password}
                </span>
                :
                null
              }
            </div>
            <div className = "forgot" >
              {/* <a href = "reset.html" > Forgot password ? </a>  */}
            </div> 
            <button type="button" className = "btn btn-primary" onClick={() => this.onSubmit()}> Login </button> 
          </form> 
        </div>
      </div>
       

    );
  }
}
export default adminLogin;
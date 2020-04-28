/*
Component Name: ResetPassword
Description: Password Reset.
*/

import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateInputs } from 'lib/validation';
import RoutingConstants from 'lib/RoutingConstants';
import { post, get } from 'lib/api';

class ResetPassword extends Component {
  constructor(props) {
    super(props)
    document.body.className += '';
    this.state = {
      inputs: {
        password: '',
        confirmPassword: ''
      },
      errorMessage: {
        password: null,
        confirmPassword: null,
        isLoaded: false
      },
    }
  }

  componentDidMount(){
    const {match} = this.props;
    const resetPasswordToken = match.params.token;
    const url = RoutingConstants.verifyToken;
    get(`${url}/${resetPasswordToken}`).then((response) => {
      if(response.status === 200){
        toast.success(response.message, {
          position: toast.POSITION.TOP_RIGHT
        });
        this.setState({isLoaded: true})
      }else{
        toast.error(response.message, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      }

    }).catch((err) => {
      toast.error(err.description, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    })
  }

  // validate user inputs and register user
  onSubmit() {
    const {match} = this.props;
    const resetPasswordToken = match.params.token;
    const { errorMessage } = this.state;
    const { password, confirmPassword } = this.state.inputs;
    if (!validateInputs('password', password)) {
      errorMessage.password = 'Please enter a valid password ';
    } else if (password !== confirmPassword) {
      errorMessage.password = 'Password and confirm password have not match.';
    }else {
      errorMessage.password  = false;
    }
    if (!errorMessage || !errorMessage.password) {
      let url = RoutingConstants.resetPassword;
      if(this.props.match.path === '/team/resetpassword/:token') {
        url = RoutingConstants.memberReset;
      }
      post(url, {resetPasswordToken, password}).then((response) => {
        if(response.status === 200){
          if(response.role === 'admin'){
            this.props.history.push("/admin");
          } else {
            this.props.history.push("/login");
          }
          toast.success(response.message, {
            position: toast.POSITION.TOP_RIGHT
          });
        }else{
          toast.error(response.message, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        }

      }).catch((err) => {
        toast.error(err.description, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      })
    }



    this.setState({ errorMessage });
  }

  // set value in state
  updateValue(event) {
    const { errorMessage, inputs } = this.state;
    errorMessage.password = false
    inputs[event.target.name] = event.target.value;
    this.setState({ errorMessage, inputs });
  }

  render() {
    const { errorMessage, isLoaded } = this.state;
    if (!isLoaded) {
      return(
        <div>Loading...</div>
      );
    }
    return (
      <div>
        <div className="bg-gray-nw" />
        <div className="admin-login-logo" >
          <img src="/images/logo.png" alt="" />
        </div> 
        <div className = "login-form" >
          <div className = "main-div" >
            <div className = "panel">
              <h2>Reset Password </h2>
            </div>
            <form id = "Login" onSubmit={() => this.onSubmit( this ) }>
              <div className = "form-group" >
                <label>New Password</label>
                <input
                  type = "password"
                  className = "form-control"
                  name= "password"
                  onChange={(event) => this.updateValue(event)}
                  placeholder = "Enter new password"
                />
                {(errorMessage && errorMessage.password)?
                  <span className="error-msg">
                    {errorMessage.password}
                  </span>
                  :
                  null
                }
              </div>
              <div className = "form-group" >
                <label>Confirm Password</label>
                <input
                  type = "password"
                  className = "form-control"
                  name= "confirmPassword"
                  onChange={(event) => this.updateValue(event)}
                  placeholder = "Enter confirm password"
                />
              </div>

              <button type="button" className = "btn btn-primary" onClick={() => this.onSubmit()}>Reset Password.</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default ResetPassword;

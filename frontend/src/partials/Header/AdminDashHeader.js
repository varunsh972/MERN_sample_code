// Header.js
import React, {Component} from 'react';
import history from 'lib/history';
import { Glyphicon } from 'react-bootstrap';
import { toast } from 'react-toastify';

class AdminDashHeader extends Component {
  constructor(){
    super()
    // body.classNameName.add("hold-transition skin-blue sidebar-mini");
    this.state = {
    }
  }

  // eslint-disable-next-line
  logOut() {
    localStorage.removeItem('token');
    toast.success("Successfull Logout!", {
      position: toast.POSITION.TOP_RIGHT
    });
    history.push('/admin/login');
  }
  render(){
    return (
      <header>
        <div className="container">
          <div className="top-header">
            <div className="row">
              <div className="col-md-6 admin-logo ">
                <img src="/images/logo-1.png" alt="" />
              </div>
              <div className="col-md-6">
                <ul className="nav nav-tabs pull-right">  
                  <li className="logout" onClick={()=>this.logOut()}>
                    <Glyphicon
                      glyph="log-out"
                      title="logout"
                      className="logout-icon"
                      onClick={()=>this.logOut()}
                    />
                    <span>Logout</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }
}

export default AdminDashHeader;

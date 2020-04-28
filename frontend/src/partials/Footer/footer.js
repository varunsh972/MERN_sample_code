/*
Component Name: Dashboard
Description: admin dashboard.
*/

import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { withRouter } from 'react-router'


class Footer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  logout(){
    localStorage.clear();
    if(localStorage.getItem('token') === null){
      this.props.history.push('/admin/login');
    }

  }

  render() {
    return(
      <div>
        <footer className="main-footer">
          <div className="pull-right hidden-xs">
            <b>Version</b> 2.4.0
          </div>
        </footer>
        <aside className="control-sidebar control-sidebar-dark">
          <ul className="nav nav-tabs nav-justified control-sidebar-tabs">
            <li><button type="buttton" className="logoutBtn" onClick={() => this.logout()}>Logout</button> </li>
          </ul>
        </aside>
      </div>

    )

  }

}

export default withRouter(Footer);

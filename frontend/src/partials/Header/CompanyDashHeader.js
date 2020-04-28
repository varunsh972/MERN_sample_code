// Header.js
import React, {Component} from 'react';
import history from 'lib/history';
import { toast } from 'react-toastify';

class CompanyDashHeader extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: null
    }
  }

  componentDidMount() {
    this.setLogin();
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(props) {
    if(props.companyDetail) {
      this.setState({
        name: props.companyDetail.name,
      })
    }
  }

  setLogin(){
    let loginType;
    if(localStorage.getItem('role') === 'member') {
      loginType = 'team'
    } else if(localStorage.getItem('role') === 'company user') {
      loginType = 'company'
    }
    this.setState({ loginType })
  }

  // eslint-disable-next-line
  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    toast.success("Logout successfully!", {
      position: toast.POSITION.TOP_RIGHT
    });
    localStorage.removeItem('connect')
    history.push('/login');
  }

  render(){
    const { name, loginType } = this.state
    const companyName = name !== null ? name : 'Company Name'
    return (
      <header>
        <div className="container">
          <div className="top-header">
            <div className="row">
              <div className="col-md-6 company-logo ">
                <img src="/images/logo-1.png" alt="" />
              </div>
              <div className="col-md-6">
                <ul className="nav nav-tabs pull-right">
                  <li className="dropdown">
                    <a className="dropdown-toggle" data-toggle="dropdown" title="Settings">
                      <img className="blue-unactive" src="/images/setting.png" alt="" />
                      <img className="blue-active" src="/images/setting-blue.png" alt="" />
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <h5>{companyName}</h5>
                        <ul className="bordr-rght">
                          <li><b>Invoice Settings</b></li>
                          <li>Template Settings</li>
                          <li>Invoice Fields</li>
                          <li>Presets</li>
                        </ul>
                        <ul>
                          <li><b>Your Company</b></li>
                          <li>Your Account</li>
                          {loginType !== 'team' &&
                            <li>
                              <a href='/company/teamMember'>
                                Your Team
                              </a>
                            </li>
                          }
                          <li>Refer a friend</li>
                          <li onClick={()=> this.logOut()} style={{cursor: 'pointer'}}>
                            Logout
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href='/company/profile' title="Profile">
                      <img src="/images/user.png" alt=""/>
                    </a>
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

export default CompanyDashHeader;

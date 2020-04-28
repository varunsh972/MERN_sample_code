// Header.js
import React, {Component} from 'react';

class AdminDashSidebar extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }
  render(){
    const activeurl = this.props.url;
    let { category, userlist } = this.state
    if (activeurl === '/admin/users') {
      userlist = 'sideactive'
      category = ''
    } else if( activeurl === '/company/teamMember' || activeurl === '/company/profile') {
      category = ''
      userlist = ''
    } else {
      category = 'sideactive'
    }
    return (
      <div className="side-bar admin-panel">
        <div className="navigation">
          <ul>
            <li>
              <a href="/admin/categories" className={`admin-side-links ${category}`}>
                <span><img src="/images/manage-category.png" alt=""/> </span>Manage Categories
              </a>
            </li>
            <li>
              <a href='/admin/users' className={`admin-side-links ${userlist}`}>
                <span><img src="/images/customers.png" alt="" /></span>
                Manage Users
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default AdminDashSidebar;

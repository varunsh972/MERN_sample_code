// Header.js
import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class Sidebar extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }
  render(){
    const activeurl = this.props.url;
    return (
      <aside className="main-sidebar">
        <section className="sidebar">
          <ul className="sidebar-menu" data-widget="tree">
            <li className={activeurl === '/admin' ? 'active' : null} >
              <Link to="/admin">
                <i className="fa fa-dashboard" /> <span>Dashboard</span>
              </Link>
            </li>
            <li className={activeurl === '/admin/categories' ? 'active' : null}>
              <Link to="/admin/categories">
                <i className="fa fa-category" /> <span>Manage Categories</span>
              </Link>
            </li>
          </ul>
        </section>
      </aside>
    )
  }
}

export default Sidebar;

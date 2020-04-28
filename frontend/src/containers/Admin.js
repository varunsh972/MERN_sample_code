import React, {Component} from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { Switch} from 'react-router-dom';
import history from 'lib/history';
import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';
import login from '../components/admin/Auth/login';
import Dashboard from '../components/admin/Dashboard/dashboard';
import ForgotPassword from '../components/admin/Auth/ForgotPassword';
import Category from './Category';
import Users from './Users';

class Admin extends Component {

  componentDidMount() { 
    if(localStorage.getItem('role') === 'company user' || localStorage.getItem('role') === 'member'){
      localStorage.removeItem('token')
      history.push('/admin/login');
    }
  }
  
  render(){
    const {match} = this.props;
    return(
      <div>
        <Switch>
          <PrivateRoute exact path={`${match.url}`} component={Dashboard}/>
          <PublicRoute exact path={`${match.url}/login`} component={login}/>
          <PrivateRoute exact path={`${match.url}/dashboard`} component={Dashboard}/>
          <PrivateRoute exact path={`${match.url}/categories`} component={Category}/>
          <PublicRoute exact path={`${match.url}/forgot`} component={ForgotPassword}/>
          <PrivateRoute exact path={`${match.url}/users`} component={Users}/>
          <PublicRoute component={login}/>
        </Switch>
      </div>
    )
  }
}

export default Admin;

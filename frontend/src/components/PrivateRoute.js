import React from 'react';
import { Route , Redirect} from 'react-router-dom';
import Header from '../partials/Header/AdminDashHeader';
import Sidebar from '../partials/Sidebar/AdminDashSidebar';

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={props => (
    localStorage.getItem('token') ? (
      <div className="wrapper">
        <div className="full-width">
          <Header/>
          <section className="main-form">
            <div className="container" style={{width:'1260px'}}>
              <div className="cntnt-box">    
                <Sidebar {...props.match}/>
                <Component {...props} />
              </div>
            </div>
          </section>
        </div>
      </div>
    ) : (
      <Redirect to={{
        pathname: '/admin/login',
        state: {from: props.location}
      }}/>
    )
  )}
  />
);
export default PrivateRoute;

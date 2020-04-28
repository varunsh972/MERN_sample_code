/*
Component Name: Public routes for dashboard
Description: Login page
*/
import React from 'react';
import { Route , Redirect} from 'react-router-dom';


const PublicRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={props => (
    localStorage.getItem('token') ? (
      <Redirect to={{
        pathname: '/admin/categories',
        state: {from: props.location}
      }}/>
    ) : (
      <Component {...props}/>
    )
  )}
  />
);
export default PublicRoute;

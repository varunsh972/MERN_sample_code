import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { Router, Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import history from 'lib/history';
import 'react-toastify/dist/ReactToastify.css';
import './assets/css/bootstrap.min.css';
import './assets/css/style.css';
import './assets/css/AdminLTE.min.css';
import './assets/css/_all-skins.min.css';
// import Register from './components/Register/Register';
// import Login from './components/Login/CompanyLogin';
import Admin from './containers/Admin';
// import CompanyAdmin from './containers/CompanyAdmin';
// import ResetPassword from './components/Login/ResetPassword';
// import ForgotPassword from './components/Login/ForgotPassword';
// import PayInvoice from './components/Company/Invoice/PayInvoice';

const App = () => (
  <Router history={history}>
    <Route
      render={() =>(
        <div className="wrapper">
          <ToastContainer autoClose={1500} pauseOnFocusLoss={false} />
          <Route path="/admin" component={Admin} />
          {/* <Route path="/company" component={CompanyAdmin} /> */}
          {/* <Route path="/login" component={Login} /> */}
          <Route exact path="/" render={() => (
            <Redirect to="/admin"/>
          )}/>
          {/* <Route exact path="/signup" component={Register} />
          <Route exact path="/forgotpassword" component={ForgotPassword} />
          <Route exact path="/resetpassword/:token" component={ResetPassword} /> */}
         
         
        </div>
      )
      }
    />
  </Router>
);


export default App;

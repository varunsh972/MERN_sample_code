import React, {Component} from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { Switch} from 'react-router-dom';
import Dashboard from 'components/Company/Dashboard'
import Profile from 'components/Company/Profile'
import Invoice from 'components/Company/Invoice/Invoice'
import Estimates from 'components/Company/Estimates/Estimates'
import InvoiceList from 'components/Company/Invoice/InvoiceList'
import Product from 'components/Company/Product/Product'
import Customer from 'components/Company/Customer/Customer'
import Login from 'components/Login/CompanyLogin'
import CustomerInfo from 'components/Company/Customer/CustomerInfo'
import TeamMember from 'components/Company/TeamMember/TeamMember'
import CompanyRoute from 'components/CompanyRoute'
import history from 'lib/history';
import RoutingConstant from 'lib/RoutingConstants';
import { get } from 'lib/api';
import PreviewInvoice from 'components/Company/Invoice/PreviewInvoice';

class CompanyAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: [],
      companyDetail: []
    }
  }

  componentDidMount() { 
    if(!localStorage.getItem('token') ||( localStorage.getItem('role') !== 'company user' && localStorage.getItem('role')!== 'member')){
      localStorage.removeItem('token')
      history.push('/login');
    }
    else if(localStorage.getItem('role') === 'company user') {
      this.getProfile()
    } else if(localStorage.getItem('role') === 'member') {
      this.getMemberProfile()
    }
  }

  getProfile() {
    if(localStorage.getItem('role') === 'company user'){
      const url = RoutingConstant.companyProfile
      get(url).then((response) => {
        if(response.record.company_detail === null && response.record.user_detail !== null) {
          localStorage.setItem('email',response.record.user_detail.email);
          history.push('/',{step:'companyRegister'})
        }else if(response.record.user_detail !== null){
          localStorage.setItem('email',response.record.user_detail.email);
          if(response.record.company_detail.company_logo)
            localStorage.setItem('logo',RoutingConstant.imageUrl+response.record.company_detail.company_logo);
        }
        this.setState({
          userDetail: response.record.user_detail,
          companyDetail: response.record.company_detail,
          getInvoiceCount: response.record.getInvoiceCount
        })
        if(response.record.user_detail === null) {
          localStorage.removeItem('token');
          history.push('/login');
        }
      }).catch((err)=>{
        if(err.message === 'Failed to authenticate token.') {
          localStorage.removeItem('token');
          localStorage.removeItem('logo');
          history.push('/login');
        }
      })
    }
  }

  

  getMemberProfile() {
    const url = RoutingConstant.memberProfile
    get(url).then((response) => {
      this.setState({
        userDetail: response.data.company.user,
        companyDetail: response.data.company,
        getInvoiceCount: response.data.getInvoiceCount
      })
    }).catch((err)=>{
      if(err.message === 'Failed to authenticate token.') {
        localStorage.removeItem('token');
        history.push('/login');
      }
    })
  }

  profile() {
    if(localStorage.getItem('role') === 'company user') {
      this.getProfile()
    } else if(localStorage.getItem('role') === 'member') {
      this.getMemberProfile()
    }
  }
  
  render(){
    const {match} = this.props;
    const {userDetail, companyDetail, getInvoiceCount} = this.state;
    userDetail.getInvoiceCount = getInvoiceCount
    return(
      <div>
        <Switch>
          <CompanyRoute 
            exact
            path={`${match.url}`}
            component={Dashboard}
            userDetail={userDetail}
            companyDetail={companyDetail}
          />
          <CompanyRoute 
            exact
            path={`${match.url}/dashboard`} 
            component={Dashboard} 
            userDetail={userDetail} 
            companyDetail={companyDetail}
          />
          <CompanyRoute 
            path={`${match.url}/profile`} 
            component={Profile} 
            userDetail={userDetail} 
            getProfile={()=>this.profile()}
            companyDetail={companyDetail}
          />
          <CompanyRoute 
            exact
            path={`${match.url}/invoices`} 
            component={Invoice} 
            userDetail={userDetail} 
            companyDetail={companyDetail}
          />
          <CompanyRoute 
            exact
            path={`${match.url}/customers`} 
            component={Customer} 
            userDetail={userDetail} 
            companyDetail={companyDetail}
          />
          <CompanyRoute 
            exact
            path={`${match.url}/teamMember`} 
            component={TeamMember} 
            userDetail={userDetail} 
            companyDetail={companyDetail}
          />
          <CompanyRoute 
            exact
            path={`${match.url}/selectCustomer`} 
            component={CustomerInfo} 
            userDetail={userDetail} 
            companyDetail={companyDetail}
          />
          <CompanyRoute 
            exact
            path={`${match.url}/addProduct`} 
            component={Product} 
            userDetail={userDetail} 
            companyDetail={companyDetail}
          />
          <CompanyRoute 
            exact
            path={`${match.url}/viewInvoice`} 
            component={PreviewInvoice} 
            userDetail={userDetail} 
            companyDetail={companyDetail}
          />
          <CompanyRoute 
            exact
            path={`${match.url}/viewEstimates`} 
            component={PreviewInvoice} 
            userDetail={userDetail} 
            companyDetail={companyDetail}
          />
          <CompanyRoute 
            exact
            path={`${match.url}/invoiceList`} 
            component={InvoiceList} 
            userDetail={userDetail} 
            companyDetail={companyDetail}
          />
          <CompanyRoute 
            exact
            path={`${match.url}/estimates`} 
            component={Estimates} 
            userDetail={userDetail} 
            companyDetail={companyDetail}
          />
          <CompanyRoute 
            exact 
            component={Login}
          />
        </Switch>
      </div>
    )
  }
}

export default CompanyAdmin;

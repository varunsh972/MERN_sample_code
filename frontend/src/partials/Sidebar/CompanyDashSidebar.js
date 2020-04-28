// Header.js
import React, {Component} from 'react';

class CompanyDashSidebar extends Component {
  constructor(props){
    super(props);
    this.state = {
      name:'Business Name',
      image: '/images/home-ico.png'
    }
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(props) {
    if(props.companyDetail) {
      this.setState({
        name: props.companyDetail.name,
        image: localStorage.getItem('logo')
      })
    }
  }
  
  render(){
    const activeurl = this.props.url;
    console.log(this.props,'sideprops')
    const content = this.props.location.state && this.props.location.state.content
    let { customers, invoices, home, estimates } = this.state
    if (activeurl === '/company/customers') {
      customers = 'sideactive'
      invoices = ''
    } else if( activeurl === '/company/teamMember' || activeurl === '/company/profile') {
      customers = ''
      invoices = ''
    } else if (activeurl === '/company/invoiceList' || content === 'invoice') {
      invoices = 'sideactive'
    } else if (activeurl === '/company/estimates' || content === 'estimates') {
      estimates = 'sideactive'
    } 
    else {
      home = 'sideactive'
    }
    const { name, image } = this.state;
    const logo = image !== 'undefined' && image !== null ? image : '/images/home-ico.png';
    return (
      <div className="side-bar">
        <div className="image-section">
          <img src={logo} alt="" />
          <div className="heading">
            <h3>{name}</h3>
          </div>
        </div>
        <div className="navigation">
          <ul>
            <li>
              <a href='/company/invoices' className={`company-links ${home}`}>
                <span><img src="/images/dashboard.png" alt="" /></span> 
                Home
              </a>
            </li>
            <li>
              <a href='/company/invoiceList' className={`company-links ${invoices}`}>
                <span><img src="/images/invoice.png" alt="" /></span>
                Invoices
              </a>
            </li>
            <li>
              <a href='/company/estimates' className={`company-links ${estimates}`}>
                <span><img src="/images/estimates.png" alt="" /></span>
                Estimates
              </a>
            </li>
            <li>
              <a href='/company/customers' className={`company-links ${customers}`}>
                <span><img src="/images/customers.png" alt="" /></span>
                Customers
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default CompanyDashSidebar;

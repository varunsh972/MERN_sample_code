/*
Component Name : UserDetail
Description : Show User Detail list
*/

import React, { Component } from 'react';
import RoutingConstants from 'lib/RoutingConstants';
import { get } from 'lib/api';

class ViewUserDetail extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      loader: true,
      userId: props.userId,
      companyDetail: {},
      userDetail: {}
    }
  }

  componentDidMount() {
    this.getUser()
  }

  // get product list 
  getUser() {
    const { userId } = this.state
    const url = `${RoutingConstants.viewUserProfile}/${userId}`
    get(url).then(response => {
      this.setState({
        loader: false, 
        userDetail: response.record, 
        companyDetail: response.record
      })
    }).catch((err)=> {
      // eslint-disable-next-line
      console.log(err)
    })
  }

  // get user data
  userData() {
    const { userDetail, companyDetail } = this.state
    const name = userDetail.first_name ? `${userDetail.first_name} ${userDetail.last_name}`: ''
    const city = userDetail.city ? `,${userDetail.city}`: ''
    const state = userDetail.state ? `,${userDetail.state}`: ''
    const address = userDetail.business_address ? `${userDetail.business_address} ${city} ${state}`: ''
    return (
      <div className="row edit-prfile-row">  
        <div className="upload-icn-box view-usr">
          <img src={companyDetail.company_logo} alt="" />
        </div>

        <div className="col-md-12 col-sm-12">
          <div className="edit-profile view-usr">
            <label>Name: &nbsp;</label>
            <input 
              type="text"
              className='editabletrue'
              name='name'
              readOnly
              value={name} 
            />
          </div>
        </div>
       
        <div className="col-md-12 col-sm-12">
          <div className="edit-profile view-usr">
            <label>Company Address: &nbsp;</label>
            <textarea 
              className='editabletrue' 
              name='business_address'
              value={address}
              readOnly
            />
          </div>
        </div>
        <div className="col-md-12 col-sm-12">
          <div className="edit-profile view-usr">
            <label>Zip: &nbsp;</label>
            <input 
              type="text"
              className='editabletrue'
              name='name'
              readOnly
              defaultValue={userDetail && userDetail.zip_code}
            />
          </div>
        </div>
        <div className="col-md-12 col-sm-12">
          <div className="edit-profile view-usr">
            <label>Company Email: &nbsp;</label>
            <input 
              type="text"
              className='editabletrue'
              name='name'
              readOnly
              value={userDetail.email}
            />
          </div>
        </div>
        <div className="col-md-12 col-sm-12">
          <div className="edit-profile view-usr">
            <label>Company Phone: &nbsp;</label>
            <input 
              type="text"
              className='editabletrue'
              name='name'
              readOnly
              value={userDetail.phone}
            />
          </div>
        </div>
        <div className="col-md-12 col-sm-12">
          <div className="edit-profile view-usr">
            <label># of Employees:   &nbsp;</label>
            <input 
              type="text"
              className='editabletrue'
              name='name'
              readOnly
              value={companyDetail && companyDetail.no_of_employees} 
            />
          </div>
        </div>
        <div className="col-md-12 col-sm-12">
          <div className="edit-profile view-usr">
            <label>Business Type:   &nbsp;</label>
            <input 
              type="text"
              className='editabletrue'
              name='name'
              readOnly
              value={companyDetail && companyDetail.company_type} 
            />
          </div>
        </div>
      </div>
    )
  }


  render() {
    const { loader, userDetail, companyDetail } = this.state;
    return(
      <div className="modal fade select-customer-popup common-popup select-product-popup in" id="select-product-popup" role="dialog" style={{display: 'block', margin:'2px 0 0 10px'}}>
        <div className="modal-dialog">
          <div className="modal-content" style={{background:'transparent'}}>
            <div className="modal-body">
              <button type="button" className="close" data-dismiss="modal" onClick={()=>this.props.viewUser()}>x</button>
              {loader &&
                <div>
                  <div className='loader'/>
                  <div className="modal-backdrop fade in loading" />
                </div>
              }  
              <div className="create-invoice text-center view-usr">
                <h2 className="invoice-tmplate"> User Profile </h2>
                <div className="profile-cntnt company-profile">
                  {
                    userDetail && companyDetail &&
                this.userData()
                  }  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewUserDetail;

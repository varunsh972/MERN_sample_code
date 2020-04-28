/*
Component Name: User Page 
Description: Show User listing page
*/
import React, {Component} from 'react';
import { toast } from 'react-toastify';
import SweetAlert from 'react-bootstrap-sweetalert';
import {Table, Glyphicon} from 'react-bootstrap';
import RoutingConstants from 'lib/RoutingConstants';
import { get , remove, put, post } from 'lib/api';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import history from 'lib/history'
import { sortByKey } from 'lib/validation'
import ViewUserDetail from '../components/admin/ViewUserDetail';

class Users extends Component{
  constructor(props){
    super(props);
    this.state={
      data: [],
      hasMore: true,
      sweetalert:false,
      loader: true,
      userData: [],
      inputs: {},
      viewDetail: false,
      params: {
        name:"",
        email:""
      },
      sort:{
        name: false,
        email: false,
        status: false,
        sortdate: false
      }
    }
  }

  componentDidMount(){
    const url = RoutingConstants.viewUsers;
    const userData = []
    get(url).then((response) => {
      response.data.map((items, index)=>{
        if (index < 10) {
          userData.push(items)
        }
        return userData
      })
      this.setState({data: response.data, loader: false, userData});
    }).catch(err=>{
      toast.error(err.description, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      if(err.message === 'Failed to authenticate token.') {
        localStorage.removeItem('token')
        history.push('/admin')
      }
    })
    document.getElementById('filterDate').placeholder = ''
  }

  // action on cancel delete
  onCancelDelete(){
    this.setState({sweetalert:null})
  }
  

  // delete user
  deleteUser(id){
    const url = `${RoutingConstants.removeUser}/${id}`;
    remove(url).then(()=>{
      const { data, userData } = this.state
      const index = data.findIndex(x=> x._id === id)
      if(index > -1) {
        data.splice(index, 1);
        userData.splice(index, 1);
      }
      this.setState({data, sweetalert:null});
      toast.success('Category deleted successfully!', {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }).catch((err)=>{
      toast.error(err.description, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    })
  }

 

  handleDelete(id){
    this.setState({ sweetalert:true, id })
  }



  viewDetail(userId) {
    const { viewDetail } = this.state
    this.setState({viewDetail: !viewDetail, userId})
  }

  updateValue(event,userId, index) {
    const { inputs, userData } = this.state;
    const url = `${RoutingConstants.updateStatus}/${userId}`
    if (event.target.checked) {
      inputs.status = '1'
    } else {
      inputs.status = '0'
    }
    put(url, inputs).then(()=>{
      userData[index].status = inputs.status
      this.setState({ userData })
    }).catch((err)=>{
      if(err.message === 'Failed to authenticate token.') {
        localStorage.removeItem('token')
        history.push('/admin')
      }
    })
  }

  filterData(event, name) {
    const params  = {}
    const userData = []
    const filterDate = event
    this.setState({ filterDate, loader: true })
    params[name] = event
    const url = RoutingConstants.filterUser
    post(url, params).then((response)=>{
      response.data.map((items, index)=>{
        if (index < 10) {
          userData.push(items)
        }
        return userData
      })
      this.setState({data: response.data, loader: false, userData});
    })
  }
  
  // fetch user data
  userData() {
    const { userData } = this.state;
    return(
      <tbody>
        {
          userData.map((item,i) => {
            let status = 'inactive'
            if(item.status === '1') {
              status = 'active'
            } 
            return(
              <tr key={item._id}>
                <td>{i+1}</td>
                <td>{item.first_name || item.last_name ? `${item.first_name} ${item.last_name}` : '-'}</td>
                <td>{item.email}</td>
                <td>{moment(item.createdAt).format('MM/DD/YYYY')}</td>
                <td>
                  <label className="switch" title={status}>
                    <input 
                      type="checkbox" 
                      defaultChecked={item.status === '1'} 
                      onChange={(event)=>this.updateValue(event,item._id, i)}
                      title={status}
                    />
                    <span className="slider round" />
                  </label>
                </td>
                <td>
                  <Glyphicon
                    glyph="trash"
                    title="Delete"
                    onClick={()=>this.handleDelete(item._id, i)}
                  />
                  <i 
                    className="fa fa-eye" 
                    aria-hidden="true" 
                    title="View Detail"
                    onClick={()=>this.viewDetail(item._id)}
                  />
                </td>
              </tr>)})
        }
      </tbody>
    )
  }

  userDetail() {
    const { data, userData } = this.state
    const length = userData.length
    let { hasMore } = this.state
    data.map((items, index) => {
      if(index >= length && userData.length < length+10) {
        userData.push(items)
      }
      if(data.length === userData.length) {
        hasMore = false
      }
      return true;
    })
    this.setState({ userData, hasMore })
  }

  // search user data
  searchData(event) {
    const  { params } = this.state
    const userData = []
    if(event.target.value.length > 2 || event.target.value.length === 0){
      params[event.target.name] = event.target.value
      this.setState({ loader: true})
      const url = RoutingConstants.searchData
      post(url, params).then(response=>{
        response.data.map((items, index)=>{
          if (index < 10) {
            userData.push(items)
          }
          return userData
        })
        this.setState({data: response.data, loader: false, userData});
      })
    }
  }

  sortData(event,value) {
    const { sort } = this.state
    let order = 'desc'
    let { userData } = this.state
    sort[event] = !sort[event]
    if(sort[event]) {
      order = 'asc'
    }
    userData = userData.sort(sortByKey(value,order))
    this.setState({ userData, sort })
  }


  render(){
    const { 
      id, sweetalert, hasMore, userId, viewDetail, data, loader, filterDate, params
    } = this.state
    return(
      <div className="main-cntnt-box">
        {
          loader &&
            <div>
              <div className='loader'/>
              <div className="modal-backdrop fade in loading" />
            </div>
        }
        <div className="create-invoice text-center">
          { viewDetail &&
            <ViewUserDetail 
              userId={userId}
              viewUser={()=>this.viewDetail()}
            />
          }
          <div>
            <h2 className="text-center"> Users </h2>
          </div>
          <div className="category-section">
            <div className="new-category">
              <InfiniteScroll
                loadMore={()=>this.userDetail()}
                hasMore={hasMore || false}
                threshold={500}
                useWindow
                initialLoad={false}
              >
                <Table responsive className="user-tble">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>
                        Name 
                        <i className="fa fa-sort"  onClick={()=>this.sortData('name','first_name')} />
                        <input type="text" name="name" onChange={(event)=>this.searchData(event)} placeholder={params.name}/>
                      </th>
                      <th>
                        Email <i className="fa fa-sort" onClick={()=>this.sortData('email','email' )} />
                        <input type="text" name="email" onChange={(event)=>this.searchData(event)} placeholder={params.email}/>
                      </th>
                      <th className="filterDate">
                        Registered At<i className="fa fa-sort"  onClick={()=>this.sortData('sortdate','createdAt' )} />
                        <DatePicker name="date" id="filterDate" onChange={(event)=>this.filterData(event, 'date')} selected={filterDate}  dateFormat="MM/DD/YYYY"/>
                      </th>
                      <th>
                        Status <i className="fa fa-sort"  onClick={()=>this.sortData('status','status' )} />
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  {
                    data.length > 0 ? 
                      this.userData():
                      <tbody>
                        <tr>
                          <td colSpan={1}/>
                          <td colSpan={5}>No data Found</td>
                        </tr>
                      </tbody>
                
                  }
                </Table>
              </InfiniteScroll>
            </div>
          </div>
          {sweetalert &&
            <SweetAlert
              warning
              showCancel
              confirmBtnText="Yes, delete it!"
              confirmBtnBsStyle="danger"
              cancelBtnBsStyle="default"
              bsClass="cancel-btn"
              title="Are you sure?"
              onConfirm={()=>this.deleteUser(id)}
              onCancel={()=>this.onCancelDelete()}
            >
              You will not be able to recover this User!
            </SweetAlert> 
          }
        </div>
      </div>
    )
  }

}

export default Users;

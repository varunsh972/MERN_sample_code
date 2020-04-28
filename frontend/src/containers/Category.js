import React, {Component} from 'react';
import { toast } from 'react-toastify';
import SweetAlert from 'react-bootstrap-sweetalert';
import {Table, Glyphicon, Image} from 'react-bootstrap';
import RoutingConstants from 'lib/RoutingConstants';
import { sortByKey } from 'lib/validation'
import { post, get , remove, put} from 'lib/api';
import CategoryModal from '../components/admin/Category/CategoryModal';

class Category extends Component{
  constructor(props){
    super(props);
    this.state={
      data: [],
      show: false,
      mode:'',
      item:{},
      sweetalert:false,
      sort:{
        name: false,
        sortdate: false
      }
    }
  }

  componentDidMount(){
    const url = RoutingConstants.getCategories;
    get(url).then((response) => {
      if (response.status === 200) {
        this.setState({data: response.record});
      }
    }).catch(err=>{
      toast.error(err.description, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    })
  }

  onCancelDelete(){
    this.setState({sweetalert:null})
  }

  addCategory(inputs){
    const url = RoutingConstants.addCategory;
    post(url, inputs).then((response) => {
      if (response.status === 200) {
        this.state.data.push(response.record);
        this.setState({show:false})
        toast.success('Category added successfully!', {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      }
    }).catch(err=>{
      toast.error(err.description, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    })
  }

  deleteCategory(id){
    const url = `${RoutingConstants.deleteCategory}/${id}`;
    remove(url).then((response)=>{
      if(response.status === 200){
        const data = [...this.state.data];
        // eslint-disable-next-line
        const index = data.findIndex(x=> x._id === id)
        if(index > -1)
        {data.splice(index, 1);}
        this.setState({data, sweetalert:null});
        toast.success('Category deleted successfully!', {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        this.props.history.push("/admin/categories");
      }
    }).catch((err)=>{
      toast.error(err.description, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    })
  }

  editCategory(inputs){
    const { data } = this.state;
    const id = this.state.item._id;
    const url = `${RoutingConstants.editCategory}/${id}`;
    put(url,inputs).then((response)=>{
      if(response.status === 200){
        const updateCategoryarr = data.map(category => category._id === id ? {...category, name:inputs.name, status:inputs.status} : category);
        this.setState({data:updateCategoryarr, show:false})
        toast.success('Category updated successfully!', {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      }
    }).catch((err)=>{
      toast.error(err.description, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    })
  }

  handleDelete(id){
    this.setState({ sweetalert:true, id, show: false })
  }

  handleOpen(){
    this.setState({show:true, mode:'add'})
  }

  handleEdit(item){
    this.setState({show:true, mode:'edit', item})
  }

  categoryData() {
    const { data } = this.state;
    let status;
    return(
      <tbody>
        {
          data.map((item,i) => {
            if(item.status === '1') {
              status = 'Active'
            } else { 
              status = 'InActive'
            }
            return(<tr key={item._id}>
              <td>{i+1}</td>
              <td>{item.name}</td>
              <td>{status}</td>
              <td>
                <Glyphicon 
                  glyph="edit"
                  title="Edit"
                  onClick={()=>this.handleEdit(item)}
                />
                <Glyphicon
                  glyph="trash"
                  title="Delete"
                  onClick={()=>this.handleDelete(item._id, i)}
                />
              </td>
            </tr>)
          })
        }
      </tbody>
    )
  }

  sortData(event) {
    const { sort } = this.state
    let order = 'desc'
    let { data } = this.state
    if(sort[event]) { 
      order = 'asc'
    }
    sort[event] = !sort[event]
    data = data.sort(sortByKey(event,order))
    this.setState({ data, sort })
  }


  render(){
    const { id, sweetalert, mode, show, item  } = this.state
    return(
      <div className="main-cntnt-box">
        <div className="create-invoice category-list">
          <div>
            <h2 className="text-center"> Create New Category </h2>
            <div className="circle" onClick={()=>this.handleOpen()} title="Add Category">
              <Image src="/images/plus.png" alt="Add Category" />
            </div>
          </div>
          <div className="category-section">
            <div className="new-category">
              <Table responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>
                      Name
                      <i className="fa fa-sort"  onClick={()=>this.sortData('name')} />
                    </th>
                    <th>
                      Status
                      <i className="fa fa-sort"  onClick={()=>this.sortData('status')} />
                    </th>
                    <th>Action</th>
                  </tr>
                </thead>
                {this.categoryData()}
              </Table>
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
              onConfirm={()=>this.deleteCategory(id)}
              onCancel={()=>this.onCancelDelete()}
            >
              You will not be able to recover this Category!
            </SweetAlert> 
          }
          <CategoryModal
            show={show}
            mode={mode}
            item={item}
            addCategory={(inputs)=>this.addCategory(inputs)}
            editCategory={(inputs)=>this.editCategory(inputs)}
          />
        </div>
      </div>
    )
  }

}

export default Category;

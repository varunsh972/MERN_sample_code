/*
Component Name: Category
Description: Show Category list
*/
import React, {Component} from 'react';
import {Button, Modal, FormGroup, Form, Col, FormControl} from 'react-bootstrap';
import { validateInputs } from 'lib/validation';



class CategoryModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputs: {},
      errorMessage: {
        name: false,
        status: false
      },
      show: props.show,
    };
  }

  componentWillReceiveProps(props){
    const { inputs } = this.state;
    const name = props.mode === 'add' ? '' : props.item.name
    const status = props.mode === 'add' ? '' : props.item.status
    inputs.name = name
    inputs.status = status
    this.setState({show: props.show, inputs, errorMessage:{}})
  }
  handleClose(){
    this.setState({show:false})
  }

  updateValue(event) {
    const {errorMessage, inputs } = this.state;
    errorMessage[event.target.name] = true
    inputs[event.target.name] = event.target.value;
    this.setState({ errorMessage, inputs });
  }

  validateInputs() {
    const { errorMessage } = this.state;
    const { name, status } = this.state.inputs;
    const { mode } = this.props
    if (!validateInputs('alphabetics', name)) {
      errorMessage.name = 'Please enter valid name ';
    } else {
      errorMessage.name = false;
    }
    if (status === '') {
      errorMessage.status = 'Please enter valid status ';
    } else {
      errorMessage.status = false;
    }
    
    if (!errorMessage.name && !errorMessage.status) {
      if(mode === 'add') {
        this.addCategory()
      } else {
        this.editCategory();
      }
    }
    this.setState({ errorMessage });
  }

  addCategory(){
    this.props.addCategory(this.state.inputs);
  }

  editCategory(){
    this.props.editCategory(this.state.inputs);
  }

  render() {
    const { errorMessage } = this.state;
    return (
      <div>
        <Modal show={this.state.show} onHide={()=>this.handleClose()}>
          <Modal.Header closeButton>
            <Modal.Title>Add Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal>
              <FormGroup controlId="formHorizontalEmail">
                <Col sm={2}>
                  Name
                </Col>
                <Col sm={10}>
                  <FormControl 
                    type="text"
                    name="name"
                    value={this.state.inputs.name}
                    placeholder="Category name"
                    onChange={(event) => this.updateValue(event)} 
                  />
                  {errorMessage.name !== false ?
                    <span className="error-msg">
                      {errorMessage.name}
                    </span>
                    :
                    null
                  }
                </Col>
              </FormGroup>
              <FormGroup controlId="formControlsSelect">
                <Col sm={2}>Status</Col>
                <Col sm={10}>
                  <FormControl 
                    componentClass="select"
                    name="status" 
                    placeholder="select"
                    onChange={(event) => this.updateValue(event)}
                    value={this.state.inputs.status}
                  >
                    <option value="">Please select</option>
                    <option value="1">Active</option>
                    <option value="0">InActive</option>
                  </FormControl>
                  {errorMessage.status !== false ?
                    <span className="error-msg">
                      {errorMessage.status}
                    </span>
                    :
                    null
                  }
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {this.props.mode === 'add' ?
              <Button bsStyle="success"  onClick={()=>this.validateInputs()}>Add</Button>
              :
              <Button bsStyle="success"  onClick={()=>this.validateInputs()}>Edit</Button>}

            <Button onClick={()=>this.handleClose()}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default CategoryModal;

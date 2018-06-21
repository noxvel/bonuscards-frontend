import React, {Component} from 'react';

import {
  Col,
  Row,
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  InputGroupAddon,
  InputGroup
} from 'reactstrap';
import './ChangeForm.css'
import InputMask from 'react-input-mask';
import SERV_PATH from '../src/serverpath';
import { STATUS_MSG } from './constants.js';
import Message from './Message.js';

const CHANGE_CARD = 'changecard'

class ChangeForm extends Component {

  state = {
    clientPhone: '',
    clientName: '',
    clientBirthdate: '',
    oldCardNumber: "",
    newCardNumber: "",

		statusCode: STATUS_MSG.blank,
    searchFormIsValid: true,
    changeFormIsValid: true,
    tightWindowSize: false
  }
  handleSubmitSearch = (event) => {

    event.preventDefault();
    event.stopPropagation();

    if (!event.target.checkValidity()) {
      // form is invalid! so we do nothing
      this.setState({searchFormIsValid: false})
      return;
    }

    this.setState({searchFormIsValid: true});

    // let jsonFormData = {}; jsonFormData = JSON.stringify(this.state);
    fetch(SERV_PATH + CHANGE_CARD + "?phone=" + this.state.clientPhone, {method: 'GET'}).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong ...');
      }
      //return response.json();
    }).then(data => {
      this.setState({statusCode: data.statusCode});
      if (data.statusCode.code === 2005) 
        this.setState({clientName: data.clientName, clientBirthdate: data.clientBirthdate, oldCardNumber: data.cardNumber});
      }
    ).catch(error => this.setState({statusCode: STATUS_MSG.err_3004}))

  }

  handleSubmitChange = (event) => {

    event.preventDefault();
    event.stopPropagation();

    if (!event.target.checkValidity()) {
      // form is invalid! so we do nothing
      this.setState({changeFormIsValid: false})
      return;
    }
    if (this.state.oldCardNumber === ''){
      this.setState({statusCode: STATUS_MSG.err_3003})
      return
    }

    this.setState({changeFormIsValid: true});

    let jsonFormData = {oldCardNumber: this.state.oldCardNumber,
                        newCardNumber: this.state.newCardNumber};
    jsonFormData = JSON.stringify(jsonFormData);

    fetch(SERV_PATH + CHANGE_CARD, {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      // },
      body: jsonFormData
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong ...');
      }
      //return response.json();
    }).then(data => {
      this.setState({statusCode: data.statusCode});
      if (data.statusCode.code === 2004) 
        this.clearFields();
      }
    ).catch(error => this.setState({statusCode: STATUS_MSG.err_3004}))

  }

  clearFields(){
    this.setState({clientName: '',
                  clientPhone: '',
                  clientBirthdate: '',		
                  oldCardNumber: '',
                  newCardNumber: ''});
  }

  handleUserInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // this.setState({[name]: value},              () => { this.validateField(name,
    // value) });
    this.setState({
      [name]: value
    },);
  }

  render() {
    return (
      <Container className="mainForm">

        <Row>
          <Col></Col>

          <Col xs="6">

            <Form
              id="searchForm"
              className={this.state.searchFormIsValid
              ? ""
              : "was-validated"}
              noValidate
              onSubmit={this.handleSubmitSearch}>

              <Row>
                <Col
                  sm={{
                  size: 8,
                  offset: 1
                }}>
                  <FormGroup >

                    {/* <Label for="clientPhone" className="mr-sm-2">Телефон</Label> */}
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">Телефон</InputGroupAddon>
                      <InputMask className="form-control" type="tel" alwaysShowMask={true} mask="+999(99)999-99-99" //placeholder="+38(___)___-__-__"
																				name="clientPhone" autoComplete="off" pattern="((\+380)\(\d{2}\))\d{3}-\d{2}-\d{2}" required value={this.state.clientPhone} onChange={this.handleUserInput}/>

                      <FormFeedback>Укажите телефон клиента.</FormFeedback>
                    </InputGroup>

                  </FormGroup>
                </Col>
                <Col sm="3">
                  <Button outline type="submit">Поиск</Button>
                </Col>
              </Row>

            </Form>

            <div id="dataContainer" className="container">
              <Row>
                <Col className="dataTableChange" xs="4">
                  <b>ФИО</b>
                </Col>
                <Col className="dataTableChange">{this.state.clientName}</Col>
              </Row>
              <Row>
                <Col className="dataTableChange" xs="4">
                  <b>Дата рождения</b>
                </Col>
                <Col className="dataTableChange">{this.state.clientBirthdate}</Col>
              </Row>
              <Row>
                <Col className="dataTableChange" xs="4">
                  <b>Номер карты</b>
                </Col>
                <Col className="dataTableChange">{this.state.oldCardNumber}</Col>
              </Row>
            </div>

            <Form
              id="newCardNumberBlock"
              inline
              className={this.state.changeFormIsValid
              ? ""
              : "was-validated"}
              noValidate
              onSubmit={this.handleSubmitChange}>

              <FormGroup >

                <Label for="newCardNumber" className="mr-sm-3">Новый номер</Label>
                <div>
                  <Input
                    className="mr-sm-3"
                    autoComplete="off"
                    id="newCardNumber"
                    type="text"
                    name="newCardNumber"
                    pattern="\d{8,14}"
                    required
                    value={this.state.newCardNumber}
                    onChange={this.handleUserInput}/>
                  <FormFeedback>Укажите код новой карты.</FormFeedback>
                </div>
              </FormGroup>
              <Button type="submit">Заменить</Button>
            </Form>

          </Col>
          <Col>
              <Message statusCode={this.state.statusCode} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ChangeForm;
import React, {Component} from 'react';

import {
  Alert,
  Col,
  Row,
  Container,
  Button,
  Form,
  FormGroup,
  Input,
  FormFeedback,
  InputGroupAddon,
  Card,
  InputGroup
} from 'reactstrap';
import './CombineForm.css'
//import InputMask from 'react-input-mask';
import FaArrowDown from 'react-icons/lib/fa/arrow-down';

const API = 'http://192.168.100.190/Work/hs/BonusCards/'
const COMBINE_CARD = 'combinecards'

const ERROR_MESSAGES = {
  0: {
    color: "light",
    message: ""
  },
  1: {
    color: "info",
    message: "Найдена карта!"
  },
  2: {
    color: "danger",
    message: "Не найдена карта по указаному номеру!"
  },
  3: {
    color: "danger",
    message: "Неверно указана карты для объединения!"
  },
  4: {
    color: "success",
    message: "Карты объединены!"
  },
  5: {
    color: "warning",
    message: "Не удалось связаться с сервером, обратитесь в тех. службу!"
  },
  6: {
    color: "danger",
    message: "Не удалось объединить карты по техническим причинам!"
  }
}


class ClientCard extends Component {
  state = { 
    clientPhone: '',
    clientName: '',
    clientBirthdate: '',
    clientCardNumber: "",
    searchCardNumber: "",

    statusCode: 0,
    searchFormIsValid: true,
   }


  handleUserInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    },);
  }

  // setCardNumber = (clientCardNumber) => {
  //   this.props.searchCardNumber(this.props.cardType, clientCardNumber);
  // }

  clearFields(){
    this.setState({clientName: '',
                  clientPhone: '',
                  clientBirthdate: '',		
                  oldCardNumber: '',
                  clientCardNumber: '',
                  searchCardNumber: ''});
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

    fetch(API + COMBINE_CARD + "?cardnumber=" + this.state.searchCardNumber, {method: 'GET'}).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong ...');
      }
      //return response.json();
    }).then(data => {
      this.props.setStatusCode(data.statusCode);
      // this.setState({statusCode: data.statusCode});
      if (data.statusCode === 1) 
        this.setState({clientCardNumber: data.clientCardNumber, clientName: data.clientName, clientBirthdate: data.clientBirthdate, clientPhone: data.clientPhone});
        //this.props.setCardNumber(data.clientCardNumber);
      else
        this.clearFields();
      this.setState({searchCardNumber: ''});
      }
    ).catch(error => this.props.setStatusCode(5))

  }

  render() {
    return (
      
            <Card className="dataContainer">

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
                          <InputGroupAddon addonType="prepend">Номер карты</InputGroupAddon>
																			<Input
																						type="text"
																						name="searchCardNumber"
																						pattern="\d{8,14}"
																						autoComplete="off"
																						required
																						value={this.state.searchCardNumber}
																						onChange={this.handleUserInput}/>
																				<FormFeedback>Укажите код карты.</FormFeedback>
                        </InputGroup>

                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <Button type="submit">Поиск</Button>
                    </Col>
                  </Row>

                </Form>

                <div id="dataContainer" className="container">
                  <Row>
                    <Col className="dataTable" xs="4">
                      <b>Номер карты</b>
                    </Col>
                    <Col className="dataTable">{this.state.clientCardNumber}</Col>
                  </Row>
                  <Row>
                    <Col className="dataTable" xs="4">
                      <b>ФИО</b>
                    </Col>
                    <Col className="dataTable">{this.state.clientName}</Col>
                  </Row>
                  <Row>
                    <Col className="dataTable" xs="4">
                      <b>Телефон</b>
                    </Col>
                    <Col className="dataTable">{this.state.clientPhone}</Col>
                  </Row>
                  <Row>
                    <Col className="dataTable" xs="4">
                      <b>Дата рождения</b>
                    </Col>
                    <Col className="dataTable">{this.state.clientBirthdate}</Col>
                  </Row>
                </div>

            </Card>
    );
  }
}


class CombineForm extends Component {

  constructor(props){
    super(props);
    this.fromCard = React.createRef();
    this.toCard   = React.createRef();
  }
  state = {
    statusCode: 0,
    fromCardNumber: '',
    toCardNumber: '',
  }

  setCardNumber = (name, value) => {
    this.setState({[name]: value});
  }

  setStatusCode = (code) => {
    this.setState({statusCode: code});
  }

  handleSubmitCombine = (event) => {

    let fromCardNumber = this.fromCard.current.state.clientCardNumber;
    let toCardNumber   = this.toCard.current.state.clientCardNumber;

    event.preventDefault();
    event.stopPropagation();

    if (fromCardNumber === '' || toCardNumber === '' || fromCardNumber === toCardNumber) {
      this.setState({statusCode: 3});
      return;
    }

    let jsonFormData = {
      fromCardNumber: fromCardNumber,
      toCardNumber: toCardNumber
    };
    jsonFormData = JSON.stringify(jsonFormData);

    fetch(API + COMBINE_CARD, {
      method: 'POST',
      // headers: {   'Content-Type': 'application/x-www-form-urlencoded;
      // charset=UTF-8' },
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
       if (data.statusCode === 4){
         this.fromCard.current.clearFields();
         this.toCard.current.clearFields();
       } 
       
      }
    ).catch(error => this.setState({statusCode: 5}))

  }

  takeMessageText() {
    return ERROR_MESSAGES[this.state.statusCode];
  }

  render() {
    return (
      <Container className="mainForm">


        <Row>
          <Col></Col>

          <Col xs="6">

            <ClientCard ref={this.fromCard} setStatusCode={this.setStatusCode} />

            <div id="iconContainer">
              <FaArrowDown size={50} color="grey"/>
            </div>

            <ClientCard ref={this.toCard} setStatusCode={this.setStatusCode} />

            <Button id="submitButton" color="primary" size="lg" block onClick={this.handleSubmitCombine} >Объединить</Button>

          </Col>
          <Col>
            <Alert
              color={this
              .takeMessageText(this.state.statusCode)
              .color}
              isOpen={this.state.statusCode !== 0}>
              {this
                .takeMessageText(this.state.statusCode)
                .message}
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default CombineForm;
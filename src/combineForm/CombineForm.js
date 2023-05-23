import React, {Component} from 'react';

import {
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
  CardTitle,
  InputGroup,
  Spinner
} from 'reactstrap';
import './CombineForm.css'
import FaArrowDown from 'react-icons/lib/fa/arrow-down';
import SERV_PATH from '../serverpath';
import { STATUS_MSG }  from '../constants.js';
import Message from '../Message.js';

const COMBINE_CARD = 'combinecards'

class ClientCard extends Component {
  state = { 
    clientPhone: '',
    clientName: '',
    clientBirthdate: '',
    clientCardNumber: "",
    searchCardNumber: "",
    searching: false,
		statusCode: STATUS_MSG.blank,
    searchFormIsValid: true,
   }


  handleUserInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    },);
  }

	handleCardNumberInput = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		this.setState({
			[name]: value.replace("-","")
		});
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

    this.setState({searchFormIsValid: true, searching: true});

    // let jsonFormData = {}; jsonFormData = JSON.stringify(this.state);

    fetch(SERV_PATH + COMBINE_CARD + "?cardnumber=" + this.state.searchCardNumber, {method: 'GET'}).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong ...');
      }
      //return response.json();
    }).then(data => {
      this.props.setStatusCode(data.statusCode);
      // this.setState({statusCode: data.statusCode});
      if (data.statusCode.code === 2005) 
        this.setState({clientCardNumber: data.clientCardNumber, clientName: data.clientName, clientBirthdate: data.clientBirthdate, clientPhone: data.clientPhone});
        //this.props.setCardNumber(data.clientCardNumber);
      else
        this.clearFields();
      this.setState({searchCardNumber: ''});
    })
    .catch(error => this.props.setStatusCode(STATUS_MSG.err_3004))
    .finally(() => this.setState({searching: false}))

  }

  render() {
    return (
      
            <Card className="dataContainer" outline color={this.props.cardStyle}>
                <CardTitle style={{color:this.props.cardColor}} className="text-center"> <b>{this.props.cardTitle}</b> </CardTitle>
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
																						onChange={this.handleCardNumberInput}/>
																				<FormFeedback>Укажите правильный код карты.</FormFeedback>
                        </InputGroup>

                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <Button type="submit" disabled={this.state.searching} style={{width: '5rem'}}>
                        {this.state.searching ? <Spinner color="light" style={{width: '1.5rem', height: '1.5rem'}}/> : 'Поиск'}
                      </Button>
                    </Col>
                  </Row>

                </Form>

                <div id="dataContainer" className="container">
                  <Row>
                    <Col className="dataTableCombine" xs="4">
                      <b>Номер карты</b>
                    </Col>
                    <Col className="dataTableCombine">{this.state.clientCardNumber}</Col>
                  </Row>
                  <Row>
                    <Col className="dataTableCombine" xs="4">
                      <b>ФИО</b>
                    </Col>
                    <Col className="dataTableCombine">{this.state.clientName}</Col>
                  </Row>
                  <Row>
                    <Col className="dataTableCombine" xs="4">
                      <b>Телефон</b>
                    </Col>
                    <Col className="dataTableCombine">{this.state.clientPhone}</Col>
                  </Row>
                  <Row>
                    <Col className="dataTableCombine" xs="4">
                      <b>Дата рождения</b>
                    </Col>
                    <Col className="dataTableCombine">{this.state.clientBirthdate}</Col>
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
    statusCode: STATUS_MSG.blank,
    fromCardNumber: '',
    toCardNumber: '',
    sending: false
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
      this.setState({statusCode: STATUS_MSG.err_3002});
      return;
    }

    let jsonFormData = {
      fromCardNumber: fromCardNumber,
      toCardNumber: toCardNumber
    };
    jsonFormData = JSON.stringify(jsonFormData);

    this.setState({sending: true});

    fetch(SERV_PATH + COMBINE_CARD, {
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
       if (data.statusCode.code === 2003){
         this.fromCard.current.clearFields();
         this.toCard.current.clearFields();
       } 
       
    })
    .catch(error => this.setState({statusCode: STATUS_MSG.err_3004}))
    .finally(() => this.setState({sending: false}))

  }

  render() {
    return (
      <Container className="mainForm">


        <Row>
          <Col></Col>

          <Col xs="6">

            <ClientCard ref={this.fromCard} setStatusCode={this.setStatusCode} cardTitle="СПИСАНИЕ БОНУСОВ" cardColor="red" cardStyle="danger" />

            <div id="iconContainer">
              <FaArrowDown size={45} color="grey"/>
            </div>

            <ClientCard ref={this.toCard} setStatusCode={this.setStatusCode} cardTitle="НАЧИСЛЕНИЕ БОНУСОВ" cardColor="green" cardStyle="success" />

            <Button className="mb-4" id="submitButton" color="primary" size="lg" block onClick={this.handleSubmitCombine} disabled={this.state.sending}>
              {this.state.sending ? <Spinner color="light" size="md"/> : 'Объединить'}
            </Button>

          </Col>
          <Col>	
            <Message statusCode={this.state.statusCode} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default CombineForm;
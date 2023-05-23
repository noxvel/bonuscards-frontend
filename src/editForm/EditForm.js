import React, { Component } from 'react';
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
  InputGroupText,
  Label,
  InputGroup,
  Spinner
} from 'reactstrap';
import './EditForm.css'
// import InputMask from 'react-input-mask'
import SERV_PATH from '../serverpath';
import { STATUS_MSG } from '../constants.js';
import Message from '../Message.js';

const EDIT_CARD = 'editcard/'

class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {

      searchCardNumber: '',
      promoNumber: '',
      clientName: '',
      clientPhone: '',
      clientBirthdate: '',
      statusCode: STATUS_MSG.blank,
      searchFormIsValid: true,
      editFormIsValid: true,
      searchFieldAvailable: true,
      promoNumberAvailable: true,
      searching: false,
      sending: false
    };
  }

  clearFields = () => {
    this.setState({ clientName: '', clientPhone: '', clientBirthdate: '', searchCardNumber: '', promoNumber: '', searchFieldAvailable: true });
  }

  resetSearch = () => {
    this.setState({ searchFormIsValid: true});
    this.clearFields();
  }

  handleSubmit = (event) => {

    event.preventDefault();
    event.stopPropagation();
    this.setState({ statusCode: STATUS_MSG.blank });

    if (!event.target.checkValidity() || this.state.searchFieldAvailable) {
      // form is invalid! so we do nothing
      if (this.state.searchFieldAvailable) {
        this.setState({ statusCode: STATUS_MSG.err_3005 })
      }
      this.setState({ editFormIsValid: false });
      return;
    }

    if ((this.state.editMode === 2) && (!Array.isArray(this.state.promos) || !this.state.promos.length)) {
      // array does not exist, is not an array, or is empty
      this.setState({ statusCode: STATUS_MSG.err_3001 });
      return;
    }

    this.setState({ editFormIsValid: true, sending: true});

    let jsonFormData = {};

    jsonFormData = JSON.stringify(this.state);

    fetch(SERV_PATH + EDIT_CARD, {
      method: 'POST',
      body: jsonFormData
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong ...');
      }
      //return response.json();
    }).then(data => {
      this.setState({ statusCode: data.statusCode });
      if (data.statusCode.code === 2001 || data.statusCode.code === 2002)
        this.clearFields();
    })
    .catch(error => this.setState({ statusCode: STATUS_MSG.err_3004 }))
		.finally(() => this.setState({sending: false}))
  }

  handleUserInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

	handleCardNumberInput = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		this.setState({
			[name]: value.replace("-","")
		});
	}

  searchCard = (event) => {

    event.preventDefault();
    event.stopPropagation();
    this.setState({ statusCode: STATUS_MSG.blank });

    if (this.state.searchCardNumber === '') {
      // form is invalid! so we do nothing
      this.clearFields();
      return;
    }

    if (!event.target.checkValidity()) {
      // form is invalid! so we do nothing
      this.setState({searchFormIsValid: false})
      return;
    }

    this.setState({ searchFormIsValid: true, searching: true });

    fetch(SERV_PATH + EDIT_CARD + "?cardnumber=" + this.state.searchCardNumber, { method: 'GET' }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong ...');
      }
    }).then(data => {
      this.setState({ statusCode: data.statusCode });
      if (data.statusCode.code === 2005) {
        this.setState({ clientName: data.clientName, clientBirthdate: data.clientBirthdate, clientPhone: data.clientPhone, searchFieldAvailable: false });
      }
      else {
        this.clearFields();
      }
    })
    .catch(error => this.setState({ statusCode: STATUS_MSG.err_3004 }))
    .finally(() => this.setState({searching: false}))

  }

  handlePromoCheck = () => {
    this.setState({ promoNumberAvailable: !this.state.promoNumberAvailable, promoNumber: '' })
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
              onSubmit={this.searchCard}>

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
                        disabled={!this.state.searchFieldAvailable}
                        value={this.state.searchCardNumber}
                        onChange={this.handleCardNumberInput} />
                      <InputGroupAddon addonType="append">
                        <Button outline color="secondary" onClick={this.resetSearch}>✖</Button>
                      </InputGroupAddon>
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

            <Form
              className={this.state.editFormIsValid
                ? ""
                : "was-validated"}
              noValidate
              onSubmit={this.handleSubmit}>
              <FormGroup >
                <Label for="clientName">ФИО</Label>
                <Input
                  type="text"
                  pattern="[А-Яа-яёЁЇїІіЄєҐґ\s'-]{1,60}"
                  className="form-control"
                  autoComplete="off"
                  name="clientName"
                  placeholder="Шевченко Тарас Григорович"
                  required
                  disabled={this.state.searchFieldAvailable}
                  value={this.state.clientName}
                  onChange={this.handleUserInput} />
                <FormFeedback>Укажите ФИО клиента.</FormFeedback>
              </FormGroup>

              <FormGroup row>
                <Col>

                  <Label for="clientPhone">Телефон</Label>
									<Input
										type="tel"
										pattern="\d{8,20}"
										className="form-control"
										autoComplete="off"
										name="clientPhone"
										placeholder="380XXXXXXXXX"
										required
                    disabled={this.state.searchFieldAvailable}
										value={this.state.clientPhone}
										onChange={this.handleUserInput} />
                  {/* <InputMask className="form-control" type="tel" alwaysShowMask={true} mask="+999(99)999-99-99" //placeholder="+38(___)___-__-__"
                    disabled={this.state.searchFieldAvailable} name="clientPhone" autoComplete="off" pattern="((\+380)\(\d{2}\))\d{3}-\d{2}-\d{2}" required value={this.state.clientPhone} onChange={this.handleUserInput} /> */}

                  <FormFeedback>Укажите телефон клиента.</FormFeedback>
                </Col>

                <Col>
                  <Label for="clientBirthdate">
                    <span>Дата рождения</span>
                  </Label>
                  <Input
                    type="date"
                    name="clientBirthdate"
                    placeholder="date placeholder"
                    required
                    disabled={this.state.searchFieldAvailable}
                    value={this.state.clientBirthdate}
                    onChange={this.handleUserInput} />
                  <FormFeedback>Укажите дату рождения клиента.</FormFeedback>
                </Col>

              </FormGroup>

              <div id="promoNumberField">

                <FormGroup row>
                  <Label for="promoNumber" sm={5} >Прикрепить промокод:</Label>
                  <Col sm={7}>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <Input addon type="checkbox" onChange={this.handlePromoCheck} value={this.state.promoNumberAvailable} aria-label="Checkbox for promo" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="promoNumber"
                        pattern="\d{7,10}"
                        autoComplete="off"
                        disabled={this.state.promoNumberAvailable}
                        value={this.state.promoNumber}
                        onChange={this.handleUserInput} />
                      <FormFeedback>Укажите правильный промокод</FormFeedback>
                    </InputGroup>
                  </Col>

                </FormGroup>
              </div>

              <FormGroup >
                <Button id="submitButton" color="info" size="lg" block type="submit" disabled={this.state.sending}>
									{this.state.sending ? <Spinner color="light" size="md"/> : 'Редактировать'}
                </Button>
              </FormGroup>
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

export default EditForm;
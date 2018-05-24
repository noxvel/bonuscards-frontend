import React, {Component} from 'react';

import {
  Alert,
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
  Card,
  CardBody,
  InputGroup
} from 'reactstrap';

import InputMask from 'react-input-mask';

class ChangeForm extends Component {

  state = {
    clientName: '',
    clientPhone: '',
    clientBirthdate: '',
    promoDisabled: true,
    cardNumber: "",
    promoNumber: "",
    statusCode: 0,
    formIsValid: true,
    tightWindowSize: false
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

            {/* <Alert
              color={this
              .takeMessageText(this.state.statusCode)
              .color}
              isOpen={this.state.statusCode !== 0}>
              {this
                .takeMessageText(this.state.statusCode)
                .message}
            </Alert> */}

            <Form
              className={this.state.formIsValid
              ? ""
              : "was-validated"}
              noValidate
              onSubmit={this.handleSubmit}>

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
                      <InputMask className="form-control mr-sm-2" type="tel" alwaysShowMask={true} id="clientPhone" mask="+38 (999) 999-99-99" //placeholder="+38 (___) ___-__-__"
                        name="clientPhone" pattern="((\+38 )\(\d{3}\)) \d{3}-\d{2}-\d{2}" required value={this.state.clientPhone} onChange={this.handleUserInput}/>
                    </InputGroup>

                    <FormFeedback>Укажите телефон клиента.</FormFeedback>

                  </FormGroup>
                </Col>
                <Col sm="3">
                  <Button outline disabled>Поиск</Button>
                </Col>
              </Row>

              <Card>
                <CardBody>
                  Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                  richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes
                  anderson cred nesciunt sapiente ea proident.
                </CardBody>
              </Card>
            </Form>

          </Col>
          <Col></Col>
        </Row>
      </Container>
    );
  }
}

export default ChangeForm;
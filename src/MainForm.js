import React, {Component} from 'react';
import './MainForm.css';
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
		ButtonGroup
} from 'reactstrap';
import MaskedInput from 'react-text-mask'


const inputParsers = {
  date(input) {
    const [month, day, year] = input.split('/');
    return `${year}-${month}-${day}`;
  },
  uppercase(input) {
    return input.toUpperCase();
  },
  number(input) {
    return parseFloat(input);
  },
};

const API = 'http://192.168.100.190/Work/hs/BonusCards/'
const CREATE_CARD = 'createcard/'

class MainForm extends Component {

		constructor(props) {
				super(props)
				this.state = {
						inputName: 'Чапай',
						inputPhone: '+39 (093) 234-34-23',
						inputBirthdate: '1986-04-12',
						promoDisabled: true,
						cardNumber: "11111",
						promoNumber: "123123",
				}

				this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
				this.handleSubmit = this.handleSubmit.bind(this);
		}

		handleSubmit(event) {

			if (!event.target.checkValidity()) {
				// form is invalid! so we do nothing
				return;
			}

			event.preventDefault();

			let urlEncodedData = "";
			let urlEncodedDataPairs = [];

			// Turn the data object into an array of URL-encoded key/value pairs.
			for(let name in this.state) {
				urlEncodedDataPairs.push(name + '=' + this.state[name]);
			}
			urlEncodedData = urlEncodedDataPairs.join('&');

			// for (let name of data.keys()) {
			// 	const input = form.elements[name];
			// 	const parserName = input.dataset.parse;
	
			// 	if (parserName) {
			// 		const parser = inputParsers[parserName];
			// 		const parsedValue = parser(data.get(name));
			// 		data.set(name, parsedValue);
			// 	}
			// }

			fetch(API + CREATE_CARD,{
				method: 'POST',
				headers: {  
					'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8" 
				},  
				body: urlEncodedData, })
			.then(response => {
					return response.text();
			})
			.then(data => console.log(data))
			.catch(error => console.log(error));
		}

	
		handleUserInput = (e) => {
				const name = e.target.name;
				const value = e.target.value;
				// this.setState({[name]: value},              () => { this.validateField(name,
				// value) });
				this.setState({
						[name]: value
				},);
		}

		onRadioBtnClick(promoState) {
				this.setState({promoDisabled: promoState, promoNumber: ""});
		}

		render() {
				return (

						<Container className="mainForm">

								<Row>
										<Col></Col>

										<Col xs="6">

												<Form className="needs-validation" noValidate onSubmit={this.handleSubmit}>
														<FormGroup >
																<Label for="inputName">ФИО</Label>
																<Input
																		type="text"
																		pattern="[а-яА-Я ]+"
																		className="form-control"
																		name="inputName"
																		placeholder="Чапаев Василий Иванович"
																		required
																		value={this.state.inputName}
																		onChange={this.handleUserInput}/>
																<FormFeedback>Укажите ФИО клиента.</FormFeedback>
														</FormGroup>

														<FormGroup row>
																<Col>

																		<Label for="inputPhone" className="col-md-6">Телефон</Label>
																		<MaskedInput className="form-control"
																				type="tel"
																				mask={['+', '3', '8', '0', ' ', '(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
																				guide={true}
																				showMask={true}
																				placeholder="+380 (__) ___-__-__"
																				name="inputPhone"
																				pattern="((\+380 )\(\d{2}\)) \d{3}-\d{2}-\d{2}"
																				required
																			  value={this.state.inputPhone}
																			  onChange={this.handleUserInput}/> 
																		<FormFeedback>Укажите телефон клиента.</FormFeedback>
																</Col>

																<Col>
																		<Label for="inputBirthdate" className="col-md-6">
																				<span>Дата рождения</span>
																		</Label>
																		<Input
																				type="date"
																				name="inputBirthdate"
																				placeholder="password placeholder"
																				required
																				value={this.state.inputBirthdate}
																				onChange={this.handleUserInput}/>
																		<FormFeedback>Укажите дату рождения клиента.</FormFeedback>
																</Col>

														</FormGroup>

														<div id="cardNumbersField">
																<div id="switchBlock">
																		<h5>Режим создания карты</h5>
																		<ButtonGroup>
																				<Button
																						color="info"
																						onClick={() => this.onRadioBtnClick(true)}
																						active={this.state.promoDisabled}>Создать новую карту</Button>
																				<Button
																						color="info"
																						onClick={() => this.onRadioBtnClick(false)}
																						active={!this.state.promoDisabled}>Подвязать к промокоду</Button>
																		</ButtonGroup>

																</div>

																<FormGroup row>
																		<Col>
																				<Label for="cardNumber">Номер Бонусной карты</Label>
																				<Input
																						type="number"
																						name="cardNumber"
																						required
																						value={this.state.cardNumber}
																						onChange={this.handleUserInput}
																						/>
																				<FormFeedback>Укажите код карты.</FormFeedback>
																		</Col>
																		< Col >
																				<Label for="promoNumber">Промо код</Label>
																				<Input
																						type="number"
																						name="promoNumber"
																						required
																						value={this.state.promoNumber}
																						onChange={this.handleUserInput}
																						disabled={this.state.promoDisabled}
																						/>
																				<FormFeedback>Укажите промокод.</FormFeedback>
																		</Col>

																</FormGroup>
														</div>

														<FormGroup >

																<Button
																		id="submitButton"
																		color="primary"
																		size="lg"
																		block
																		type="submit"
																		>Отправить</Button>

														</FormGroup>
												</Form>

										</Col>
										<Col></Col>
								</Row>

						</Container>
				);
		}
}

export default MainForm;

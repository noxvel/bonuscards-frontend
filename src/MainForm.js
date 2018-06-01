import React, {Component} from 'react';
import './MainForm.css';
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
		ButtonGroup
} from 'reactstrap';

import InputMask from 'react-input-mask'

const API = 'http://192.168.100.190/Work/hs/BonusCards/'
const CREATE_CARD = 'createcard/'

const ERROR_MESSAGES = {
		0: {
				color: "light",
				message: ""
		},
		1: {
				color: "success",
				message: "Бонусная карта успешно создана!"
		},
		2: {
				color: "danger",
				message: "Карта с указаным номером уже существует!"
		},
		3: {
				color: "danger",
				message: "Один или несколько промокодов не найдены в базе!"
		},
		4: {
				color: "danger",
				message: "Уже есть карта, подвязанная к одному из промокодов!"
		},
		5: {
				color: "warning",
				message: "Не удалось связаться с сервером, обратитесь в тех. службу!"
		},
		6: {
				color: "warning",
				message: "Промокоды не указаны!"
		},
		7: {
				color: "danger",
				message: "Ошибка при созднии карты!"
		}

}

class PromoField extends Component {

		state = {}

		deleteCurrentNumber = () => {
				this
						.props
						.deleteNumber(this.props.promoNumber);
		}

		render() {
				return (
						<Alert color="info" isOpen={true} toggle={this.deleteCurrentNumber}>{this.props.promoNumber}</Alert>
				);
		}
}

class MainForm extends Component {

	constructor(props){
		super(props)

		this.promoInput = '';

	}
		state = {
				clientName: '',
				clientPhone: '',
				clientBirthdate: '',
				promoDisabled: true,
				cardNumber: "",
				statusCode: 0,
				formIsValid: true,
				tightWindowSize: false,

				promos: []
		}

		componentDidMount() {
				window.addEventListener("resize", this.updateDimensions);
		}
		componentWillUnmount() {
				window.removeEventListener("resize", this.updateDimensions);
		}

		updateDimensions = () => {
				// this.setState({ 	height: window.innerHeight, 	width: window.innerWidth });
				if (window.innerWidth < 992) {
						this.setState({tightWindowSize: true});
				} else {
						this.setState({tightWindowSize: false});
				}
				//console.log( window.innerWidth);
		}

		clearFields() {
				this.setState({clientName: '', clientPhone: '', clientBirthdate: '', cardNumber: "", promos: [] });
		}

		handleSubmit = (event) => {

				event.preventDefault();
				event.stopPropagation();
				this.setState({statusCode: 0});

				if (!event.target.checkValidity()) {
						// form is invalid! so we do nothing
						this.setState({formIsValid: false});
						return;
				}

				if ( (!this.state.promoDisabled) && (!Array.isArray(this.state.promos) || !this.state.promos.length) ) {
					// array does not exist, is not an array, or is empty
					this.setState({statusCode: 6});
					return;
				}
				this.setState({formIsValid: true});

				let jsonFormData = {};

				jsonFormData = JSON.stringify(this.state);

				fetch(API + CREATE_CARD, {
						method: 'POST',
						// headers: {
						// 		// 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
						// 		// 'Accept': 'application/json',
						// 		// 'Content-Type': 'application/json; charset=UTF-8'
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
						if (data.statusCode === 1) 
								this.clearFields();
						}
				).catch(error => this.setState({statusCode: 5}))
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

		onRadioBtnClick = (e, promoState) => {
				this.setState({promoDisabled: promoState});
		}

		takeMessageText() {
				return ERROR_MESSAGES[this.state.statusCode];
		}

		addPromo = (event) => {
	
				if (event.key !== 'Enter') {
						return;
				}

				let newPromo = this.promoInput.value;

				if (newPromo !== '' && this.state.promos.indexOf(newPromo) === -1 ) {
						this.setState(prevState => ({
								promos: [
										...prevState.promos,
										newPromo
								]
						}));
				}
				event.preventDefault();
				this.promoInput.value = '';

		}

		deleteNumber = (number) => {
				let array = [...this.state.promos]; // make a separate copy of the array
				let index = array.indexOf(number)
				array.splice(index, 1);
				this.setState({promos: array});
		}

		render() {

				let promos = this
						.state
						.promos
						.map((number, i) => {
								return <PromoField key={i} promoNumber={number} deleteNumber={this.deleteNumber}/>
						})

				let promoField = () => {
						if (this.state.promoDisabled) {
								return;
						} else {
								return (
										<Col>
												<Label for="newPromoCode">Добавить промокод</Label>
												<Input type="text" 
													name="newPromoCode" 
													pattern="\d{7}" // required
													autoComplete="off" 
													// value={this.state.newPromoCode} 
													// onChange={this.handleUserInput}
													onKeyPress={this.addPromo} 
													innerRef={(input) => { this.promoInput = input;} }
													disabled={this.state.promoDisabled}/>
												<FormFeedback>Укажите промокод.</FormFeedback>
												
												<div id="promoContainer">
													{promos}
												</div>
										</Col>
								)
						}
				}

				return (

						<Container className="mainForm">

								<Row>
										<Col>
										<svg width="100" height="100" viewBox="0 0 1024 1024">
    <path d="M192 1024h640l64-704h-768zM640 128v-128h-256v128h-320v192l64-64h768l64 64v-192h-320zM576 128h-128v-64h128v64z"></path>
  </svg>
										
										</Col>

										<Col xs="6">

												<Form
														className={this.state.formIsValid
														? ""
														: "was-validated"}
														noValidate
														onSubmit={this.handleSubmit}>
														<FormGroup >
																<Label for="clientName">ФИО</Label>
																<Input
																		type="text"
																		pattern="[а-яА-Я ]{1,60}"
																		className="form-control"
																		autoComplete="off"
																		name="clientName"
																		placeholder="Чапаев Василий Иванович"
																		required
																		value={this.state.clientName}
																		onChange={this.handleUserInput}/>
																<FormFeedback>Укажите ФИО клиента.</FormFeedback>
														</FormGroup>

														<FormGroup row>
																<Col>

																		<Label for="clientPhone">Телефон</Label>
																		<InputMask className="form-control" type="tel" alwaysShowMask={true} mask="+38 (999) 999-99-99" //placeholder="+38 (___) ___-__-__"
																				name="clientPhone" autoComplete="off" pattern="((\+38 )\(\d{3}\)) \d{3}-\d{2}-\d{2}" required value={this.state.clientPhone} onChange={this.handleUserInput}/>

																		<FormFeedback>Укажите телефон клиента.</FormFeedback>
																</Col>

																<Col>
																		<Label for="clientBirthdate">
																				<span>Дата рождения</span>
																		</Label>
																		<Input
																				type="date"
																				name="clientBirthdate"
																				placeholder="password placeholder"
																				required
																				value={this.state.clientBirthdate}
																				onChange={this.handleUserInput}/>
																		<FormFeedback>Укажите дату рождения клиента.</FormFeedback>
																</Col>

														</FormGroup>

														<div id="cardNumbersField">
																<div id="switchBlock">
																		<h5>Режим создания карты</h5>
																		<ButtonGroup vertical={this.state.tightWindowSize}>
																				<Button
																						color="info"
																						onClick={(e) => this.onRadioBtnClick(e, true)}
																						active={this.state.promoDisabled}>Создать новую карту</Button>
																				<Button
																						color="info"
																						onClick={(e) => this.onRadioBtnClick(e, false)}
																						active={!this.state.promoDisabled}>Подвязать к промокоду</Button>
																		</ButtonGroup>

																</div>

																<FormGroup row>
																		<Col>
																				<Label for="cardNumber">Номер Бонусной карты</Label>
																				<Input
																						type="text"
																						name="cardNumber"
																						pattern="\d{8,14}"
																						autoComplete="off"
																						required
																						value={this.state.cardNumber}
																						onChange={this.handleUserInput}/>
																				<FormFeedback>Укажите код карты.</FormFeedback>
																		</Col>
																		{/* show or hide promo field */}
																		{promoField()}

																</FormGroup>
														</div>

														<FormGroup >
																<Button id="submitButton" color="primary" size="lg" block type="submit">Отправить</Button>
														</FormGroup>
												</Form>

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

export default MainForm;

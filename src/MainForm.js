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

const API = 'http://192.168.100.159/Work/hs/BonusCards/'
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
				message: "Введеный промокод не найден в базе!"
		},
		4: {
				color: "danger",
				message: "Уже есть карта, подвязанная к данному промокоду!"
		},
		5: {
				color: "warning",
				message: "Не удалось связаться с сервером, обратитесь в тех. службу!"
		}
}

class MainForm extends Component {
	
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

			componentDidMount() {
				window.addEventListener("resize", this.updateDimensions);
			}
			componentWillUnmount() {
				window.removeEventListener("resize", this.updateDimensions);
			}

			updateDimensions = () => {
				// this.setState({
				// 	height: window.innerHeight, 
				// 	width: window.innerWidth
				// });
				if(window.innerWidth < 992){
					this.setState({ tightWindowSize: true });
				}else{
					this.setState({ tightWindowSize: false });
				}
				//console.log( window.innerWidth);
			}
	
		clearFields(){
			this.setState({clientName: '',
										clientPhone: '',
										clientBirthdate: '',		
										cardNumber: "",
										promoNumber: ""});
		}

		handleSubmit = (event) => {

			event.preventDefault();
			event.stopPropagation();
			this.setState({statusCode: 0});

				if (!event.target.checkValidity()) {
						// form is invalid! so we do nothing
						this.setState({formIsValid: false})
						return;
				}

				this.setState({formIsValid: true});

				let jsonFormData = {};

				jsonFormData = JSON.stringify(this.state);

				fetch(API + CREATE_CARD, {
						method: 'POST',
						headers: {
								'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
						},
						body: jsonFormData
				}).then(response => {
					if (response.ok) {
						return response.json();
					} else {
						throw new Error('Something went wrong ...');
					}
					//return response.json();
				})
				.then(data => {
												this.setState({statusCode: data.statusCode});
												if(data.statusCode === 1)	this.clearFields();		
												})
				.catch(error => this.setState({statusCode: 5}))
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
				this.setState({promoDisabled: promoState, promoNumber: ""});
		}

		takeMessageText() {
				return ERROR_MESSAGES[this.state.statusCode];
		}

		render() {
				let promoField = () => {
						if (this.state.promoDisabled) {
								return;
						} else {
								return (
										<Col>
												<Label for="promoNumber">Промо код</Label>
												<Input
														type="text"
														name="promoNumber"
														pattern="\d{7}"
														required
														autocomplete="off"
														value={this.state.promoNumber}
														onChange={this.handleUserInput}
														disabled={this.state.promoDisabled}/>
												<FormFeedback>Укажите промокод.</FormFeedback>
										</Col>
								)
						}
				}

				return (

						<Container className="mainForm">

								<Row>
										<Col></Col>

										<Col xs="6">

												<Alert
														color={this.takeMessageText(this.state.statusCode).color}	isOpen={this.state.statusCode !== 0}>
														{this.takeMessageText(this.state.statusCode).message}
												</Alert>

												<Form
														className={this.state.formIsValid ? "" : "was-validated"}
														noValidate
														onSubmit={this.handleSubmit}>
														<FormGroup >
																<Label for="clientName">ФИО</Label>
																<Input
																		type="text"
																		pattern="[а-яА-Я ]{1,60}"
																		className="form-control"
																		name="clientName"
																		placeholder="Чапаев Василий Иванович"
																		required
																		value={this.state.clientName}
																		onChange={this.handleUserInput}/>
																<FormFeedback>Укажите ФИО клиента.</FormFeedback>
														</FormGroup>

														<FormGroup row>
																<Col>

																		<Label for="clientPhone" >Телефон</Label>
																		<InputMask
																				className="form-control"
																				type="tel"
																				alwaysShowMask={true}
																				mask="+38 (999) 999-99-99"
																				//placeholder="+38 (___) ___-__-__"
																				name="clientPhone"
																				pattern="((\+38 )\(\d{3}\)) \d{3}-\d{2}-\d{2}"
																				required
																				value={this.state.clientPhone}
																				onChange={this.handleUserInput}/>

																		<FormFeedback>Укажите телефон клиента.</FormFeedback>
																</Col>

																<Col>
																		<Label for="clientBirthdate" >
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
																						onClick={(e) => this.onRadioBtnClick(e,true)}
																						active={this.state.promoDisabled}>Создать новую карту</Button>
																				<Button
																						color="info"
																						onClick={(e) => this.onRadioBtnClick(e,false)}
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
										<Col></Col>
								</Row>

						</Container>
				);
		}
}

export default MainForm;

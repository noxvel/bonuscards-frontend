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
import ConstClass from './constants.js';


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
				message: "Ошибка при созднии/редакт. карты!"
		},
		8: {
				color: "warning",
				message: "Карта по указанному номеру не найдена!"
		},
		9: {
				color: "success",
				message: "Данные по карте изменены!"
		},
		10: {
				color: "info",
				message: "Карта найдена!"
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

		constructor(props) {
				super(props)

				this.promoInput = '';

		}
		state = {
				clientName: '',
				clientPhone: '',
				clientBirthdate: '',
				editMode: 1, // 1 - create, 2 - promo, 3 - edit
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
				this.setState({clientName: '', clientPhone: '', clientBirthdate: '', cardNumber: "", promos: []});
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

				if ((this.state.editMode === 2) && (!Array.isArray(this.state.promos) || !this.state.promos.length)) {
						// array does not exist, is not an array, or is empty
						this.setState({statusCode: 6});
						return;
				}
				this.setState({formIsValid: true});

				let jsonFormData = {};

				jsonFormData = JSON.stringify(this.state);

				fetch(ConstClass.APIPath + CREATE_CARD, {
						method: 'POST',
						// headers: { 		// 'Content-Type': 'application/x-www-form-urlencoded;
						// charset=UTF-8' 		// 'Accept': 'application/json', 		// 'Content-Type':
						// 'application/json; charset=UTF-8' },
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
						if (data.statusCode === 1 || data.statusCode === 9) 
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

		onRadioBtnClick = (e, mode) => {
				this.setState({editMode: mode});
		}

		takeMessageText() {
				return ERROR_MESSAGES[this.state.statusCode];
		}

		addPromo = (event) => {

				if (event.key !== 'Enter') {
						return;
				}

				let newPromo = this.promoInput.value;

				if (newPromo !== '' && this.state.promos.indexOf(newPromo) === -1) {
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

		checkEditMode = (mode) => {
				return this.state.editMode === mode
						? true
						: false;
		}

		searchCard = (event) => {

				event.preventDefault();
				event.stopPropagation();
				this.setState({statusCode: 0});

				if (this.state.cardNumber === '') {
						// form is invalid! so we do nothing
						return;
				}

				this.setState({formIsValid: true});
			
				fetch(ConstClass.APIPath + CREATE_CARD + "?cardnumber=" + this.state.cardNumber, {method: 'GET'}).then(response => {
					if (response.ok) {
						return response.json();
					} else {
						throw new Error('Something went wrong ...');
					}
				}).then(data => {
						this.setState({statusCode: data.statusCode});
						if (data.statusCode === 10) {
								this.setState({ clientName: data.clientName, clientBirthdate: data.clientBirthdate, clientPhone: data.clientPhone});
							}
						else {
								this.clearFields();
						}
						}
				).catch(error => this.setState({statusCode: 5}))

		}

		render() {

				let promos = this
						.state
						.promos
						.map((number, i) => {
								return <PromoField key={i} promoNumber={number} deleteNumber={this.deleteNumber}/>
						})

				let promoField = () => {
						if (this.state.editMode === 1) {
								return;
						} else if (this.state.editMode === 2) {
								return (
										<Col>
												<Label for="newPromoCode">Добавить промокод</Label>
												<Input type="text" name="newPromoCode" pattern="\d{7}" // required
														autoComplete="off"  
														onKeyPress={this.addPromo} 
														innerRef={(input) => {
															this.promoInput = input;
														}}
												 		disabled={this.state.editMode !== 2}/>
												<FormFeedback>Укажите промокод.</FormFeedback>

												<div id="promoContainer">
														{promos}
												</div>
										</Col>
								)
						} else if (this.state.editMode === 3) {
								return (
										<Col  id="searchBlock">
									
												<Button id="searchButton" color="secondary" onClick={this.searchCard}>
														Поиск
												</Button>
										
										</Col>
								)
						}
				}

				return (

						<Container className="mainForm">

								<Row>
										<Col></Col>

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
																		pattern="[А-Яа-яёЁЇїІіЄєҐґ\s']{1,60}"
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
																		<InputMask className="form-control" type="tel" alwaysShowMask={true} mask="+38(999)999-99-99" //placeholder="+38(___)___-__-__"
																				name="clientPhone" autoComplete="off" pattern="((\+38)\(\d{3}\))\d{3}-\d{2}-\d{2}" required value={this.state.clientPhone} onChange={this.handleUserInput}/>

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
																						onClick={(e) => this.onRadioBtnClick(e, 1)}
																						active={this.checkEditMode(1)}>Новая</Button>
																				<Button
																						color="info"
																						onClick={(e) => this.onRadioBtnClick(e, 2)}
																						active={this.checkEditMode(2)}>Промокод</Button>
																				<Button
																						color="info"
																						onClick={(e) => this.onRadioBtnClick(e, 3)}
																						active={this.checkEditMode(3)}>Редактировать</Button>
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

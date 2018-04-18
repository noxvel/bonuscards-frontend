import React, {Component} from 'react';
import './MainForm.css';
import {
		Col,
		Button,
		Form,
		FormGroup,
		Label,
		Input,
		FormFeedback,
		ButtonGroup
} from 'reactstrap';

class MainForm extends Component {

		constructor(props) {
				super(props)
				this.state = {
						inputName: '',
						inputPhone: '',
						inputBirthdate: '',
						emptyName: false,
						emptyPhone: false,
						emptyBirthdate: false,
						emptyCardNumber: false,
						emptyPromoNumber: false,
						promoDisabled: true,
						cardNumber: "",
						promoNumber: ""
				}

				this.submitData = this
						.submitData
						.bind(this);

				this.onRadioBtnClick = this
						.onRadioBtnClick
						.bind(this);

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

		submitData(e) {
				if (this.state.inputName === "") {
						this.setState({emptyName: true});
				} else {
						this.setState({emptyName: false});
				}

				if (this.state.inputPhone === "") {
						this.setState({emptyPhone: true});
				} else {
						this.setState({emptyPhone: false});
				}

				if (this.state.inputBirthdate === "") {
						this.setState({emptyBirthdate: true});
				} else {
						this.setState({emptyBirthdate: false});
				}

				if (this.state.cardNumber === "") {
						this.setState({emptyCardNumber: true});
				} else {
						this.setState({emptyCardNumber: false});
				}

				if (this.state.promoNumber === "" && this.state.promoDisabled) {
						this.setState({emptyPromoNumber: true});
				} else {
						this.setState({emptyPromoNumber: false});
				}
				//console.log(this.refs.codeblock.promoNumber) // "qux"
		}

		render() {
				return (

						<div className="container mainForm">

								<div className="row">
										<div className="col"></div>

										<div className="col-6">

												<Form>
														<FormGroup >
																<Label for="inputName">ФИО</Label>
																<Input
																		type="text"
																		className="form-control"
																		name="inputName"
																		placeholder="Чапаев Василий Иванович"
																		value={this.state.inputName}
																		invalid={this.state.emptyName}
																		onChange={this.handleUserInput}/>
																<FormFeedback>Укажите ФИО клиента.</FormFeedback>
														</FormGroup>

														<FormGroup row>
																<Col>

																		<Label for="inputPhone" className="col-md-6">Телефон</Label>
																		<Input
																				type="phone"
																				name="inputPhone"
																				autoComplete="off"
																				placeholder="+380 XX XXX XX XX"
																				value={this.state.inputPhone}
																				invalid={this.state.emptyPhone}
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
																				value={this.state.inputBirthdate}
																				invalid={this.state.emptyBirthdate}
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
																						value={this.state.cardNumber}
																						onChange={this.handleUserInput}
																						invalid={this.state.emptyCardNumber}/>
																				<FormFeedback>Укажите код карты.</FormFeedback>
																		</Col>
																		< Col >
																				<Label for="promoNumber">Промо код</Label>
																				<Input
																						type="number"
																						name="promoNumber"
																						value={this.state.promoNumber}
																						onChange={this.handleUserInput}
																						disabled={this.state.promoDisabled}
																						invalid={this.state.emptyPromoNumber}/>
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
																		onClick={this.submitData}>Отправить</Button>

														</FormGroup>
												</Form>

										</div>
										<div className="col"></div>
								</div>

						</div>
				);
		}
}

export default MainForm;

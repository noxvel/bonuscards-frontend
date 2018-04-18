import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';
import MainForm from './MainForm.js';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Регистрация бонусной карты</h1>
        </header>

        <MainForm />
      
      </div>

    );
  }
}

export default App;

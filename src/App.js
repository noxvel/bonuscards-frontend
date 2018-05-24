import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';
import Header from './Header.js';
import Main from './Main.js';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <Main/>
      </div>
    );
  }
}

export default App;

import React, {Component} from 'react';
import {NavLink, Link} from 'react-router-dom';
import './Header.css';
import {Nav, Navbar, NavItem, Button} from 'reactstrap';

class Header extends Component {
  state = {}
  render() {
    return (
      <header className="App-header">
        <h1 className="App-title">Регистрация бонусной карты</h1>
        <Navbar className="justify-content-center" >
      
          <Nav tabs>
          <NavItem>
            <NavLink className="nav-link" activeClassName='active' to='/create'>Новая</NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" activeClassName='active' to='/replacement'>Заменить</NavLink>
          </NavItem>
          </Nav>
        </Navbar>
      </header>

    );
  }
}

export default Header;
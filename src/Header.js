import React, {Component} from 'react';
import {NavLink } from 'react-router-dom';
import './Header.css';
import {Nav, Navbar, NavItem } from 'reactstrap';

class Header extends Component {
  state = {}
  render() {
    return (
      <header className="App-header">
        <h1 className="App-title">Регистрация бонусной карты</h1>
        <Navbar className="justify-content-center" >
      
          <Nav tabs>
          <NavItem>
            <NavLink className="nav-link" activeClassName='active' to='/create'>Создать</NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" activeClassName='active' to='/replacement'>Заменить</NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" activeClassName='active' to='/combine'>Объединить</NavLink>
          </NavItem>
          </Nav>
        </Navbar>
      </header>

    );
  }
}

export default Header;
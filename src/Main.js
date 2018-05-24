import React, {Component} from 'react';

import {Switch, Route, Redirect} from 'react-router-dom'
import MainForm from './MainForm.js';
import ChangeForm from './ChangeForm.js';

class Main extends Component {
  state = {}
  render() {
    return (
      <main>
        <Switch>
          {/* <Route exact path='/' component={MainForm}/> */}
          <Redirect exact from='/' to='/create'/>
          <Route path='/create' component={MainForm}/>
          <Route path='/replacement' component={ChangeForm}/>
        </Switch>
      </main>
    );
  }
}

export default Main;
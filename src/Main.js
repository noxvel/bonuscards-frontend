import React, {Component} from 'react';

import {Switch, Route, Redirect} from 'react-router-dom'
import MainForm from './mainForm/MainForm.js';
import ChangeForm from './changeForm/ChangeForm.js';
import CombineForm from './combineForm/CombineForm.js';
import EditForm from './editForm/EditForm.js';

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
          <Route path='/combine' component={CombineForm}/>
          <Route path='/edit' component={EditForm}/>
        </Switch>
      </main>
    );
  }
}

export default Main;
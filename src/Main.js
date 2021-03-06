import React, {Component} from 'react';

import {Switch, Route, Redirect} from 'react-router-dom'
import MainForm from './MainForm.js';
import ChangeForm from './ChangeForm.js';
import CombineForm from './CombineForm.js';
import EditForm from './EditForm.js';

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
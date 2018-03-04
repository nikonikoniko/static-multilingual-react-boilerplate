import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';

// import {store} from '../store';
// import {getMeta} from '../redux/actions';
// store.dispatch(getMeta());

export default class App extends Component {

  render() {
    return (
      <div>
        <div>
          <Switch>
            <Route path="/:locale/" component={Home} />
            <Route path="/:locale/somethingelse" component={Home} />
          </Switch>
        </div>
      </div>
    );
  }
}

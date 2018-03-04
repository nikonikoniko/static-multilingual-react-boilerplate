import React from 'react';
import {render} from 'react-dom';
import {Router, Route} from 'react-router-dom';
import { Provider } from 'react-redux';

import history from './history';

import '../scss/main.scss';

import './bullshit';

import App from './containers/App';

import {store} from './store';

render(
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Route path="/:ar/" component={App} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('js-root')
);

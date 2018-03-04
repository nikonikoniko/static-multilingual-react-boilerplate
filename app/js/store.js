import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

import reader from './redux/reducers';

const persistedState =
 localStorage.getItem('reduxState') ?
   JSON.parse(localStorage.getItem('reduxState')) : {};

let middleware = [thunkMiddleware];
if (process.env.NODE_ENV !== 'production') {
  middleware = [...middleware, logger];
}

export const store = createStore(
  reader,
  persistedState,
  applyMiddleware(...middleware)
);

store.subscribe(() => {
  localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});

export default {store};

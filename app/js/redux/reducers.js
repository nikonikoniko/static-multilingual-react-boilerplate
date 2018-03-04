import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import {merge, set} from 'lodash/fp';

const defaultDb = {
  updating: true,
  ds: [],
  filters: {},
  selectedUnit: {}
};

const database = (state = defaultDb, action) => {
  switch (action.type) {
    case 'INITIATE':
      return {};
    case 'UPDATE_FILTERS':
      return merge(state, {filters: action.filters});
    case 'RESET_FILTERS':
      return set('filters', defaultDb.filters, state);
    case 'UPDATE_UNITS':
      return set('ds', action.units, state);
    case 'UPDATE_STATS':
      return merge(state, {stats: action.stats});
    case 'REQUEST_UNITS':
      return merge(state, {updating: action.received});
    default:
      return state;
  }
};


const app = combineReducers({
  database,
  router: routerReducer
});

export default app;

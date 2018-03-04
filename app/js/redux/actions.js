import {store} from '../store';

export const getState = () =>
  dispatch => {
    const current = store.getState();

    return dispatch({type: 'INITIATE_META', meta: current});
  };


export default {
  getState
};

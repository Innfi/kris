import thunk from 'redux-thunk';
import axios from 'axios';
import { applyMiddleware, combineReducers, createStore } from 'redux';

const backendUrl = 'http://localhost:1330'; // FIXME

export interface TradyState {
  email: string;
  ports: string[]; // FIXME
  stats: any; // FIXMEEEE
  stockData: any,
}

interface TradyActionRedux {
  type: string;
  payload?: any;
}

const STAT_RESP = 'STAT_RESP';
const ERROR = 'ERROR';
const SIMPLE_RESP = 'SIMPLE_RESP';

// state
const initialState: TradyState = {
  email: '',
  ports: [],
  stats: {},
  stockData: {},
};

const initialAction: TradyActionRedux = {
  type: ERROR,
};

// reducer
const tradyReducer = (
  state: TradyState = initialState,
  action: TradyActionRedux = initialAction,
): TradyState => {
  switch (action.type) {
  case STAT_RESP:
    return {
      ...state,
      stats: action.payload.stats,
    };
  case ERROR:
    return state;
  case SIMPLE_RESP:
    return state;
  default:
    return state;
  }
};

export const rootReducer = combineReducers({ tradyReducer });

export type RootReducerType = typeof rootReducer;

// actions
export const loadStatThunk = (symbol: string) => {
  return async (dispatch: Function) => {
    try {
      const response = await axios.get(`${backendUrl}/${symbol}`);

      console.log(`data: ${response.data}`);

      dispatch({
        type: STAT_RESP,
        payload: response.data, // FIXME: check data type
      });
    } catch (err: unknown) {
      dispatch({
        type: ERROR,
        payload: err,
      });
    }
  };
};

export const simpleCallThunk = () => {
  return async (dispatch: Function) => {
    try {
      const response = await axios.get(`${backendUrl}/stat`);

      console.log(`simpleCallThunk: ${JSON.stringify(response.data)}`);

      dispatch({
        type: SIMPLE_RESP,
        payload: response.data,
      });
    } catch (err: unknown) {
      dispatch({
        type: ERROR,
        payload: err,
      });
    }
  };
};

// store
export const store = createStore(rootReducer, applyMiddleware(thunk));

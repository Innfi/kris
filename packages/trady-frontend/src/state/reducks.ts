import thunk from 'redux-thunk';
import axios from 'axios';
import { applyMiddleware, combineReducers, createStore } from 'redux';

import { StockData } from './model';
import { NavigateFunction } from 'react-router-dom';

const backendUrl = 'http://localhost:1330'; // FIXME

export interface TradyState {
  email: string;
  ports: string[]; // FIXME
  stockData?: StockData;
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
  stockData: undefined,
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
      stockData: action.payload.stockData,
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
export const loadStatThunk = (symbol: string, interval: string) => {
  return async (dispatch: Function) => {
    try {
      const url = `${backendUrl}/stat/intraday/${symbol}?interval=${interval}`;
      const response = await axios.get(url);

      console.log(`data: ${JSON.stringify(response.data)}`);
      const stockData = JSON.parse(response.data) as StockData;

      dispatch({
        type: STAT_RESP,
        payload: {
          stockData,
        },
      });
    } catch (err: unknown) {
      dispatch({
        type: ERROR,
        payload: err,
      });
    }
  };
};

export const simpleCallThunk = (navigate: NavigateFunction) => {
  return async (dispatch: Function) => {
    try {
      const response = await axios.get(`${backendUrl}/stat`);

      console.log(`simpleCallThunk: ${JSON.stringify(response.data)}`);

      dispatch({
        type: SIMPLE_RESP,
        payload: response.data,
      });

      navigate('/');
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

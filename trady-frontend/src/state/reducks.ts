import thunk from 'redux-thunk';
import axios from 'axios';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { NavigateFunction } from 'react-router-dom';

import { StockData } from './model';

const backendUrl = 'http://localhost:1330';

export interface TradyState {
  email: string;
  ports: string[]; // FIXME
  stockStats: StockData[];
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
  stockStats: [],
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
      stockStats: [...state.stockStats, action.payload.stockData],
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

      // console.log(`loadStatThunk] url: ${url}`);

      const response = await axios.get(url);
      // const stockData: StockData = JSON.parse(response.data.stockData);
      // console.log(`loadStatThunk] data: ${JSON.stringify(stockData)}`);

      dispatch({
        type: STAT_RESP,
        payload: {
          stockData: response.data.stockData,
        },
      });
    } catch (err: unknown) {
      // console.log(`err: ${(err as Error).message}`);
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

      // console.log(`simpleCallThunk: ${JSON.stringify(response.data)}`);

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

import thunk from 'redux-thunk';
import axios from 'axios';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { History } from 'history';

const backendUrl = 'http://localhost:3000'; //FIXME

export interface TradyState {
  email: string;
  ports: string[]; //FIXME
  stats: any; //FIXMEEEE
}

interface TradyActionRedux {
  type: string;
  payload: any;
}

const STAT_RESP = 'STAT_RESP';

//state
const initialState: TradyState = {
  email: '',
  ports: [],
  stats: {},
};

//reducer
const tradyReducer = (
  state: TradyState = initialState,
  action: TradyActionRedux,
): TradyState => {
  switch (action.type) {
    case STAT_RESP:
      return {
        ...state,
        stats: action.payload.stats,
      };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({ tradyReducer });

//actions
export const loadStatThunk =
  (symbol: string, history: History) => async (dispatch: Function) => {
    try {
      const response = await axios.get(backendUrl);

      dispatch({
        type: STAT_RESP,
        payload: response.data, //FIXME: check data type
      });
    } catch (err: unknown) {}
  };

//store
export const store = createStore(rootReducer, applyMiddleware(thunk));

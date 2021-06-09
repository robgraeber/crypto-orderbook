import { CryptoType } from 'src/constants/CryptoType';
import { Level } from 'src/types/Level';

// Action Types
export enum OrderbookActionTypes {
  UPDATE_BID_LEVELS = 'orderbook/UPDATE_BID_LEVELS',
  UPDATE_ASK_LEVELS = 'orderbook/UPDATE_ASK_LEVELS',
  SHOW_ERROR_MESSAGE = 'orderbook/SHOW_ERROR_MESSAGE',
  WS_CONNECT = 'orderbook/WS_CONNECT',
  WS_SUBSCRIBE = 'orderbook/WS_SUBSCRIBE',
  WS_DISCONNECT = 'orderbook/WS_DISCONNECT',
  WS_PROCESS_UPDATES = 'orderbook/WS_PROCESS_UPDATES',
  WS_THROW_ERROR = 'orderbook/WS_THROW_ERROR',
}

interface UpdateAction {
  type: OrderbookActionTypes.UPDATE_BID_LEVELS | OrderbookActionTypes.UPDATE_ASK_LEVELS;
  payload: {
    levels: Level[];
  };
}

interface SubscribeAction {
  type: OrderbookActionTypes.WS_SUBSCRIBE;
  payload: {
    cryptoType: CryptoType;
  };
}

interface ShowErrorAction {
  type: OrderbookActionTypes.SHOW_ERROR_MESSAGE;
  payload: {
    showError: Boolean;
  };
}

interface NormalAction {
  type:
    | OrderbookActionTypes.WS_CONNECT
    | OrderbookActionTypes.WS_DISCONNECT
    | OrderbookActionTypes.WS_PROCESS_UPDATES
    | OrderbookActionTypes.WS_THROW_ERROR;
}

type OrderbookAction = NormalAction | UpdateAction | SubscribeAction | ShowErrorAction;

// Action Creators

// State
export type OrderbookState = {
  bidLevels: Level[];
  askLevels: Level[];
  showError: Boolean;
};

const initialState: OrderbookState = {
  bidLevels: [],
  askLevels: [],
  showError: false,
};

// Action Creators
export function updateBidLevels(levels: Level[]): OrderbookAction {
  return { type: OrderbookActionTypes.UPDATE_BID_LEVELS, payload: { levels } };
}

export function updateAskLevels(levels: Level[]): OrderbookAction {
  return { type: OrderbookActionTypes.UPDATE_ASK_LEVELS, payload: { levels } };
}

export function connectWebsocket(): OrderbookAction {
  return { type: OrderbookActionTypes.WS_CONNECT };
}

export function disconnectWebsocket(): OrderbookAction {
  return { type: OrderbookActionTypes.WS_DISCONNECT };
}

export function processWebsocketUpdates(): OrderbookAction {
  return { type: OrderbookActionTypes.WS_PROCESS_UPDATES };
}

export function subscribeWebsocketFeed(cryptoType: CryptoType): OrderbookAction {
  return { type: OrderbookActionTypes.WS_SUBSCRIBE, payload: { cryptoType } };
}

export function showErrorMessage(shouldShowError: boolean): OrderbookAction {
  return {
    type: OrderbookActionTypes.SHOW_ERROR_MESSAGE,
    payload: { showError: shouldShowError },
  };
}

export function throwWebsocketError(): OrderbookAction {
  return { type: OrderbookActionTypes.WS_THROW_ERROR };
}

// Reducer
export default function reducer(state: OrderbookState = initialState, action: OrderbookAction) {
  switch (action.type) {
    case OrderbookActionTypes.UPDATE_BID_LEVELS:
      return { ...state, bidLevels: action.payload.levels };
    case OrderbookActionTypes.UPDATE_ASK_LEVELS:
      return { ...state, askLevels: action.payload.levels };
    case OrderbookActionTypes.SHOW_ERROR_MESSAGE:
      return { ...state, showError: action.payload.showError };
    default:
      return state;
  }
}

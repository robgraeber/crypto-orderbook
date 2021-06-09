import { Middleware } from 'redux';
import { CryptoType } from 'src/constants/CryptoType';
import {
  disconnectWebsocket,
  OrderbookActionTypes,
  processWebsocketUpdates,
  showErrorMessage,
  updateAskLevels,
  updateBidLevels,
} from 'src/modules/Orderbook';
import { RootAction, RootState } from 'src/Store';
import { convertTupleToLevel, getUpdatedLevels } from 'src/utils/OrderbookUtils';

const ORDERBOOK_WS_ENDPOINT = 'wss://www.cryptofacilities.com/ws/v1';

enum productIds {
  BTC = 'PI_XBTUSD',
  ETH = 'PI_ETHUSD',
}
const productIdMap = {
  [CryptoType.BTC]: productIds.BTC,
  [CryptoType.ETH]: productIds.ETH,
};

// Process level updates every 100 ms.
const UPDATE_INTERVAL = 100;

let client: WebSocket | null = null;
let currentProductId: productIds | null = null;
let shouldThrowError: boolean = false;
let updateLevelInterval: number;
let bidLevelUpdates: [number, number][] = [];
let askLevelUpdates: [number, number][] = [];

export const OrderSocket: Middleware<{}, RootState> =
  ({ dispatch, getState }) =>
  (next) =>
  (action: RootAction): RootAction => {
    function disconnectAndShowError() {
      dispatch(disconnectWebsocket());
      dispatch(showErrorMessage(true));
    }

    switch (action.type) {
      case OrderbookActionTypes.WS_CONNECT:
        if (client && client.readyState === WebSocket.OPEN) {
          client.close();
        }

        client = new WebSocket(ORDERBOOK_WS_ENDPOINT);

        client.onmessage = function (event) {
          try {
            const data = JSON.parse(event.data);

            if (data.feed === 'book_ui_1_snapshot') {
              // Set the initial bid / ask levels.
              const initialBidLevels = data.bids.map(convertTupleToLevel);
              const initialAskLevels = data.asks.map(convertTupleToLevel);

              dispatch(updateBidLevels(initialBidLevels));
              dispatch(updateAskLevels(initialAskLevels));
            } else if (
              data.feed === 'book_ui_1' &&
              data.product_id === currentProductId &&
              (data.bids || data.asks)
            ) {
              if (shouldThrowError) {
                shouldThrowError = false;
                throw new Error('Example error');
              }

              // Push updates to queue to update on WS_PROCESS_UPDATES actions.
              // Doing this so performance does not degrade when websocket sends data too quickly.
              bidLevelUpdates.push(...data.bids);
              askLevelUpdates.push(...data.asks);
            }
          } catch {
            disconnectAndShowError();
          }
        };

        client.onerror = function () {
          disconnectAndShowError();
        };
        break;
      case OrderbookActionTypes.WS_SUBSCRIBE:
        const subscribe = () => {
          try {
            const productId = productIdMap[action.payload.cryptoType];

            if (currentProductId) {
              client?.send(
                JSON.stringify({
                  event: 'unsubscribe',
                  feed: 'book_ui_1',
                  product_ids: [currentProductId],
                })
              );
            }

            client?.send(
              JSON.stringify({
                event: 'subscribe',
                feed: 'book_ui_1',
                product_ids: [productId],
              })
            );

            if (updateLevelInterval) {
              clearInterval(updateLevelInterval);
            }

            updateLevelInterval = setInterval(
              function () {
                dispatch(processWebsocketUpdates());
              } as TimerHandler,
              UPDATE_INTERVAL
            );

            currentProductId = productId;
            shouldThrowError = false;
            askLevelUpdates = [];
            bidLevelUpdates = [];
            dispatch(updateBidLevels([]));
            dispatch(updateAskLevels([]));
            dispatch(showErrorMessage(false));
          } catch {
            disconnectAndShowError();
          }
        };

        if (client && client.readyState === WebSocket.OPEN) {
          subscribe();
        } else if (client && client.readyState === WebSocket.CONNECTING) {
          client.onopen = subscribe;
        } else {
          console.error('Must initialize connection before subscribing');
        }
        break;
      case OrderbookActionTypes.WS_PROCESS_UPDATES:
        try {
          const state = getState();

          // Update the initial bid / ask levels.
          const updatedBidLevels = getUpdatedLevels(
            state.orderbook.bidLevels,
            bidLevelUpdates,
            false
          );
          const updatedAskLevels = getUpdatedLevels(
            state.orderbook.askLevels,
            askLevelUpdates,
            true
          );

          bidLevelUpdates = [];
          askLevelUpdates = [];
          dispatch(updateBidLevels(updatedBidLevels));
          dispatch(updateAskLevels(updatedAskLevels));
        } catch {}
        break;
      case OrderbookActionTypes.WS_DISCONNECT:
        if (client !== null) {
          client.close();
          client = null;
        }

        if (updateLevelInterval) {
          clearInterval(updateLevelInterval);
        }
        break;
      case OrderbookActionTypes.WS_THROW_ERROR:
        shouldThrowError = true;
        break;
    }

    return next(action);
  };

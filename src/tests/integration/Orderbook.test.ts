import reducer, { OrderbookActionTypes } from 'src/modules/Orderbook';

describe('Integration | Modules | Orderbook', () => {
  it('reduces correctly', () => {
    const state = {
      bidLevels: [],
      askLevels: [],
      showError: false,
    };

    expect(
      reducer(state, {
        type: OrderbookActionTypes.UPDATE_ASK_LEVELS,
        payload: {
          levels: [{ price: 1, size: 2 }],
        },
      })
    ).toEqual({ ...state, askLevels: [{ price: 1, size: 2 }] });

    expect(
      reducer(state, {
        type: OrderbookActionTypes.UPDATE_BID_LEVELS,
        payload: {
          levels: [{ price: 1, size: 2 }],
        },
      })
    ).toEqual({ ...state, bidLevels: [{ price: 1, size: 2 }] });

    expect(
      reducer(state, {
        type: OrderbookActionTypes.SHOW_ERROR_MESSAGE,
        payload: {
          showError: true,
        },
      })
    ).toEqual({ ...state, showError: true });
  });
});

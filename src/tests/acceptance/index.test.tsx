import React from 'react';
import WS from 'jest-websocket-mock';
import { render, fireEvent } from 'src/tests/testUtils';
import Home from 'src/pages/index';
import { waitFor } from '@testing-library/dom';

describe('Home page', () => {
  let server: WS;

  beforeEach(() => {
    jest.useFakeTimers();

    server = new WS('wss://www.cryptofacilities.com/ws/v1');
  });

  afterEach(() => {
    WS.clean();

    jest.useRealTimers();
  });

  it('renders initially and can process updates', async () => {
    const { container } = render(<Home />, {});

    jest.advanceTimersByTime(110);

    await server.connected;

    server.send(
      JSON.stringify({
        feed: 'book_ui_1_snapshot',
        bids: [
          [1, 30],
          [2, 30],
          [3, 30],
        ],
        asks: [
          [4, 30],
          [5, 30],
          [6, 30],
        ],
      })
    );

    jest.advanceTimersByTime(110);

    expect(container.querySelectorAll('tbody tr').length).toEqual(6);

    server.send(
      JSON.stringify({
        feed: 'book_ui_1',
        product_id: 'PI_XBTUSD',
        bids: [
          [1, 0],
          [2, 0],
          [3, 50],
        ],
        asks: [
          [4, 50],
          [5, 0],
          [6, 0],
        ],
      })
    );

    jest.advanceTimersByTime(110);

    expect(container.querySelectorAll('tbody tr').length).toEqual(2);
  });

  it('can toggle feeds successfully', async () => {
    const { container } = render(<Home />, {});

    jest.advanceTimersByTime(110);

    await server.connected;

    server.send(
      JSON.stringify({
        feed: 'book_ui_1_snapshot',
        bids: [
          [1, 30],
          [2, 30],
          [3, 30],
        ],
        asks: [
          [4, 30],
          [5, 30],
          [6, 30],
        ],
      })
    );

    jest.advanceTimersByTime(110);

    expect(container.querySelectorAll('tbody tr').length).toEqual(6);

    (container.querySelector('.toggleFeedButton') as HTMLButtonElement).click();

    server.send(
      JSON.stringify({
        feed: 'book_ui_1',
        product_id: 'PI_XBTUSD',
        bids: [[1, 0]],
        asks: [[6, 0]],
      })
    );

    server.send(
      JSON.stringify({
        feed: 'book_ui_1_snapshot',
        bids: [
          [10, 30],
          [20, 30],
          [30, 30],
          [40, 30],
        ],
        asks: [
          [40, 30],
          [50, 30],
          [60, 30],
          [70, 30],
        ],
      })
    );

    server.send(
      JSON.stringify({
        feed: 'book_ui_1',
        product_id: 'PI_XBTUSD',
        bids: [[5, 10]],
        asks: [[6, 10]],
      })
    );

    jest.advanceTimersByTime(110);

    expect(container.querySelectorAll('tbody tr').length).toEqual(8);
    expect(container.querySelectorAll('tbody tr .priceCell')[0].textContent).toEqual('10.00');
  });

  it('shows the error page if websocket throws error', async () => {
    const { container } = render(<Home />, {});

    jest.advanceTimersByTime(110);

    await server.connected;

    server.send(
      JSON.stringify({
        feed: 'book_ui_1_snapshot',
        bids: [
          [1, 30],
          [2, 30],
          [3, 30],
        ],
        asks: [
          [4, 30],
          [5, 30],
          [6, 30],
        ],
      })
    );

    jest.advanceTimersByTime(110);

    expect(container.querySelectorAll('tbody tr').length).toEqual(6);

    server.error();

    jest.advanceTimersByTime(110);

    expect(container.querySelector('.errorOverlay')).toBeTruthy();
  });
});

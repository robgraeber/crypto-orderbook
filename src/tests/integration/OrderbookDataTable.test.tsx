import OrderbookDataTable from 'src/components/OrderbookDataTable';
import { LevelWithTotal } from 'src/types/LevelWithTotal';
import { render } from '../testUtils';

describe('Integration | Components | OrderbookDataTable', () => {
  let levels: LevelWithTotal[];

  beforeEach(() => {
    levels = [
      {
        price: 1,
        size: 30,
        total: 40,
      },
      {
        price: 2,
        size: 40,
        total: 70,
      },
      {
        price: 3,
        size: 50,
        total: 120,
      },
      {
        price: 4,
        size: 60,
        total: 180,
      },
      {
        price: 5,
        size: 60,
        total: 240,
      },
    ];
  });

  it('renders corrects in BID mode', () => {
    const { container } = render(
      <OrderbookDataTable orderType="BID" levels={levels} maxTotal={20} maxLevelCount={4} />,
      {}
    );

    expect(container.querySelectorAll('tbody tr').length).toEqual(4);
    expect(container.querySelectorAll('th').length).toEqual(3);
    expect(container.querySelectorAll('th')[0]?.textContent).toEqual('Total');
    expect(container.querySelectorAll('th')[1]?.textContent).toEqual('Size');
    expect(container.querySelectorAll('th')[2]?.textContent).toEqual('Price');
    expect(container.querySelectorAll('tbody tr:first-child td')[0].textContent).toEqual('40');
    expect(container.querySelectorAll('tbody tr:first-child td')[1].textContent).toEqual('30');
    expect(container.querySelectorAll('tbody tr:first-child td')[2].textContent).toEqual('1.00');
  });

  it('renders corrects in ASK mode', () => {
    const { container } = render(
      <OrderbookDataTable orderType="ASK" levels={levels} maxTotal={20} maxLevelCount={4} />,
      {}
    );

    expect(container.querySelectorAll('tbody tr').length).toEqual(4);
    expect(container.querySelectorAll('th').length).toEqual(3);
    expect(container.querySelectorAll('th')[2]?.textContent).toEqual('Total');
    expect(container.querySelectorAll('th')[1]?.textContent).toEqual('Size');
    expect(container.querySelectorAll('th')[0]?.textContent).toEqual('Price');
    expect(container.querySelectorAll('tbody tr:first-child td')[2].textContent).toEqual('40');
    expect(container.querySelectorAll('tbody tr:first-child td')[1].textContent).toEqual('30');
    expect(container.querySelectorAll('tbody tr:first-child td')[0].textContent).toEqual('1.00');
  });
});

import { ChangeEvent, useEffect, useState } from 'react';
import { useAppSelector } from 'src/Store';
import { getLevelsGroupedByPrice, getLevelsWithTotal } from 'src/utils/OrderbookUtils';
import styles from 'src/styles/Orderbook.module.css';
import OrderbookDataTable from './OrderbookDataTable';

const MAX_LEVEL_COUNT = 25;

type ComponentProps = {
  priceGroupings: number[];
  showError?: Boolean;
};

export default function Orderbook(props: ComponentProps) {
  const askLevels = useAppSelector((state) => state.orderbook.askLevels);
  const bidLevels = useAppSelector((state) => state.orderbook.bidLevels);
  const [groupedPrice, setGroupedPrice] = useState(props.priceGroupings[0]);

  useEffect(() => {
    // Reset grouped price to first option when changed.
    setGroupedPrice(props.priceGroupings[0]);
  }, props.priceGroupings);

  const askLevelsWithGrouping = getLevelsGroupedByPrice(askLevels, groupedPrice);
  const bidLevelsWithGrouping = getLevelsGroupedByPrice(bidLevels, groupedPrice);
  const askLevelsWithTotal = getLevelsWithTotal(askLevelsWithGrouping.slice(0, MAX_LEVEL_COUNT));
  const bidLevelsWithTotal = getLevelsWithTotal(bidLevelsWithGrouping.slice(0, MAX_LEVEL_COUNT));
  const totals = askLevelsWithTotal.concat(bidLevelsWithTotal).map(({ total }) => total);
  // Get the highest total of all levels;
  const maxTotal = Math.max(...totals);

  function onGroupingChange(event: ChangeEvent<HTMLSelectElement>) {
    setGroupedPrice(Number(event.target.value));
  }

  return (
    <div className={styles.orderbook}>
      <div className={styles.header}>
        <h3 className={styles.title}>Order Book</h3>
        <select className={styles.groupDropdown} onChange={onGroupingChange} id="grouping">
          {props.priceGroupings.map((value) => (
            <option key={value} value={value}>
              Group {value.toFixed(2)}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.contents}>
        <OrderbookDataTable
          levels={bidLevelsWithTotal}
          maxTotal={maxTotal}
          orderType="BID"
          maxLevelCount={MAX_LEVEL_COUNT}
        />
        <OrderbookDataTable
          levels={askLevelsWithTotal}
          maxTotal={maxTotal}
          orderType="ASK"
          maxLevelCount={MAX_LEVEL_COUNT}
        />
        {props.showError && (
          <div className={styles.errorOverlay}>
            An error has occurred, please refresh to restart the feed.
          </div>
        )}
      </div>
    </div>
  );
}

import classNames from 'classnames';
import { LevelWithTotal } from 'src/types/LevelWithTotal';
import styles from 'src/styles/OrderbookDataTable.module.css';

type ComponentProps = {
  orderType: 'BID' | 'ASK';
  levels: LevelWithTotal[];
  maxTotal: number;
  maxLevelCount: number;
};

/**
 * Component for rendering an individual orderbook table for bid / ask.
 * Reverses the columns and changes color for 'ASK' order types.
 * Chose to use array reversing for simplicity, did not use css {direction: 'rtl'} for accessibility reasons.
 * Could integrate React-Table in future if more advanced functionality is required.
 * @param props
 * @returns
 */
export default function OrderbookDataTable(props: ComponentProps) {
  const headerLabels = ['Total', 'Size', 'Price'];
  const isAskOrderType = props.orderType === 'ASK';

  if (isAskOrderType) {
    headerLabels.reverse();
  }

  return (
    <table
      aria-label={isAskOrderType ? 'Open Ask Orders' : 'Open Bid Orders'}
      className={styles.table}
      cellSpacing="0"
    >
      <thead>
        <tr>
          {headerLabels.map((label) => (
            <th key={label} className={classNames([styles.tableHeader, styles.tableCell])}>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={styles.tableBody}>
        {props.levels.slice(0, props.maxLevelCount).map(({ total, size, price }) => {
          // Total percentage is from 1-99 to leave some gap to match designs.
          const totalPercentage = Math.max((total / props.maxTotal) * 99, 1);
          const reverseTotalPercentage = 100 - totalPercentage;
          const cells = [
            <td key="total" className={styles.tableCell}>
              {total.toLocaleString('en', { useGrouping: true })}
            </td>,
            <td key="size" className={styles.tableCell}>
              {size.toLocaleString('en', { useGrouping: true })}
            </td>,
            <td
              key="price"
              className={classNames({
                [styles.tableCell]: true,
                [styles.priceCell]: true,
                [styles.priceCellRed]: isAskOrderType,
              })}
            >
              {price.toLocaleString('en', {
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>,
          ];

          if (isAskOrderType) {
            cells.reverse();
          }

          const bidLevelGradient = `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${reverseTotalPercentage}%, rgba(25,211,25,0.15) ${reverseTotalPercentage}%, rgba(25,211,25,0.15) 100%)`;
          const askLevelGradient = `linear-gradient(90deg, rgba(211,25,25,0.25) 0%, rgba(211,25,25,0.25) ${totalPercentage}%, rgba(0,0,0,0) ${totalPercentage}%, rgba(0,0,0,0) 100%)`;

          return (
            <tr
              key={price}
              style={{
                background: isAskOrderType ? askLevelGradient : bidLevelGradient,
              }}
            >
              {cells}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

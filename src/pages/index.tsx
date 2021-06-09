import classNames from 'classnames';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { CryptoType } from 'src/constants/CryptoType';
import {
  connectWebsocket,
  subscribeWebsocketFeed,
  throwWebsocketError,
} from 'src/modules/Orderbook';
import { useAppDispatch, useAppSelector } from 'src/Store';
import Orderbook from 'src/components/Orderbook';
import styles from 'src/styles/Home.module.css';

const priceGroupingMap = {
  [CryptoType.BTC]: [0.5, 1, 2.5],
  [CryptoType.ETH]: [0.05, 0.1, 0.25],
};

export default function Home() {
  const dispatch = useAppDispatch();
  const showError = useAppSelector((state) => state.orderbook.showError);
  const [cryptoType, setCryptoType] = useState<CryptoType>(CryptoType.BTC);
  const [throwErrorToggle, setThrowErrorToggle] = useState(false);

  useEffect(() => {
    dispatch(connectWebsocket());
    dispatch(subscribeWebsocketFeed(cryptoType));
  }, []);

  function toggleFeed() {
    if (cryptoType === CryptoType.BTC) {
      dispatch(subscribeWebsocketFeed(CryptoType.ETH));
      setCryptoType(CryptoType.ETH);
    } else {
      dispatch(subscribeWebsocketFeed(CryptoType.BTC));
      setCryptoType(CryptoType.BTC);
    }
  }

  function killFeed() {
    if (!throwErrorToggle) {
      dispatch(throwWebsocketError());
      setThrowErrorToggle(true);
    } else {
      dispatch(connectWebsocket());
      dispatch(subscribeWebsocketFeed(cryptoType));
      setThrowErrorToggle(false);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Crypto Orderbook</title>
        <meta name="description" content="Crypto orderbook using next.js, redux, and typescript" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>
      </Head>

      <main className={styles.main}>
        <Orderbook priceGroupings={priceGroupingMap[cryptoType]} showError={showError} />

        <div>
          <button
            className={classNames([styles.orderbookButton, styles.toggleFeedButton])}
            onClick={toggleFeed}
          >
            <i className={classNames(['fa', 'fa-exchange', styles.buttonIcon])}></i>
            Toggle Feed
          </button>
          <button
            className={classNames([styles.orderbookButton, styles.killFeedButton])}
            onClick={killFeed}
          >
            <i className={classNames(['fa', 'fa-exclamation-circle', styles.buttonIcon])}></i>
            Kill Feed
          </button>
        </div>
      </main>
    </div>
  );
}

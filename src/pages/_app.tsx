import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from 'src/Store';
import 'src/styles/globals.css';

// Currently the store is only client-side.
// More work is needed for SSR support or consider using next-redux-wrapper.
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
export default MyApp;

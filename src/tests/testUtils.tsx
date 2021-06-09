import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'src/Store';

// This replicates the providers in _app.tsx.
const Providers: React.ComponentType = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

const customRender = (ui: JSX.Element, options = {}) =>
  render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };

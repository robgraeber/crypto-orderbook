import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ActionFromReducersMapObject, applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { OrderSocket } from './middleware/OrderSocket';
import orderbook from './modules/Orderbook';

// Add all reducers here.
const reducers = { orderbook };
const rootReducer = combineReducers(reducers);

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(OrderSocket)));

// Infer root types from the reducers and store themselves.
export type RootState = ReturnType<typeof rootReducer>;
export type RootAction = ActionFromReducersMapObject<typeof reducers>;
export type AppDispatch = typeof store.dispatch;

// Use throughout app instead of plain `useDispatch` and `useSelector`.
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

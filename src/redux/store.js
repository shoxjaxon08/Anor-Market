// store.ts
import { configureStore } from '@reduxjs/toolkit';
import CartReducer from './CartReducer';

const store = configureStore({
  reducer: {
    cart: CartReducer,
  },
});



export default store;



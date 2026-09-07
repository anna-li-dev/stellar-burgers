import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsReducer } from './slices/ingredientsSlice';
import { burgerConstructorReducer } from './slices/burgerConstructorSlice';
import { orderReducer } from './slices/orderSlice';
import { feedReducer } from './slices/feedSlice';
import { profileOrdersReducer } from './slices/profileOrdersSlice';
import { userReducer } from './slices/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer,
  user: userReducer
});

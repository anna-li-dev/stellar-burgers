import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

type OrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
  isLoading: boolean;
  orderNotFound: boolean;
};

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null,
  isLoading: false,
  orderNotFound: false
};

export const orderBurger = createAsyncThunk<TOrder, string[]>(
  'order/orderBurger',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);

    return {
      ...response.order,
      ingredients
    };
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  getOrderByNumberApi
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
      state.error = null;
      state.orderNotFound = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Оформление заказа
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка оформления заказа';
      })

      // Получение заказа по номеру
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.orderNotFound = false;
        state.orderModalData = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload.orders.length > 0) {
          state.orderModalData = action.payload.orders[0];
        } else {
          state.orderNotFound = true;
        }
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
        state.orderNotFound = true;
      });
  }
});

export const { clearOrder } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;

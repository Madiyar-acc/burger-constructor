import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';
import { getFeedOrders, getOrderByNumber, getUserOrders } from '@api';
import { type RootState } from '../store';

export const fetchFeedOrders = createAsyncThunk(
  'orders/fetchFeedOrders',
  async () => {
    const response = await getFeedOrders();

    if (!response.success) {
      throw new Error('Не удалось загрузить ленту заказов');
    }

    return response;
  }
);
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;

    if (!accessToken) {
      throw new Error('Необходимо авторизоваться');
    }

    const response = await getUserOrders(accessToken);
    console.log('Ответ заказов пользователя:', response);
    if (!response.success) {
      throw new Error('Не удалось загрузить заказы пользователя');
    }

    return response.orders;
  }
);
export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumber(number);

    if (!response.success || !response.orders.length) {
      throw new Error('Заказ не найден');
    }

    return response.orders[0];
  }
);

type OrdersState = {
  feed: TOrder[];
  total: number;
  totalToday: number;
  selectedOrder: TOrder | null;
  feedLoading: boolean;
  orderLoading: boolean;
  error: string | null;
  userOrders: TOrder[];
  userOrdersLoading: boolean;
};

const initialState: OrdersState = {
  feed: [],
  total: 0,
  totalToday: 0,
  selectedOrder: null,
  feedLoading: false,
  orderLoading: false,
  error: null,
  userOrders: [],
  userOrdersLoading: false
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedOrders.pending, (state) => {
        state.feedLoading = true;
        state.error = null;
      })
      .addCase(fetchFeedOrders.fulfilled, (state, action) => {
        state.feedLoading = false;
        state.feed = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeedOrders.rejected, (state, action) => {
        state.feedLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки ленты';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderLoading = true;
        state.selectedOrder = null;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказа';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.userOrdersLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        console.log('Заказы в fulfilled:', action.payload);
        state.userOrdersLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.userOrdersLoading = false;
        state.error =
          action.error.message ?? 'Не удалось загрузить заказы пользователя';
      });
  }
});

export const { clearSelectedOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

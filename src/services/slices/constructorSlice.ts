import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { createOrder } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';
type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  order: TOrder | null;
  orderRequest: boolean;
  error: string | null;
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  order: null,
  orderRequest: false,
  error: null
};
export const createOrderThunk = createAsyncThunk<
  TOrder,
  string[],
  { state: RootState }
>('burgerConstructor/createOrder', async (ingredients, { getState }) => {
  const accessToken = getState().auth.accessToken;
  if (!accessToken) {
    throw new Error('Для оформления заказа необходимо войти в аккаунт');
  }

  const response = await createOrder(ingredients, accessToken);

  if (!response.success || !response.order) {
    throw new Error('Не удалось оформить заказ');
  }

  return response.order;
});
const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      console.log('Добавляем:', action.payload);
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients.push(action.payload);
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (index === -1 || index === 0) {
        return;
      }
      [state.ingredients[index], state.ingredients[index - 1]] = [
        state.ingredients[index - 1],
        state.ingredients[index]
      ];
    },
    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (index === -1 || index === state.ingredients.length - 1) {
        return;
      }
      [state.ingredients[index], state.ingredients[index + 1]] = [
        state.ingredients[index + 1],
        state.ingredients[index]
      ];
    },
    clearOrder: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.orderRequest = true;
        state.order = null;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Не удалось оформить заказ';
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp,
  clearOrder,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;

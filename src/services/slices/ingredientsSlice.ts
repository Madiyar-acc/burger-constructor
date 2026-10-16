import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredients } from '@api';
import { TIngredient } from '@utils-types';
export type InitialStateIngredients = {
  ingredients: TIngredient[];
  loading: boolean;
  error: null | string;
};

export const initialState: InitialStateIngredients = {
  ingredients: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const response = await getIngredients();

    return response.data;
  }
);
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

export default ingredientsSlice.reducer;

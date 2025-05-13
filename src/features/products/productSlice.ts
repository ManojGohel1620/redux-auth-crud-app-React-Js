import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
}

interface ProductsState {
  list: Product[];
  loading: boolean;
  error: string;
}

const initialState: ProductsState = {
  list: [],
  loading: false,
  error: '',
};

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const res = await axios.get('https://dummyjson.com/products');
  return res.data.products as Product[];
});

export const addProduct = createAsyncThunk(
  'products/add',
  async (product: Omit<Product, 'id'>, thunkAPI) => {
    try {
      const res = await axios.post('https://dummyjson.com/products/add', product, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data as Product;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async (product: Product, thunkAPI) => {
    try {
      const res = await axios.put(
        `https://dummyjson.com/products/${product.id}`,
        { title: product.title, price: product.price, description: product.description },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return res.data as Product;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id: number, thunkAPI) => {
    try {
      await axios.delete(`https://dummyjson.com/products/${id}`);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.list.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.list = state.list.map(p => p.id === action.payload.id ? action.payload : p);
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.list = state.list.filter(p => p.id !== action.payload);
      });
  },
});

export default productSlice.reducer;
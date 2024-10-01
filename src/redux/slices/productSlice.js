import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance'; // Make sure this is correctly configured
import { toast } from 'react-toastify';

// Async Thunks for handling Product API requests
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:4000/products');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (productId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`http://localhost:4000/products/${productId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addProduct = createAsyncThunk('products/addProduct', async (newProduct, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:4000/products', newProduct);
    toast.success('Product added successfully!');
    return response.data;
  } catch (error) {
    toast.error('Failed to add product');
    return rejectWithValue(error.response.data);
  }
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ productId, updatedProduct }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`http://localhost:4000/products/${productId}`, updatedProduct);
    toast.success('Product updated successfully!');
    return response.data;
  } catch (error) {
    toast.error('Failed to update product');
    return rejectWithValue(error.response.data);
  }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:4000/products/${productId}`);
    toast.success('Product deleted successfully!');
    return productId;
  } catch (error) {
    toast.error('Failed to delete product');
    return rejectWithValue(error.response.data);
  }
});

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })

      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add product';
      })

        // Fetch Single Product by ID
    .addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchProductById.fulfilled, (state, action) => {
      state.product = action.payload;
      state.loading = false;
    })
    .addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch product details';
    })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update product';
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete product';
      });
  },
});

export default productSlice.reducer;

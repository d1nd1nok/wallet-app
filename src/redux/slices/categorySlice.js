import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = "http://localhost:3001/categories";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, thunkAPI) => {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`http://localhost:3001/categories?userId=${userId}`);
    return res.data;
  }
);

export const addCategory = createAsyncThunk(
  "categories/add",
  async (category) => {
    const userId = localStorage.getItem("userId");
    const res = await axios.post("http://localhost:3001/categories", {
      ...category,
      userId,
    });
    return res.data;
  }
);

export const deleteCategory = createAsyncThunk("categories/delete", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

export const editCategory = createAsyncThunk(
  "categories/edit",
  async ({ id, updatedData }) => {
    const res = await axios.patch(`${API_URL}/${id}`, updatedData);
    return res.data;
  }
);


const categorySlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((cat) => cat.id !== action.payload);
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default categorySlice.reducer;

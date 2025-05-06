import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3001/transactions";

export const fetchTransactions = createAsyncThunk("transactions/fetch", async () => {
  const userId = localStorage.getItem("userId");
    const res = await axios.get(`http://localhost:3001/transactions?userId=${userId}`);
    return res.data;
});

export const addTransaction = createAsyncThunk("transactions/add", async (transaction) => {
  const userId = localStorage.getItem("userId");
  const res = await axios.post("http://localhost:3001/transactions", {
    ...transaction,
    userId,
  });
  return res.data;
});

export const deleteTransaction = createAsyncThunk("transactions/delete", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

export const updateTransaction = createAsyncThunk("transactions/update", async (transaction) => {
  const response = await axios.put(`${API_URL}/${transaction.id}`, transaction);
  return response.data;
});

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    list: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t.id !== action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.list.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});


export default transactionSlice.reducer
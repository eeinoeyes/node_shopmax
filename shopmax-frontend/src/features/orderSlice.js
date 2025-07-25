import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { cancleOrder, createOrder, deleteOrder, getOrders } from '../api/orderApi'

//주문생성
export const createOrderThunk = createAsyncThunk('order/createOrder', async (orderData, { rejectWithValue }) => {
   try {
      const response = await createOrder(orderData)
      return response.data.orderId
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

//주문내역
export const getOrdersThunk = createAsyncThunk('order/getOrders', async (data, { rejectWithValue }) => {
   try {
      const response = await getOrders(data)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

//주문 취소
export const cancelOrderThunk = createAsyncThunk('order/cancelOrder', async (id, { rejectWithValue }) => {
   try {
      await cancleOrder(id)
      return id
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

//주문 삭제
export const deleteOrderThunk = createAsyncThunk('order/deleteOrder', async (id, { rejectWithValue }) => {
   try {
      await deleteOrder(id)
      return id
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

export const orderSlice = createSlice({
   name: 'orders',
   initialState: {
      orders: [],
      pagination: null,
      loading: true,
      error: null,
   },

   reducers: {},
   extraReducers: (builder) => {
      //주문하기
      builder
         .addCase(createOrderThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createOrderThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(createOrderThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         //주문내역 조회하기
         .addCase(getOrdersThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getOrdersThunk.fulfilled, (state, action) => {
            state.loading = false
            state.orders = action.payload.orders
            state.pagination = action.payload.pagination
         })
         .addCase(getOrdersThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         //주문 취소
         .addCase(cancelOrderThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(cancelOrderThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(cancelOrderThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         //주문 삭제
         .addCase(deleteOrderThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteOrderThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(deleteOrderThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default orderSlice.reducer

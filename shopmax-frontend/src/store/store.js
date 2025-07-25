import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import itemReducer from '../features/itemSlice'
import orderReducer from '../features/orderSlice'

const store = configureStore({
   reducer: {
      auth: authReducer,
      items: itemReducer,
      orders: orderReducer,
   },
})

export default store

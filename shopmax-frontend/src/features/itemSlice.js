import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createItem, getItems } from '../api/itemApi'

export const createItemThunk = createAsyncThunk('item/createItem', async (itemData, { rejectWithValue }) => {
   try {
      const response = await createItem(itemData)
      return response.data.item
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

//전체상품 리스트 가져오기
export const fetchItemsThunk = createAsyncThunk('item/fetchItems', async (data, { rejectWithValue }) => {
   try {
      //data: 검색어, 페이징 처리에 필요한 데이터가 들어있는 객체
      console.log('✨[itemSlice] fetchItemsThunk data:', data)

      const response = await getItems(data)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

const itemSlice = createSlice({
   name: 'items',
   initialState: {
      item: null, // 상품 단일 정보
      items: [], // 전체 상품 리스트
      pagination: null,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      // 상품 등록
      builder
         .addCase(createItemThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createItemThunk.fulfilled, (state, action) => {
            state.loading = false
            state.item = action.payload // insert한 상품 정보 저장 (위에서 response.data.item으로 받아왔으니까)
         })
         .addCase(createItemThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         //상품 리스트 가져오기
         .addCase(fetchItemsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchItemsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.items = action.payload.items
            state.pagination = action.payload.pagination
         })
         .addCase(fetchItemsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default itemSlice.reducer

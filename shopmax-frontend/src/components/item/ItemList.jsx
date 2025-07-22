import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Stack, Pagination, Select, MenuItem, FormControl, InputLabel, IconButton, Typography, Link } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItemsThunk } from '../../features/itemSlice'
import { formatWithComma, stripComma } from '../../utils/priceSet'

function ItemList() {
   const [searchTerm, setSearchTerm] = useState('') //검어어
   const [searchCategory, setSearchCategory] = useState('itemNm') // 검색 카테고리
   const [sellCategory, setSellCategory] = useState('') //SELL, SOLD_OUT
   const [searchSubmit, setSearchSubmit] = useState(false) // 검색버튼 클릭 상태
   const [page, setPage] = useState(1) // 페이지 번호

   const dispatch = useDispatch()
   const navigate = useNavigate()

   const { items, pagination, loading, error } = useSelector((state) => state.items)

   //전체 상품 리스트 가져오기
   useEffect(() => {
      dispatch(fetchItemsThunk({ page, limit: 5, searchTerm, searchCategory, sellCategory }))
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dispatch, page, sellCategory, searchSubmit]) // page, sellCategory, searchSubmit 값이 바뀔 때마다 useEffect 실행
   //searchTerm, searchCategory -> 상태가 바뀔 때마다 (값에 변화 있을 때마다) 실행되니까 제외 -> eslint주석 달아서 경고메시지 방지!

   //판매상태 변경
   const handleSellCategoryChange = (e) => {
      setSellCategory(e.target.value)
      setPage(1)
   }

   //검색기준 변경
   const handleSearchCategoryChange = (e) => {
      setSearchCategory(e.target.value)
      setPage(1)
   }

   //페이지 변경
   const handlePageChange = (e, value) => {
      setPage(value)
   }
   //검색어 변경시
   const handleSearchChange = (e) => {
      setSearchTerm(e.target.value)
   }

   //검색 버튼 클릭시
   const handleSearchSubmit = (e) => {
      e.preventDefault()
      setSearchSubmit((prev) => !prev) //검색버튼 클릭 상태 토글
      setPage(1)
   }

   //삭제 버튼
   const handleDelete = (e) => {}

   return (
      <>
         <Box sx={{ p: 4 }}>
            {/* 등록버튼 */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
               {/* spa방식으로 이동: state가 업데이트가 안됨 */}
               <RouterLink to="/items/create">
                  <Button variant="contained">상품등록</Button>
               </RouterLink>
            </Box>

            {/* 테이블 */}
            <TableContainer component={Paper}>
               <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                     <TableRow>
                        <TableCell align="center">번호</TableCell>
                        <TableCell align="center">상품명</TableCell>
                        <TableCell align="center">가격</TableCell>
                        <TableCell align="center">판매상태</TableCell>
                        <TableCell align="center">등록일</TableCell>
                        <TableCell align="center">삭제</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {items.length > 0 ? (
                        items.map((item) => (
                           <TableRow key={item.id}>
                              <TableCell>{item.id}</TableCell>
                              <TableCell align="center">{item.itemNm}</TableCell>
                              <TableCell align="center">{item.price}</TableCell>
                              <TableCell align="center">{item.itemSellStatus}</TableCell>
                              <TableCell align="center">{dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                              <TableCell align="center">
                                 <IconButton aria-label="delete" onClick={handleDelete}>
                                    <DeleteIcon />
                                 </IconButton>
                              </TableCell>
                           </TableRow>
                        ))
                     ) : (
                        <TableRow>
                           <TableCell colSpan={6} align="center">
                              등록된 상품이 없습니다.
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </TableContainer>

            {/* 페이징 */}
            <Stack spacing={2} sx={{ mt: 3, mb: 3, alignItems: 'center' }}>
               <Pagination count={pagination?.totalPages} page={page} onChange={handlePageChange} />
            </Stack>

            {/* 검색 및 필터 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: 5 }}>
               <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel id="sell_category">판매상태</InputLabel>
                  <Select labelId="sell_category" id="demo-simple-select" value={sellCategory} label="판매상태" onChange={handleSellCategoryChange}>
                     <MenuItem value="">전체</MenuItem>
                     <MenuItem value="SELL">판매중</MenuItem>
                     <MenuItem value="SOLD_OUT">품절</MenuItem>
                  </Select>
               </FormControl>
               <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel id="search_category">검색기준</InputLabel>
                  <Select labelId="search_category" value={searchCategory} label="판매상태" onChange={handleSearchCategoryChange}>
                     <MenuItem value="">전체</MenuItem>
                     <MenuItem value="itemNm">상품명</MenuItem>
                     <MenuItem value="itemDetail">상품설명</MenuItem>
                  </Select>
               </FormControl>
               <FormControl sx={{ flex: 1 }}>
                  <TextField label="검색" variant="outlined" size="small" value={searchTerm} onChange={handleSearchChange} placeholder="검색어 입력" fullWidth />
               </FormControl>
               <Button variant="contained" type="submit">
                  검색
               </Button>
            </Box>
         </Box>
      </>
   )
}

export default ItemList

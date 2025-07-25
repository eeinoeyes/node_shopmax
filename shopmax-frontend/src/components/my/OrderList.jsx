import { Box, Card, CardMedia, CardContent, Typography, Button, Pagination, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs' //날짜 시간 포맷해주는 패키지
import 'dayjs/locale/ko' // 한글 로케일 불러오기
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cancelOrderThunk, deleteOrderThunk, getOrdersThunk } from '../../features/orderSlice'
import { formatWithComma } from '../../utils/priceSet'
import { useNavigate, useParams } from 'react-router-dom'

function OrderList() {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const { orders, pagination, loading, error } = useSelector((state) => state.orders)
   const [page, setPage] = useState(1) // 페이지

   const [startDate, setStartDate] = useState(null) // 시작날짜(포맷전)
   const [endDate, setEndDate] = useState(null) // 끝 날짜(포맷전)
   const [formattedStartDate, setFormattedStartDate] = useState('') // 시작날짜(포맷후)
   const [formattedEndDate, setFormattedEndDate] = useState('') // 끝날짜(포맷후)

   const [cancelComplete, setCancelComplete] = useState(false) // 주문 취소 토글
   const [deleteComplete, setDeleteComplete] = useState(false) // 주문 삭제 토글

   useEffect(() => {
      dispatch(
         getOrdersThunk({
            page,
            limit: 5,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
         })
      )
   }, [dispatch, page, formattedStartDate, formattedEndDate])

   //날짜 데이터를 포맷
   const handleDateFilter = () => {
      // 시작일 또는 종료일 값이 null일 경우
      if (!startDate || !endDate) {
         alert('시작일과 종료일을 지정하세요!')
         return
      }

      console.log(`startDate: ${startDate}, endDate: ${endDate}`)

      // YYYY-MM-DD 포맷으로 변환
      setFormattedStartDate(dayjs(startDate).format('YYYY-MM-DD'))
      setFormattedEndDate(dayjs(endDate).format('YYYY-MM-DD'))

      setPage(1) // 날짜 검색 할때마다 페이지는 1로 초기화
   }

   // 주문 취소
   const handleCancelOrder = (id) => {
      const res = confirm('주문을 취소하시겠습니까?')
      if (res) {
         dispatch(cancelOrderThunk(id))
            .unwrap()
            .then(() => {
               setCancelComplete((prev) => !prev)
            })
            .catch((error) => {
               console.error('주문 취소 실패: ', error)
               alert('주문 취소 실패: ' + error)
            })
      }
   }

   //주문 삭제
   const handleDeleteOrder = (id) => {
      const res = confirm('주문을 삭제하시겠습니까?')
      if (res) {
         dispatch(deleteOrderThunk(id))
            .unwrap()
            .then(() => {
               setDeleteComplete((prev) => !prev)
            })
            .catch((error) => {
               console.error('주문 삭제 실패: ', error)
               alert('주문 삭제 실패: ' + error)
            })
      }
   }

   if (loading) {
      return null
   }

   if (error) {
      return (
         <Typography variant="body1" align="center" color="error" mt={2}>
            에러 발생: {error}
         </Typography>
      )
   }

   return (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
         <Box p={2}>
            {/* 날짜 검색 */}
            <Box
               sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  flexWrap: 'wrap', // 화면 크기에 따라 줄바꿈
                  mb: 7,
                  mt: 5,
               }}
            >
               <DatePicker label="시작일" value={startDate} onChange={(newValue) => setStartDate(newValue)} sx={{ width: '35%' }} />
               <DatePicker label="종료일" value={endDate} onChange={(newValue) => setEndDate(newValue)} sx={{ width: '35%' }} />
               <Button variant="contained" onClick={handleDateFilter}>
                  날짜 검색
               </Button>
            </Box>

            {/* 주문 리스트 출력 */}
            {orders.length > 0 ? (
               <Grid container spacing={2}>
                  {orders.map((order) => (
                     <Grid xs={12} key={order.id} sx={{ width: '100%' }}>
                        <Card sx={{ display: 'flex', mb: 2, position: 'relative' }}>
                           <CardMedia component="img" sx={{ height: 150, width: 170 }} image={`${import.meta.env.VITE_APP_API_URL}${order.Items.map((i) => i.Imgs.map((img) => img.imgUrl))}`} alt={order.Items.map((i) => i.itemNm)} />
                           <CardContent sx={{ flex: 1 }}>
                              <Typography variant="h6" gutterBottom>
                                 {order.Items.map((i) => i.itemNm)}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" gutterBottom>
                                 주문 날짜: {dayjs(order.orderDate).format('YYYY-MM-DD HH:mm:ss')}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" gutterBottom>
                                 총 주문 수량: {order.Items.map((i) => i.OrderItem.count)}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" gutterBottom>
                                 총 주문 금액: {order.Items.map((i) => formatWithComma(String(i.OrderItem.orderPrice)))}원
                              </Typography>
                           </CardContent>
                           {order.orderStatus === 'ORDER' ? (
                              <Button variant="contained" color="info" size="small" sx={{ position: 'absolute', top: 8, right: 8 }} onClick={() => handleCancelOrder(order.id)}>
                                 주문 취소
                              </Button>
                           ) : (
                              <Button variant="contained" color="error" size="small" sx={{ position: 'absolute', top: 8, right: 8 }} onClick={() => handleDeleteOrder(order.id)}>
                                 주문 삭제
                              </Button>
                           )}
                        </Card>
                     </Grid>
                  ))}
               </Grid>
            ) : (
               <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">주문 내역이 없습니다.</Typography>
               </Box>
            )}

            {/* 페이징 */}
            {pagination && (
               <Box display="flex" justifyContent="center" mt={2}>
                  <Pagination count={pagination.totalPages} page={page} onChange={(event, value) => setPage(value)} color="primary" />
               </Box>
            )}
         </Box>
      </LocalizationProvider>
   )
}

export default OrderList

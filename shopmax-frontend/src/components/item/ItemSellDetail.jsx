import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchItemByIdThunk } from '../../features/itemSlice'
import { Box, Typography, Button, Alert, CardMedia } from '@mui/material'
import LocalMallIcon from '@mui/icons-material/LocalMall'

import Grid from '@mui/material/Grid'

function ItemSellDetail() {
   const id = useParams()
   const dispatch = useDispatch()
   const { item, loading, error } = useSelector((state) => state.items)

   console.log('[🎄ItemSellDetail] item:', item)
   //상품 데이터 불러오기
   useEffect(() => {
      dispatch(fetchItemByIdThunk(id))
   }, [dispatch, id])
   return (
      <>
         {item && (
            <Box sx={{ padding: '20px' }}>
               {/* 위쪽 상세 */}
               <Grid
                  container
                  spacing={4}
                  sx={{ justifyContent: 'center', alignItems: 'center' }} // 추가된 스타일
               >
                  <Grid container spacing={10}>
                     {/* 왼쪽 이미지 */}
                     <Grid xs={12} md={6}>
                        <CardMedia component="img" image={``} alt={``} sx={{ width: '450px', borderRadius: '8px' }} />
                     </Grid>

                     {/* 오른쪽 상세 정보 */}
                     <Grid xs={12} md={6}>
                        <Typography variant="h4" gutterBottom>
                           <LocalMallIcon sx={{ color: '#ffab40', fontSize: '32px' }} />
                        </Typography>

                        <Typography variant="h6" gutterBottom></Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom></Typography>

                        {item.itemSellStatus === 'SOLD_OUT' ? (
                           <Alert severity="error">품절</Alert>
                        ) : (
                           <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
                              {' '}
                              <Typography variant="h6">총 가격: </Typography>
                              <Button variant="contained" color="primary">
                                 구매하기
                              </Button>
                           </Box>
                        )}
                     </Grid>
                  </Grid>
               </Grid>
               {/* 상세 이미지, 설명 */}
            </Box>
         )}
      </>
   )
}

export default ItemSellDetail

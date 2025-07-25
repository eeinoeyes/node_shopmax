import { Container, Typography } from '@mui/material'
import OrderList from '../components/my/OrderList'

function MyOrderListPage() {
   return (
      <Container maxWidth="sm" sx={{ marginTop: 10, marginBottom: 13 }}>
         <Typography variant="h4" align="center" gutterBottom>
            My 구매 리스트
         </Typography>
         <OrderList />
      </Container>
   )
}

export default MyOrderListPage

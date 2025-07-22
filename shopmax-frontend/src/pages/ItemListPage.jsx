import { Container, Typography } from '@mui/material'
import ItemList from '../components/item/ItemList'

function ItemListPage() {
   return (
      <Container maxWidth="lg" sx={{ marginTop: 10, marginBottom: 13 }}>
         <Typography variant="h4" align="center" gutterBottom>
            상품 등록 리스트
         </Typography>

         <ItemList />
      </Container>
   )
}

export default ItemListPage

import { Container } from '@mui/material'
import ItemCreateForm from '../components/item/ItemCreateForm'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { createItemThunk } from '../features/itemSlice'

function ItemCreatePage() {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   // 상품 등록
   const onCreateSubmit = (itemData) => {
      dispatch(createItemThunk(itemData))
         .unwrap()
         .then(() => navigate('/items/createlist'))
         .catch((error) => {
            console.error('상품 등록 에러:', error)
            alert('상품 등록에 실패했습니다. ' + error)
         })
   }
   return (
      <Container maxWidth="md" sx={{ marginTop: 10, marginBottom: 13 }}>
         <h1>상품 등록</h1>
         <ItemCreateForm onCreateSubmit={onCreateSubmit} />
      </Container>
   )
}

export default ItemCreatePage

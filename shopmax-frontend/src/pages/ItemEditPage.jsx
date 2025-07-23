import { Container } from '@mui/material'
import ItemEditForm from '../components/item/ItemEditForm'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { fetchItemByIdThunk, updateItemThunk } from '../features/itemSlice'

function ItemEditPage() {
   const location = useLocation()
   const { id } = useParams()
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { item } = useSelector((state) => state.items)

   useEffect(() => {
      dispatch(fetchItemByIdThunk(id))
         .unwrap()
         .then(() => {})
         .catch((error) => {
            console.error('상품을 불러오는 중 오류 발생: ', error)
            alert('상품을 불러오는 데 실패했습니다.' + error)

            navigate('/items/createlist')
         })
   }, [dispatch, id])

   //상품 수정
   const onEditSubmit = (itemData) => {
      dispatch(updateItemThunk({ id, itemData }))
         .unwrap()
         .then(() => {
            alert('수정이 완료되었습니다.')
            navigate('/items/createlist')
         })
         .catch((error) => {
            console.error('상품 수정 에러: ', error)
            alert('상품 수정 실패: ' + error)
         })
   }

   return (
      <Container maxWidth="md" sx={{ marginTop: 10, marginBottom: 13 }}>
         <h1>상품 수정</h1>
         {item && <ItemEditForm initialValues={item} key={location.key} onEditSubmit={onEditSubmit} />}
         {/* item이 존재할 때만 렌더링(없으면 에러 남) */}
      </Container>
   )
}

export default ItemEditPage

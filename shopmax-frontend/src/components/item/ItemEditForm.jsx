import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { useState } from 'react'
import { formatWithComma, stripComma } from '../../utils/priceSet'

//CreateForm이랑 똑같음! 주석은 Create 참고

function ItemEditForm({ initialValues, onEditSubmit }) {
   const [imgUrls, setImgUrls] = useState(initialValues.Imgs.map((img) => import.meta.env.VITE_APP_API_URL + img.imgUrl))
   const [imgFiles, setImgFiles] = useState([])
   const [itemNm, setItemNm] = useState(initialValues.itemNm)
   const [price, setPrice] = useState(String(initialValues.price)) // 콤마 붙일 때 replace 사용하기 때문에 문자열이어야 에러가 안 남
   const [stockNumber, setStockNumber] = useState(initialValues.stockNumber)
   const [itemSellStatus, setItemSellStatus] = useState(initialValues.itemSellStatus)
   const [itemDetail, setItemDetail] = useState(initialValues.itemDetail)

   // 이미지 미리보기
   const handleImageChange = (e) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      // 업로드된 파일 객체를 배열로 바꾸고 최대 5개까지만 선택
      const newFiles = Array.from(files).slice(0, 5)
      console.log(newFiles)

      // 선택된 새 파일로 이미지 객체 state 업데이트
      setImgFiles(newFiles)

      // 미리보기
      const newImgUrls = newFiles.map((file) => {
         const reader = new FileReader()
         reader.readAsDataURL(file)

         return new Promise((resolve) => {
            reader.onload = (event) => {
               resolve(event.target.result)
            }
         })
      })

      // 병렬처리
      Promise.all(newImgUrls).then((urls) => {
         setImgUrls(urls)
      })
   }

   // 상품 등록
   const handleSubmit = (e) => {
      e.preventDefault()

      if (!itemNm.trim()) {
         alert('상품명을 입력하세요!')
         return
      }

      if (!String(price).trim()) {
         alert('가격을 입력하세요!')
         return
      }

      if (!String(stockNumber).trim()) {
         alert('재고를 입력하세요.')
         return
      }

      const formData = new FormData()
      formData.append('itemNm', itemNm)
      formData.append('price', price)
      formData.append('stockNumber', stockNumber)
      formData.append('itemSellStatus', itemSellStatus)
      formData.append('itemDetail', itemDetail)

      // 이미지 파일 여러개 인코딩 처리(한글 파일명 깨짐 방지) 및 formData에 추가
      imgFiles.forEach((file) => {
         const encodedFile = new File([file], encodeURIComponent(file.name), { type: file.type })
         formData.append('img', encodedFile)
      })

      // 상품등록 함수 실행
      onEditSubmit(formData)
   }

   // 가격에서 콤마 제거 / 숫자가 아닌 값을 거른 후 => price state에 저장
   const handlePriceChange = (e) => {
      const rawValue = e.target.value
      const numericValue = stripComma(rawValue)

      // 숫자가 아닌 값이 입력되면 리턴(유효성 체크)
      const isNumric = /^\d*$/
      if (!isNumric.test(numericValue)) return
      setPrice(numericValue)
   }

   // 재고입력시 숫자만 입력하도록
   const handleStockChange = (e) => {
      const rawValue = e.target.value

      // 숫자가 아닌 값이 입력되면 리턴(유효성 체크)
      const isNumric = /^\d*$/
      if (!isNumric.test(rawValue)) return

      setStockNumber(rawValue)
   }

   return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} encType="multipart/form-data">
         {/* 이미지 업로드 필드 */}
         <Button variant="contained" component="label">
            이미지 업로드 (최대 5개)
            <input type="file" name="img" accept="image/*" hidden multiple onChange={handleImageChange} />
         </Button>

         {/* 업로드된 이미지 미리보기 */}
         <Box
            display="flex"
            flexWrap="wrap"
            gap={2}
            mt={2}
            sx={{
               justifyContent: 'flex-start',
            }}
         >
            {imgUrls.map((url, index) => (
               <Box
                  key={index}
                  sx={{
                     width: '120px',
                     height: '120px',
                     border: '1px solid #ccc',
                     borderRadius: '8px',
                     overflow: 'hidden',
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                  }}
               >
                  <img src={url} alt={`업로드 이미지 ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </Box>
            ))}
         </Box>

         {/* 상품명 입력 필드 */}
         <TextField label="상품명" variant="outlined" fullWidth value={itemNm} onChange={(e) => setItemNm(e.target.value)} placeholder="상품명" sx={{ mt: 2 }} inputProps={{ maxLength: 15 }} />

         {/* 가격 입력 필드 */}
         {/* input type='text'에 입력한 텍스트는 숫자여도 JS에서는 문자로 인식한다 */}
         <TextField
            label="가격"
            variant="outlined"
            fullWidth
            value={formatWithComma(price)} // 콤마 추가된 값 표시
            onChange={handlePriceChange} // 입력 핸들러
            placeholder="가격"
            sx={{ mt: 2 }}
            inputProps={{ maxLength: 10 }}
         />

         {/* 재고 입력 필드 */}
         <TextField label="재고수량" variant="outlined" fullWidth value={stockNumber} onChange={handleStockChange} placeholder="재고수량" sx={{ mt: 2 }} inputProps={{ maxLength: 10 }} />

         {/* 판매 상태 선택 필드 */}
         <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="item-sell-status-label">판매 상태</InputLabel>
            <Select labelId="item-sell-status-label" label="판매상태" value={itemSellStatus} onChange={(e) => setItemSellStatus(e.target.value)}>
               {/* value는 실제 items 테이블의 itemSellStatus 컬럼에 저장될 값 */}
               <MenuItem value="SELL">판매중</MenuItem>
               <MenuItem value="SOLD_OUT">품절</MenuItem>
            </Select>
         </FormControl>

         {/* 상품설명 입력 필드 */}
         <TextField label="상품설명" variant="outlined" fullWidth multiline rows={4} value={itemDetail} onChange={(e) => setItemDetail(e.target.value)} sx={{ mt: 2 }} />

         {/* 등록 버튼 */}
         <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            수정하기
         </Button>
      </Box>
   )
}

export default ItemEditForm

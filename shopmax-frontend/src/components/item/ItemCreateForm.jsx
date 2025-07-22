import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { useState } from 'react'
import { formatWithComma, stripComma } from '../../utils/priceSet'

function ItemCreateForm({ onCreateSubmit }) {
   const [imgUrls, setImgUrls] = useState([]) // 이미지 경로(여러개 저장)
   const [imgFiles, setImgFiles] = useState([]) // 이미지 파일 객체(여러개 저장)
   const [itemNm, setItemNm] = useState('') // 상품명
   const [price, setPrice] = useState('') // 가격
   const [stockNumber, setStockNumber] = useState('') // 재고
   const [itemSellStatus, setItemSellStatus] = useState('SELL') // 판매상태
   const [itemDetail, setItemDetail] = useState('') // 상품설명

   // 이미지 미리보기
   const handleImageChange = (e) => {
      const files = e.target.files // 업로드된 모든 파일 객체 가져오기
      if (!files || files.length === 0) return // 파일이 없거나 파일길이가 0이면 함수 종료

      // 업로드된 파일 객체를 배열로 바꾸고 최대 5개까지만 선택
      const newFiles = Array.from(files).slice(0, 5)
      console.log(newFiles)

      // 선택된 새 파일로 이미지 객체 state 업데이트
      setImgFiles(newFiles)

      // 미리보기
      // newImgUrls = [ new Promise(),  new Promise(), new Promise()]
      const newImgUrls = newFiles.map((file) => {
         const reader = new FileReader()
         reader.readAsDataURL(file) // 파일 데이터 읽기

         // promise 객체를 리턴하여 비동기적으로 FileReader 작업(속도가 빠름)
         return new Promise((resolve) => {
            // 파일 읽기가 완료 되었을때 결과를 promise에 전달
            // event.target.result: base64로 인코딩된 이미지 url
            reader.onload = (event) => {
               resolve(event.target.result)
            }
         })
      })

      // 병렬처리
      Promise.all(newImgUrls).then((urls) => {
         // 생성된 새 미리보기 URL로 상태 업데이트
         setImgUrls(urls)
      })
   }

   // 상품 등록
   const handleSubmit = (e) => {
      e.preventDefault()

      // 나중에 테이블에 insert 될때를 컬럼의 데이터 타입, 제약조건등을 고려해 사용자가 올바른 값을 입력하도록 해야한다

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

      if (imgFiles.length === 0) {
         alert('이미지 최소 1개 이상 업로드 하세요.')
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
      onCreateSubmit(formData)
   }

   // 가격에서 콤마 제거 / 숫자가 아닌 값을 거른 후 => price state에 저장
   const handlePriceChange = (e) => {
      const rawValue = e.target.value // 입력된 가격 20,000
      const numericValue = stripComma(rawValue) // 콤마 제거 20000

      // 숫자가 아닌 값이 입력되면 리턴(유효성 체크)
      const isNumric = /^\d*$/
      if (!isNumric.test(numericValue)) return

      // price 컬럼 타입은 int(정수형)이므로 콤마가 붙은 값은 insert할 수 X
      // 따라서 price state값은 콤마를 제거해 저장한다
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
            등록하기
         </Button>
      </Box>
   )
}

export default ItemCreateForm

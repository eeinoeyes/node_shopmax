import { useDispatch, useSelector } from 'react-redux'

import { TextField, Button, Container, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { getTokenThunk, readTokenThunk } from '../../features/tokenSlice'
import { useEffect } from 'react'

function Token() {
   const dispatch = useDispatch()
   const { token, error } = useSelector((state) => state.token)

   // 렌더링 후 토큰값이 있다면 읽어옴
   useEffect(() => {
      dispatch(readTokenThunk())
   }, [dispatch])

   const handleToken = () => {
      dispatch(getTokenThunk())
   }

   // 읽기 전용으로 만들기
   // https://mui.com/material-ui/customization/how-to-customize/#state-classes
   const StyledTextField = styled(TextField)(() => ({
      '& .Mui-readOnly': {
         backgroundColor: '#f5f5f5', // 읽기 전용 상태의 배경색
         cursor: 'not-allowed', // 비활성화된 커서
      },
   }))

   return (
      <Container maxWidth="sm">
         <Typography variant="h4" gutterBottom>
            API Key 발급받기
         </Typography>

         {error && (
            <Typography color="error" align="center">
               {error}
            </Typography>
         )}

         <Button variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }} onClick={handleToken}>
            API key 발급받기
         </Button>

         <StyledTextField sx={{ width: '100%' }} value={token || ''}></StyledTextField>
      </Container>
   )
}

export default Token

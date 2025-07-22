import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUserThunk } from '../../features/authSlice'

function Login() {
   const [email, setEmail] = useState('') // 이메일 상태
   const [password, setPassword] = useState('') // 비밀번호 상태
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { loading, error } = useSelector((state) => state.auth)

   const handleLogin = (e) => {
      e.preventDefault()

      // 이메일과 패스워드가 둘다 공백이 아니라면
      if (email.trim() && password.trim()) {
         dispatch(loginUserThunk({ email, password }))
            .unwrap()
            .then(() => {
               //로그인 성공시 메인페이지로 이동
               navigate('/')
            })
            .catch((error) => console.error('로그인 실패:', error)) //로그인 실패시 에러 출력
      } else {
         alert('이메일과 패스워드를 입력해주세요!')
         return
      }
   }

   return (
      <Container maxWidth="sm">
         <Typography variant="h4" gutterBottom>
            로그인
         </Typography>

         {error && (
            <Typography color="error" align="center">
               {error}
            </Typography>
         )}

         <form onSubmit={handleLogin}>
            <TextField label="이메일" name="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />

            <TextField label="비밀번호" type="password" name="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading} sx={{ position: 'relative', marginTop: '20px' }}>
               {loading ? (
                  <CircularProgress
                     size={24}
                     sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                     }}
                  />
               ) : (
                  '로그인'
               )}
            </Button>
         </form>

         <p>
            계정이 없으신가요? <Link to="/signup">회원가입</Link>
         </p>
      </Container>
   )
}

export default Login

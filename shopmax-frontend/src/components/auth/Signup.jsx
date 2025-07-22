import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUserThunk } from '../../features/authSlice'
import { useNavigate } from 'react-router-dom'

function Signup() {
   const [email, setEmail] = useState('')
   const [name, setName] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [address, setAddress] = useState('')
   const [isSignupComplete, setIsSignupComplete] = useState(false) // 회원가입 완료 상태

   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { loading, error } = useSelector((state) => state.auth)

   const validateEmail = (email) => {
      // 이메일 형식 체크
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email) // 유효성 체크의 결과를 true, false로 리턴
   }

   const validatePassword = (password) => {
      // 비밀번호가 8자리 이상이고, 영문자와 특수문자를 포함
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
      return passwordRegex.test(password)
   }

   const handleSignup = () => {
      if (!email.trim() || !name.trim() || !address.trim() || !password.trim() || !confirmPassword.trim()) {
         alert('모든 필드를 입력해주세요!')
         return
      }

      if (!validateEmail(email)) {
         alert('유효한 이메일 주소를 입력해주세요!')
         return
      }

      if (!validatePassword(password) || !validatePassword(confirmPassword)) {
         alert('비밀번호는 8자리 이상이고, 영문자와 특수문자를 포함해야 합니다!')
         return
      }

      if (password !== confirmPassword) {
         alert('비밀번호가 일치하지 않습니다!')
         return
      }

      dispatch(registerUserThunk({ email, name, address, password }))
         .unwrap()
         .then(() => {
            //회원가입 성공시
            setIsSignupComplete(true) //회원가입 완료 상태 true로 변경
         })
         .catch((error) => {
            //회원가입 중 에러 발생시
            console.error('회원가입 에러:', error)
         })
   }

   //회원가입이 완료 되었을때 보일 컴포넌트
   if (isSignupComplete) {
      return (
         <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom align="center">
               회원가입이 완료되었습니다!
            </Typography>
            <Typography variant="body1" align="center" style={{ marginTop: '20px' }}>
               로그인 페이지로 이동하거나 다른 작업을 계속 진행할 수 있습니다.
            </Typography>
            <Button
               variant="contained"
               color="primary"
               fullWidth
               style={{ marginTop: '20px' }}
               onClick={() => navigate('/login')} // 로그인 페이지로 이동
            >
               로그인 하러 가기
            </Button>
         </Container>
      )
   }

   return (
      <Container maxWidth="sm">
         <Typography variant="h4" gutterBottom>
            회원가입
         </Typography>

         {error && (
            <Typography color="error" align="center">
               {error}
            </Typography>
         )}

         <TextField label="이메일" variant="outlined" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@example.com" inputProps={{ maxLength: 250 }} />

         <TextField label="사용자 이름" variant="outlined" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} inputProps={{ maxLength: 80 }} />

         <TextField label="주소" variant="outlined" type="text" fullWidth margin="normal" value={address} onChange={(e) => setAddress(e.target.value)} inputProps={{ maxLength: 80 }} />

         <TextField label="비밀번호" variant="outlined" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8자리 이상이고, 영문자와 특수문자를 포함" inputProps={{ maxLength: 250 }} />

         <TextField label="비밀번호 확인" variant="outlined" type="password" fullWidth margin="normal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="8자리 이상이고, 영문자와 특수문자를 포함" inputProps={{ maxLength: 250 }} />

         <Button variant="contained" color="primary" onClick={handleSignup} fullWidth disabled={loading} style={{ marginTop: '20px' }}>
            {loading ? <CircularProgress size={24} /> : '회원가입'}
         </Button>
      </Container>
   )
}

export default Signup

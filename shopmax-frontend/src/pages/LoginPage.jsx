import Login from '../components/auth/Login'
import { Container } from '@mui/material'

function LoginPage() {
   return (
      <Container maxWidth="md" sx={{ marginTop: 10, marginBottom: 13 }}>
         <Login />
      </Container>
   )
}

export default LoginPage

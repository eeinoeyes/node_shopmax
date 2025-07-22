import { Container, Typography } from '@mui/material'
import LoyaltyIcon from '@mui/icons-material/Loyalty'

function Home() {
   return (
      <Container
         maxWidth="lg"
         sx={{
            marginTop: 10, // 1 = 8px, 혹은 mt: 10
            marginBottom: 13,
         }}
      >
         <Typography variant="h4" align="center" gutterBottom>
            <LoyaltyIcon sx={{ color: '#e91e63', fontSize: 35, mt: 10 }} />
            HOT SALE!
         </Typography>
      </Container>
   )
}

export default Home

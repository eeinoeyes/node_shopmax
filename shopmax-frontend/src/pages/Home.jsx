import { Container, Typography } from '@mui/material'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import SearchBar from '../components/shared/SearchBar'
import ItemSellList from '../components/item/ItemSellList'
import { useState } from 'react'

function Home() {
   const [searchTerm, setSearchTerm] = useState('')
   const onSearch = (search) => {
      setSearchTerm(search)
   }
   return (
      <Container
         maxWidth="lg"
         sx={{
            marginTop: 10, // 1 = 8px, 혹은 mt: 10
            marginBottom: 13,
         }}
      >
         <SearchBar onSearch={onSearch} />
         <Typography variant="h4" align="center" gutterBottom>
            <LoyaltyIcon sx={{ color: '#e91e63', fontSize: 35, mt: 10 }} />
            HOT SALE!
         </Typography>
         <ItemSellList searchTerm={searchTerm} />
      </Container>
   )
}

export default Home

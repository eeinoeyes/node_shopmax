import { TextField, IconButton, Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'
function SearchBar({ onSearch }) {
   const [searchTerm, setSearchTerm] = useState('')

   const handleInputChange = (e) => {
      setSearchTerm(e.target.value)
   }

   const handleSearch = (e) => {
      e.preventDefault()
      //onSearch가 존재하고 searchTerm이 빈 문자열이 아닌 경우
      if (onSearch && searchTerm.trim()) {
         onSearch(searchTerm.trim())
      }
   }
   return (
      <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center', width: '80%', margin: '0 auto' }}>
         <TextField variant="outlined" fullWidth placeholder="상품을 검색하세요." value={searchTerm} onChange={handleInputChange} sx={{ marginRight: 1 }} />
         <IconButton color="primary" type="submit">
            <SearchIcon />
         </IconButton>
      </Box>
   )
}

export default SearchBar

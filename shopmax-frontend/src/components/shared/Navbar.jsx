import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
// import { Link as MUILink } from '@mui/material'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket'
// https://mui.com/material-ui/react-app-bar/#app-bar-with-responsive-menu

import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { logoutUserThunk } from '../../features/authSlice'

function Navbar({ isAuthenticated, user }) {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [anchorElNav, setAnchorElNav] = useState(null)
   const [anchorElUser, setAnchorElUser] = useState(null)

   const handleLogout = () => {
      dispatch(logoutUserThunk())
         .unwrap()
         .then(() => {
            navigate('/') // 로그아웃시 홈으로 이동
         })
         .catch((error) => {
            alert('로그아웃 실패: ' + error)
         })
   }

   const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget)
   }
   const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget)
   }

   const handleCloseNavMenu = () => {
      setAnchorElNav(null)
   }

   const handleCloseUserMenu = () => {
      setAnchorElUser(null)
   }

   return (
      <AppBar position="fixed" sx={{ backgroundColor: '#fff', color: '#000' }}>
         <Container maxWidth="xl">
            <Toolbar disableGutters>
               {/* 모바일 메뉴 */}
               <ShoppingBasketIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
               <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="/"
                  sx={{
                     mr: 2,
                     display: { xs: 'none', md: 'flex' },
                     fontFamily: 'monospace',
                     fontWeight: 700,
                     letterSpacing: '.3rem',
                     color: 'inherit',
                     textDecoration: 'none',
                  }}
               >
                  SHOPMAX
               </Typography>
               <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                  <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                     <MenuIcon />
                  </IconButton>
                  <Menu
                     id="menu-appbar"
                     anchorEl={anchorElNav}
                     anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                     }}
                     keepMounted
                     transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                     }}
                     open={Boolean(anchorElNav)}
                     onClose={handleCloseNavMenu}
                     sx={{ display: { xs: 'block', md: 'none' } }}
                  >
                     <MenuItem>
                        <Link to="/items/createlist" style={{ color: 'black', textDecoration: 'none' }}>
                           <Typography sx={{ textAlign: 'center' }}>상품등록</Typography>
                        </Link>
                     </MenuItem>
                     <MenuItem>
                        <Typography sx={{ textAlign: 'center' }}>상품구매</Typography>
                     </MenuItem>
                     <MenuItem>
                        <Typography sx={{ textAlign: 'center' }}>고객문의</Typography>
                     </MenuItem>
                  </Menu>
               </Box>

               {/* PC 메뉴 */}
               <ShoppingBasketIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
               <Typography
                  variant="h5"
                  noWrap
                  component="a"
                  href="/"
                  sx={{
                     mr: 2,
                     display: { xs: 'flex', md: 'none' },
                     flexGrow: 1,
                     fontFamily: 'monospace',
                     fontWeight: 700,
                     letterSpacing: '.3rem',
                     color: 'inherit',
                     textDecoration: 'none',
                  }}
               >
                  SHOPMAX
               </Typography>
               <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  <MenuItem>
                     <Link to="/items/createlist" style={{ color: 'black', textDecoration: 'none' }}>
                        <Typography sx={{ textAlign: 'center' }}>상품등록</Typography>
                     </Link>
                  </MenuItem>
                  <MenuItem>
                     <Typography sx={{ textAlign: 'center' }}>상품구매</Typography>
                  </MenuItem>
                  <MenuItem>
                     <Typography sx={{ textAlign: 'center' }}>고객문의</Typography>
                  </MenuItem>
               </Box>

               {/* 내 프로필 */}
               {isAuthenticated ? (
                  <Box sx={{ flexGrow: 0 }}>
                     <Typography variant="span" style={{ marginRight: '20px', color: '#000', fontSize: 14 }}>
                        {/* ?(optional chaining): 값이 undefined 이거나 null일때 에러를 반환하지 않고 그냥 undefined를 반환 */}
                        {user?.name} 님
                     </Typography>
                     <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                           <Avatar alt={user?.name} src="/person.png" />
                        </IconButton>
                     </Tooltip>
                     <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                           vertical: 'top',
                           horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                           vertical: 'top',
                           horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                     >
                        <MenuItem>
                           <Link to="/myorderlist" style={{ color: 'black', textDecoration: 'none' }}>
                              <Typography sx={{ textAlign: 'center' }}>주문내역</Typography>
                           </Link>
                        </MenuItem>
                        <MenuItem>
                           <Typography sx={{ textAlign: 'center' }}>장바구니</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                           <Typography sx={{ textAlign: 'center' }}>로그아웃</Typography>
                        </MenuItem>
                        <MenuItem>
                           <Link to="/chat" style={{ color: 'black', textDecoration: 'none' }}>
                              <Typography sx={{ textAlign: 'center' }}>1:1 채팅 문의</Typography>
                           </Link>
                        </MenuItem>
                     </Menu>
                  </Box>
               ) : (
                  <Link to="/login">
                     <Button variant="contained">로그인</Button>
                  </Link>
               )}
            </Toolbar>
         </Container>
      </AppBar>
   )
}

export default Navbar

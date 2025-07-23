import './styles/common.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import Navbar from './components/shared/Navbar'
import Footer from './components/shared/Footer'
import Home from './pages/Home'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ItemCreatePage from './pages/ItemCreatePage'

import { checkAuthStatusThunk } from './features/authSlice'
import ItemListPage from './pages/ItemListPage'
import ItemEditPage from './pages/ItemEditPage'
import ItemSellDetailPage from './pages/ItemSellDetailPage'

function App() {
   const dispatch = useDispatch()
   const { isAuthenticated, user } = useSelector((state) => state.auth) //로그인 상태, 로그인 한 사용자 정보
   const location = useLocation()

   // 새로고침시 지속적인 로그인 상태 확인을 위해 사용
   useEffect(() => {
      dispatch(checkAuthStatusThunk())
   }, [dispatch])

   return (
      <>
         <Navbar isAuthenticated={isAuthenticated} user={user} />
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* 상품 리스트 
            key값으로 location.key 부여하면 페이지 이동시 자동 언마운트, 재 마운트 이루어짐 */}
            <Route path="/items/createlist" element={<ItemListPage key={location.key} />} />

            {/* 상품등록 */}
            <Route path="/items/create" element={<ItemCreatePage />} />

            {/* 상품 수정 */}
            <Route path="/items/edit/:id" element={<ItemEditPage />} />
            <Route path="/items/detail/:id" element={<ItemSellDetailPage />} />
         </Routes>
         <Footer />
      </>
   )
}

export default App

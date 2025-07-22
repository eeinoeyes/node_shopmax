// mui 에서 제공하는 Link 컴포넌트는 전체 페이지를 새로고침해 링크를 이동시킨다
// router에서 제공하는 Link 컴포넌트를 주로 사용하기를 추천(SPA방식)
import { Box, Typography, Link, Container } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'

function Footer() {
   return (
      <Box
         component="footer"
         sx={{
            backgroundColor: '#F2F2F2',
            color: '#000',
            borderTop: '1px solid #D8D8D8',
            py: 4,
         }}
      >
         <Container maxWidth="lg">
            {/* Footer 컨테이너 */}
            <Box
               sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  gap: 4,
               }}
            >
               {/* 회사 정보 섹션 */}
               <Box>
                  <Typography variant="h6" gutterBottom>
                     회사 정보
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>
                     SHOPMAX
                  </Typography>
                  <Typography variant="body2">서울특별시 강남구 XXX로 XXX</Typography>
                  <Typography variant="body2">고객센터: 02)3425-1929</Typography>
               </Box>

               {/* 고객 지원 섹션 */}
               <Box>
                  <Typography variant="h6" gutterBottom>
                     고객 지원
                  </Typography>
                  <Box>
                     <Link href="/" underline="none" color="inherit">
                        도움말 센터
                     </Link>
                  </Box>
                  <Box>
                     <Link href="/" underline="none" color="inherit">
                        배송 정보
                     </Link>
                  </Box>
                  <Box>
                     <Link href="/" underline="none" color="inherit">
                        교환 및 환불
                     </Link>
                  </Box>
                  <Box>
                     <Link href="/" underline="none" color="inherit">
                        문의하기
                     </Link>
                  </Box>
               </Box>

               {/* 소셜 미디어 섹션 */}
               <Box>
                  <Typography variant="h6" gutterBottom>
                     소셜 미디어
                  </Typography>
                  <Box>
                     <Link href="https://facebook.com" target="_blank" underline="none" color="inherit">
                        <FacebookIcon color="action" />
                        Facebook
                     </Link>
                  </Box>
                  <Box>
                     <Link href="https://instagram.com" target="_blank" underline="none" color="inherit">
                        <InstagramIcon />
                        Instagram
                     </Link>
                  </Box>
                  <Box>
                     <Link href="https://twitter.com" target="_blank" underline="none" color="inherit">
                        <TwitterIcon color="primary" />
                        Twitter
                     </Link>
                  </Box>
               </Box>
            </Box>

            {/* Footer 하단 */}
            <Box
               mt={4}
               textAlign="center"
               sx={{
                  borderTop: '1px solid #D8D8D8',
                  pt: 2,
               }}
            >
               <Typography variant="body2">© 2024 SHOPMAX. All rights reserved.</Typography>
            </Box>
         </Container>
      </Box>
   )
}

export default Footer

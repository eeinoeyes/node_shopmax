import shopmaxApi from './axiosApi'

//회원가입
export const registerUser = async (userData) => {
   try {
      const response = await shopmaxApi.post('/auth/join', userData)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error // registerUser() 함수를 실행 한 곳으로 에러메세지를 던짐
   }
}

//로그인
export const loginUser = async (credentials) => {
   try {
      const response = await shopmaxApi.post('/auth/login', credentials)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//로그아웃
export const logoutUser = async () => {
   try {
      const response = await shopmaxApi.get('/auth/logout')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//로그인 상태 확인
export const checkAuthStatus = async () => {
   try {
      const response = await shopmaxApi.get('/auth/status')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

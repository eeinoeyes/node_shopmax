import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL

//axios 인스턴스 생성
const shopmaxApi = axios.create({
   baseURL: BASE_URL,
   headers: {
      'Content-Type': 'application/json',
   },
   withCredentials: true, // 세션 쿠키를 요청에 포함
})

export default shopmaxApi

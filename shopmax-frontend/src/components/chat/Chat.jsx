import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { TextField, Button, Box } from '@mui/material'

// 소켓 서버와 연결
const socket = io(import.meta.env.VITE_APP_API_URL, {
   withCredentials: true, // 소켓에서 세션을 사용하므로 쿠키를 포함해서 세션 유지
})

function Chat() {
   const [messages, setMessages] = useState([]) // 소켓 서버에서 전달받은 채팅 메세지
   const [input, setInput] = useState('') // 입력 메세지
   const [user, setUser] = useState(null) // 소켓 서버에서 전달받은 사용자의 정보
   const messagesContainerRef = useRef(null) // 메시지 컨테이너 스크롤이 항상 아래로 가도록 하기 위한 ref

   useEffect(() => {
      // 소켓서버에서 사용자 정보를 얻기위해 메세지 전송
      socket.emit('user info', 'requestUserInfo')

      // 서버에서 사용자 정보 가져오기
      socket.on('user info', (userInfo) => {
         console.log('[💥Chat.jsx] userInfo: ', userInfo)
         setUser(userInfo)
      })

      //서버에서 메시지 수신
      socket.on('chat message', (msg) => {
         console.log('[💥Chat.jsx] msg:', msg)
         setMessages((prevMessages) => [...prevMessages, msg])
      })

      // 컴포넌트 언마운트 시 이벤트 제거
      return () => {
         socket.off('user info')
      }
   }, [])

   useEffect(() => {
      // 스크롤을 메시지 컨테이너의 가장 아래로 이동
      if (messagesContainerRef.current) {
         messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      }
   }, [messages])

   const sendMessage = () => {
      if (!input.trim()) return // 입력값이 빈 문자열이면 리턴

      // 소켓 서버로 메시지 전송
      socket.emit('chat message', input)
      setInput('')
   }

   const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
         e.preventDefault() // 기본 엔터키 동작 방지(줄바꿈)
         sendMessage() // 메시지 전송
      }
   }

   return (
      <Box
         sx={{
            width: 400,
            margin: '0 auto',
            border: '1px solid #ccc',
            borderRadius: 2,
            padding: 2,
         }}
      >
         <h2>채팅</h2>
         <Box
            ref={messagesContainerRef}
            sx={{
               height: 300,
               overflowY: 'auto',
               border: '1px solid #ccc',
               borderRadius: 1,
               padding: 1,
               marginBottom: 2,
            }}
         >
            {messages.map((msg, index) => {
               // user: 소켓에서 전달받은 로그인 된 사용자 정보
               // msg: 메시지 객체
               const isOwnMessage = msg.user === user?.name
               return (
                  <Box
                     sx={{
                        display: 'flex',
                        marginBottom: 1,
                        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                     }}
                     key={index}
                  >
                     <Box
                        sx={{
                           backgroundColor: isOwnMessage ? '#dcf8c6' : '#f1f1f1',
                           padding: '8px 15px',
                           borderRadius: 2,
                           maxWidth: '80%',
                        }}
                     >
                        <strong>{msg.user || '알 수 없음'}: </strong>
                        {msg.message}
                     </Box>
                  </Box>
               )
            })}
         </Box>
         <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
               fullWidth
               variant="outlined"
               placeholder="메시지를 입력하세요"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={handleKeyDown}
               sx={{
                  marginRight: 1,
                  '& .MuiInputBase-input': {
                     padding: '8px', // 원하는 패딩 값
                  },
               }}
            />
            <Button variant="contained" color="primary" sx={{ flexShrink: 0 }} onClick={sendMessage}>
               전송
            </Button>
         </Box>
      </Box>
   )
}

export default Chat

const { Server } = require('socket.io')
const passport = require('passport')

module.exports = (server, sessionMiddleware) => {
   // Socket.IO 서버 생성
   const io = new Server(server, {
      // 소켓에서 별도의 cors 설정: Socket.IO와 Express의 cors 설정 방식이 다르기 때문에
      cors: {
         origin: process.env.FRONTEND_APP_URL, // 클라이언트 허용 url
         methods: ['GET', 'POST'], // 허용된 http 메서드, 다른 메서드(put, patch, delete)는 차단
         // 클라이언트가 delete 요청을 보내 데이터가 삭제되는 등의 상황을 방지
         credentials: true, // 세션 사용을 위해 인증 정보(쿠키 등) 을 허용
      },
   })

   //소켓의 연결(connection)이 발생하기 직전에 실행되는 미들웨어
   io.use((socket, next) => {
      //express의 세션미들웨어를 Socket.IO에서 사용할 수 있도록 설정
      sessionMiddleware(socket.request, {}, next)
   })

   //소켓의 연결(connection)이 발생하기 직전에 실행되는 미들웨어
   io.use((socket, next) => {
      //passport의 역직렬화 호출을 통해 사용자 정보를 소켓에서 사용할 수 있도록 설정
      //socket.request.session?.passport?.user에 저장된 유저 id 확인
      if (socket.request.session?.passport?.user) {
         //passport 역직렬화 호출
         passport.deserializeUser(socket.request.session.passport.user, (err, user) => {
            if (err) return next(err) // 에러가 존재할 경우 에러 미들웨어로 전송
            socket.request.user = user // 역직렬화된 사용자 정보를 socket request 객체에 저장
            next() // 다음 미들웨어로 넘어감
         })
      } else {
         //로그인 안 된 상태에서 소켓에 접속할 경우 강제 연결 해제
         console.log('비인증 사용자 연결 시도')
         return socket.disconnect() // 인증되지 않은 사용자 소켓 연결 해제
      }
   })

   // 소켓 연결
   io.on('connection', (socket) => {
      const user = socket.request.user
      console.log('💫사용자 연결됨:', user.name)

      // 클라이언트에서 user info 이벤트 요청시 요청을 보낸 클라이언트에게 사용자 정보를 전송
      socket.on('user info', (msg) => {
         if (msg) {
            socket.emit('user info', user) // 요청 보낸 클라이언트에게 사용자 정보 전송

            //socket.emit: 요청을 보낸 클라이언트에게만 응답 (1:1)
         }
      })
      // 클라이언트에서 chat message 이벤트 요청시 사용자 정보를 모든 클라이언트에게 전송
      socket.on('chat message', (msg) => {
         io.emit('chat message', { user: user?.name, message: msg }) // 모든 클라이언트에게 메시지 전송

         //io.emit: 모든 연결된 클라이언트에 응답 (전체방송broadcast 개념)
      })
      //★TIP: 특정 방 안 사람들에게만 메시지하는 법도 있다!: socket.to(room).emit()

      // 클라이언트가 연결 요해제 요청시 소켓과의 연결 해제
      socket.on('disconnect', () => {
         console.log('사용자 연결 해제:', user?.name)
         return socket.disconnect()
      })
   })
   return io
}

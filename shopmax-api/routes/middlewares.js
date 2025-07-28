const jwt = require('jsonwebtoken')

// 로그인 상태 확인 미들웨어: 사용자가 로그인된 상태인지 확인
exports.isLoggedIn = (req, res, next) => {
   if (req.isAuthenticated()) {
      next() // 로그인이 됐으면 다음 미들웨어로 이동
   } else {
      // 로그인이 되지 않았을경우 에러 미들웨어로 에러 전송
      const error = new Error('로그인이 필요합니다.')
      error.status = 403
      return next(error)
   }
}

// 비로그인 상태 확인 미들웨어: 사용자가 로그인 안된 상태인지 확인
exports.isNotLoggedIn = (req, res, next) => {
   if (!req.isAuthenticated()) {
      // 로그인이 되지 않았을 경우 다음 미들웨어로 이동
      next()
   } else {
      // 로그인이 된 경우 에러 미들웨어로 에러 전송
      const error = new Error('이미 로그인이 된 상태입니다.')
      error.status = 400
      return next(error)
   }
}

//관리자 권한 확인 미들웨어
exports.isAdmin = (req, res, next) => {
   if (req.isAuthenticated()) {
      if (req.user && req.user.role === 'ADMIN') {
         next() //user 정보가 존재하며 role이 ADMIN인 경우 다음 미들웨어로 이동
      } else {
         const error = new Error('관리자 권한이 필요합니다.')
         error.status = 403
         return next(error)
      }
   } else {
      const error = new Error('로그인이 필요합니다.')
      error.status = 403
      return next(error)
   }
}

// 토큰 유효성 확인
exports.verifyToken = (req, res, next) => {
   try {
      // 프론트에서 전달한 토큰
      console.log('req.headers.authorization:', req.headers.authorization)

      // 토큰 검증
      req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)

      return next()
   } catch (error) {
      // 토큰 유효기간 초과
      if (error.name === 'TokenExpiredError') {
         const err = new Error('토큰이 만료되었습니다.')
         err.status = 419
         return next(err)
      }

      error.status = 401
      error.message = '유효하지 않은 토큰입니다.'
      return next(error)
   }
}

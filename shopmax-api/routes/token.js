const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const { Domain } = require('../models')
const { isLoggedIn, isAdmin } = require('./middlewares')

//토큰 발급 localhost:8000/token/get
router.get('/get', isLoggedIn, async (req, res, next) => {
   try {
      const origin = req.get('origin') // http, https를 포함한 도메인 주소를 가져온다

      //jwt토큰 생성
      const token = jwt.sign(
         // 기본로직 jwt.sign(payload, secretOrPrivateKey, [options, callback])
         {
            //토큰에 포함할 사용자 정보 입력
            id: req.user.id,
            email: req.user.email,
         },
         process.env.JWT_SECRET, // 토큰 서명에 사용할 암호화 키
         {
            expiresIn: '365d', // 토큰 만료 시간 설정 (예: '30m' = 30분, '1d' = 1일)
            issuer: 'shopmaxadmin', // 토큰 발급자 정보 설정 (예: 어플리케이션 이름 등)
         }
      )
      await Domain.create({
         userId: req.user.id,
         host: origin,
         clientToken: token,
      })

      res.json({
         success: true,
         message: '토큰 발급이 완료되었습니다.',
         token,
      })
   } catch (error) {
      error.status = 500
      error.message = '토큰 발급 중 오류가 발생했습니다.'
      return next(error)
   }
})

//DB에 저장된 토큰 가져오기
router.get('/read', isAdmin, async (req, res, next) => {
   try {
      const origin = req.get('origin')
      const userId = req.user.id

      const domainData = await Domain.findOne({ where: { userId, host: origin } })
      if (!domainData) {
         const error = new Error('토큰을 찾을 수 없습니다.')
         error.status = 404
         return next(error)
      }

      res.json({
         success: true,
         message: '토큰을 성공적으로 불러왔습니다.',
         token: domainData.clientToken,
      })
   } catch (error) {
      error.status = 500
      error.message = '토큰을 불러오는 중 오류가 발생했습니다.'
      return next(error)
   }
})

module.exports = router

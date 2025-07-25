const express = require('express')
const router = express.Router()
const { sequelize } = require('../models')
const { Order, Item, User, OrderItem, Img } = require('../models')
const { isLoggedIn } = require('./middlewares')
const { Op } = require('sequelize')

//주문
router.post('/', isLoggedIn, async (req, res, next) => {
   try {
      /*
       ★ 트랜잭션 처리: 주문 처리 중 에러 발생시 차감된 재고를 복구하지 않으면 
                        데이터 불일치 상태가 되므로 트랜잭션 처리가 필요

        <아래 3가지 쪼갤 수 없는 업무 단위인 트랜잭션으로 묶임, 3가지 중 하나라도 문제 발생시 3가지 작업 모두 취소(롤백)>
        -Order테이블에 주문내역 insert
        -Item 테이블에서 재고수량 차감
        -OrderItem 테이블에 주문상품 insert
       */
      const transaction = await sequelize.transaction() // 하나의 트랜잭션을 생성

      //주문상품 목록 데이터
      const { items } = req.body // req.body = { items: [{itemId: 1, count: 2 }, {itemId: 2, count: 1 }] } 이런 형태로 수신됨

      //회원 확인(주문은 회원만 가능)
      const user = await User.findByPk(req.user.id) // user = passport에서 역직렬화한 user데이터

      if (!user) {
         const error = new Error('존재하지 않는 회원입니다.')
         error.status = 404
         return next(error)
      }

      //1. Order테이블에 주문내역 insert
      const order = await Order.create(
         {
            userId: user.id,
            orderDate: new Date(), // 현재 날짜와 시간 저장
            orderStatus: 'ORDER',
         },
         { transaction } // 하나의 트랜잭션으로 묶을 작업에 { transantion } 작성
      )

      //2. Item 테이블에서 재고 차감
      let totalOrderPrice = 0 // 총 주문상품 가격을 저장하는 변수
      /* 
         Promise.all을 이용한 병렬처리 

         비동기 작업을 병렬(여러개를 동시에)실행해 성능을 최적화
         
         아래와 같이 for문을 이용한 처리는 단순하게 finkdByPk만 한다면 괜찮지만,
         코딩이 길어질수록 효율 떨어짐

         여러가지 일을 한번에 처리해야 한다면 비동기+병렬처리가 효율적
         */
      const orderItemData = await Promise.all(
         items.map(async (item) => {
            //1. 주문한 상품이 존재하는지 확인
            const product = await Item.findByPk(item.itemId, { transaction })
            if (!product) {
               throw new Error(`상품 id:${item.itemId}인 상품이 존재하지 않습니다.`) // -> throw로 에러처리하면 catch로 넘어간다~
            }
            //2. 주문한 상품의 재고가 있는지 확인->있으면 재고 차감
            if (product.stockNumber < item.count) {
               //재고가 주문 수량보다 적다면
               throw new Error(`상품 id:${item.itemId}인 상품이 재고가 부족합니다.`)
            }

            //재고 차감
            product.stockNumber -= item.count

            //3. 재고차감 후 item 테이블에 재고 update
            await product.save({ transaction }) // product가 Item테이블에서 pk로 찾아온 값이니까 그대로 save해주면 됨! 트랜잭션 처리도 포함~

            //4. 총 주문 상품 가격 누적합계 구하기
            const orderItemPrice = product.price * item.count
            totalOrderPrice += orderItemPrice
            /* 
            totalOrderPrice = map함수 밖에서 let으로 선언한 주문상품 총액(세팅값 0)
            map이 돌 때마다 각각의 상품과 가격정보를 매칭하므로 그 값을 totalOrderPrice에 누적시키면 
            모든 주문 상품에 대한 가격 총액이 됨
            */

            //5. orderItems 테이블에 insert할 객체 return
            return {
               orderId: order.id, // map 밖에서 선언됐기 때문에 item이 달라져도 동일한 전역값
               itemId: product.id,
               orderPrice: orderItemPrice,
               count: item.count,
            }
         })
      )
      //3. OrderItem테이블에 주문 상품 insert
      await OrderItem.bulkCreate(orderItemData, { transaction })

      //트랜잭션 커밋까즤~~~
      await transaction.commit()

      res.json({
         success: true,
         message: '주문이 성공적으로 생성되었습니다.',
         orderId: order.id,
         totalPrice: totalOrderPrice,
      })
   } catch (error) {
      await transaction.rollback() //트랜잭션 롤백

      error.status = 500
      error.message = '상품 주문 중 오류가 발생했습니다.'
      next(error)
   }
})

// localhost:8000/order/list?page=1&limit=5&startDate=2025-01-01&endDate=2025-01-16
// 주문 목록(페이징, 날짜 검색)
router.get('/list', isLoggedIn, async (req, res, next) => {
   try {
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 5
      const offset = (page - 1) * limit
      const startDate = req.query.startDate // YYYY-MM-DD 00:00:00
      const endDate = req.query.endDate
      const endDateTime = `${endDate} 23:59:59` // 년월일만 받을시 시분초는 00:00:00으로 인식하므로 시간 변경(endDate 날짜에 주문한 내용도 검색되도록)

      const count = await Order.count({
         where: {
            userId: req.user.id, // 주문자 id(pk)
            ...(startDate && endDate ? { orderDate: { [Op.between]: [startDate, endDateTime] } } : {}), // 날짜 검색
         },
      })

      const orders = await Order.findAll({
         where: {
            userId: req.user.id, // 주문자 id(pk)
            ...(startDate && endDate ? { orderDate: { [Op.between]: [startDate, endDateTime] } } : {}), // 날짜 검색
         },
         limit,
         offset,
         include: [
            {
               model: Item,
               attributes: ['id', 'itemNm', 'price'],
               // 교차테이블 데이터(OrderItem 테이블 에서 필요한 컬럼 선택)
               through: {
                  attributes: ['count', 'orderPrice'],
               },
               include: [
                  {
                     model: Img,
                     attributes: ['imgUrl'],
                     where: { repImgYn: 'Y' }, // 대표이미지만 가져온다
                  },
               ],
            },
         ],
         order: [['orderDate', 'DESC']], // 최근 주문내역이 먼저 오도록
      })

      res.json({
         success: true,
         message: '주문 목록 조회 성공',
         orders,
         pagination: {
            totalOrders: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            limit,
         },
      })
   } catch (error) {
      error.status = 500
      error.message = '주문 내역을 불러오는 중 오류가 발생했습니다.'
      next(error)
   }
})

//주문 취소
router.post('/cancel/:id', isLoggedIn, async (req, res, next) => {
   try {
      const transaction = await sequelize.transaction()
      const id = req.params.id
      const order = await Order.findByPk(id, {
         include: [
            {
               model: OrderItem,
               include: [{ model: Item }],
            },
         ],
      })

      if (!order) {
         const error = new Error('주문 내역이 존재하지 않습니다.')
         error.status = 404
         return next(error)
      }

      //이미 취소된 주문인 경우
      if (order.orderStatus === 'CANCEL') {
         const error = new Error('이미 취소된 주문입니다.')
         error.status = 400
         return next(error)
      }

      // 재고 복구 + 주문상태 변경 트랜잭션 처리
      //1. 재고 복구
      for (const orderItem of order.OrderItems) {
         //OrderItems안에서 for문 돌려서
         const product = orderItem.Item
         //각각의 상품 정의하고
         product.stockNumber += orderItem.count
         //주문한 갯수만큼 product.stockNumber에 추가함
         await product.save({ transaction }) //트랜잭션 꼭!!
      }

      //2. 주문 상태 변경
      order.orderStatus = 'CANCEL'
      await order.save({ transaction })

      //트랜잭션 결과 DB에 반영
      await transaction.commit()

      res.json({
         success: true,
         message: '주문이 성공적으로 취소되었습니다.',
      })
   } catch (error) {
      await transaction.rollback()
      error.status = 500
      error.message = '주문 취소 중 오류가 발생했습니다.'
      next(error)
   }
})

//주문 삭제
router.delete('/delete/:id', isLoggedIn, async (req, res, next) => {
   try {
      const id = req.params.id
      const order = await Order.findByPk(id)

      if (!order) {
         const error = new Error('주문내역이 없습니다.')
         error.status = 404
         return next(error)
      }

      await Order.destroy({ where: { id: order.id } })

      res.json({
         success: true,
         message: '주문이 성공적으로 삭제되었습니다.',
      })
   } catch (error) {
      error.status = 500
      error.message = '주문 삭제 중 오류가 발생했습니다.'
      next(error)
   }
})

module.exports = router

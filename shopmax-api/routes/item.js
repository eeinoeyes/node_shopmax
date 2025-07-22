const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { Op } = require('sequelize')
const { Item, Img } = require('../models')
const router = express.Router()

// uploads 폴더가 없을 경우 새로 생성
try {
   fs.readdirSync('uploads') //해당 폴더가 있는지 확인
} catch (error) {
   console.log('uploads 폴더가 없어 uploads 폴더를 생성합니다.')
   fs.mkdirSync('uploads') //폴더 생성
}

// 이미지 업로드를 위한 multer 설정
const upload = multer({
   // 저장할 위치와 파일명 지정
   storage: multer.diskStorage({
      destination(req, file, cb) {
         cb(null, 'uploads/') // uploads폴더에 저장
      },
      filename(req, file, cb) {
         const decodedFileName = decodeURIComponent(file.originalname) //파일명 디코딩(한글 파일명 깨짐 방지) => 제주도.jpg
         const ext = path.extname(decodedFileName) //확장자 추출
         const basename = path.basename(decodedFileName, ext) //확장자 제거한 파일명 추출

         // 파일명 설정: 기존이름 + 업로드 날짜시간 + 확장자
         // dog.jpg
         // ex) dog + 1231342432443 + .jpg
         cb(null, basename + Date.now() + ext)
      },
   }),
   // 파일의 크기 제한
   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB로 제한
})

// 상품등록
router.post('/', upload.array('img'), async (req, res, next) => {
   try {
      // 업로드된 파일 확인
      if (!req.files) {
         const error = new Error('파일 업로드에 실패했습니다.')
         error.status = 400
         return next(error)
      }

      // 상품(item) insert
      const { itemNm, price, stockNumber, itemDetail, itemSellStatus } = req.body

      const item = await Item.create({
         itemNm,
         price,
         stockNumber,
         itemDetail,
         itemSellStatus,
      })

      // 이미지(img) insert
      /*
         req.files = [file1, file2, file3 ...]

         file1 = {
            originalname: 'dog.png',
            filename: 'dog113232232.png'
            ...
         }
       */
      // imgs 테이블에 insert할 객체 생성
      const images = req.files.map((file) => ({
         oriImgName: file.originalname, // 원본 이미지명
         imgUrl: `/${file.filename}`, //이미지 경로
         repImgYn: 'N', // 기본적으로 'N' 설정
         itemId: item.id, // 생성된 상품 ID 연결
      }))

      // 첫 번째 이미지는 대표 이미지로 설정
      if (images.length > 0) images[0].repImgYn = 'Y'

      // 이미지 여러개 insert
      await Img.bulkCreate(images)

      res.status(201).json({
         success: true,
         message: '상품이 성공적으로 등록되었습니다.',
         item,
         images,
      })
   } catch (error) {
      error.status = 500
      error.message = '상품 등록 중 오류가 발생했습니다.'
      next(error)
   }
})

//전체 상품 불러오기
router.get('/', async (req, res, next) => {
   try {
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 5
      const offset = (page - 1) * limit

      //쿼리스트링에서 검색 데이터 추출하기(판매상태, 상품명, 상품설명)
      const searchTerm = req.query.searchTerm || ''
      const searchCategory = req.query.searchCategory || 'itemNm'
      const sellCategory = req.query.sellCategory

      //조건부 where절 만들기
      const whereClause = {
         ...(searchTerm && {
            [searchCategory]: {
               [Op.like]: `%${searchTerm}`,
            },
            /*
         전개연산자 (스프레드 연산자, ... 형태) 사용하는 이유?
         -> 조건적으로 객체를 추가하기 위해서
         빈 문자열(""), false, 0, null, undefined와 같은 falsy값을 무시하고 true인 값만 남기기 때문
         */
         }),
         ...(sellCategory && {
            itemSellStatus: sellCategory,
         }),
      }
      // localhost:8000/item?page=1&limit=3&sellCategory=SOLD_OUT&searchTerm=가방&searchCategory=itemDetail => 품절된 상품 중에서 상품설명 '가방'으로 검색

      /*
         whereClause = {
         itemDetail: {
            [Op.like]: '%가방%'
         },
         {itemSellStatus: 'SOLD_OUT'}
         }
      */

      //searchTerm이 존재한다면 해당 값(searchTerm)이 포함된 검색 범주(searchCategory)를 조건으로 추가
      //sequelize의 Op: SQL 쿼리에서 조건절(where 등)을 작성할 때 사용하는 "연산자(Operator)" 모음 객체

      const count = await Item.count({
         //where절 조건을 포함하는 전체 상품 갯수 가져오기
         where: whereClause,
      })

      const items = await Item.findAll({
         //페이징을 위한 데이터
         where: whereClause,
         limit,
         offset,
         order: [['createdAt', 'DESC']],
         include: [
            {
               model: Img,
               attributes: ['id', 'oriImgName', 'imgUrl', 'repImgYn'],
            },
         ],
      })
      res.json({
         success: true,
         message: '상품 목록 조회 성공',
         items,
         pagination: {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            limit,
         },
      })
   } catch (error) {
      error.status = 500
      error.message = '전체 상품 리스트를 불러오는 중 오류가 발생했습니다.'
      next(error)
   }
})
module.exports = router

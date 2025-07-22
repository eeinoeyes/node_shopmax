// 가격 콤마 추가
export const formatWithComma = (value) => {
   // value: 가격
   if (!value) return '' // 빈 값이면 빈문자열 리턴

   // 콤마제거 -> 숫자형으로 변경 -> 다시 콤마 추가
   return Number(value.replace(/,/g, '')).toLocaleString('ko-KR')
}

// 가격 콤마 제거
export const stripComma = (value) => {
   return value.replace(/,/g, '') // 콤마 제거
}

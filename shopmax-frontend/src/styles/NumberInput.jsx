import styled from 'styled-components'

const InputWrapper = styled.div`
   display: flex;
   align-items: center;
   border: 2px solid #ccc;
   border-radius: 8px;
   overflow: hidden;
   width: fit-content;
   background-color: #fff;

   &:focus-within {
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
   }
`

const Button = styled.button`
   background-color: #f0f0f0;
   border: none;
   width: 36px;
   height: 40px;
   font-size: 20px;
   cursor: pointer;

   &:hover {
      background-color: #e0e0e0;
   }

   &:disabled {
      color: #aaa;
      cursor: not-allowed;
   }
`

const Input = styled.input`
   width: 80px;
   padding: 8px 12px;
   border: none;
   font-size: 16px;
   text-align: center;
   outline: none;
   background: transparent;
`

function NumberInput({ value, onChange, min = 0, max = 100, step = 1 }) {
   const handleDecrease = () => {
      const newValue = Math.max(min, Number(value) - step)
      onChange({ target: { value: newValue } })
   }
   const handleIncrease = () => {
      const newValue = Math.min(max, Number(value) + step)
      onChange({ target: { value: newValue } })
   }

   //입력값이 직접 변경될 때 호출되는 함수
   const handleChange = (e) => {
      const newValue = e.target.value
      if (newValue === '' || (!isNaN(newValue) && newValue >= min && newValue <= max)) {
         onChange(e)
      }
   }

   return (
      <InputWrapper>
         <Button onClick={handleDecrease} disabled={value <= min}>
            -
         </Button>
         <Input type="number" value={value} onChange={() => {}} min={min} max={max} step={step} />
         <Button onClick={handleIncrease} disabled={value >= max}>
            +
         </Button>
      </InputWrapper>
   )
}

export default NumberInput

import type { ReactNode } from 'react'
import styled from 'styled-components'

interface InputProps {
  type: string,
  placeholder: string,
  width?: number
  icon?: ReactNode
}

interface InputStyles {
  $width?: number
}

const InputWrapper = styled.div<InputStyles>`
  position: relative; 
  width: ${({ $width }) => $width ? `${$width}%` : '100%'};
  border: 1px solid #00000038;
  border-radius: 3px;
  box-shadow: 0px 0px 1px 0px #00000038;
  display: flex; 
  align-items: center;
`

const StyledInput = styled.input`
  width: 100%; 
  border: none; 
  outline: none;
  padding: .4rem .4rem .4rem 2rem; 
`

const IconWrapper = styled.span`
  position: absolute;
  left: 0.5rem; 
  top: 55%; 
  transform: translateY(-50%);
  color: #00000070; 
  pointer-events: none; 
  font-size: 1rem;
`

export default function Input({ type, placeholder, width, icon } : InputProps) {
  return (
    <InputWrapper $width={width} >
      <IconWrapper>
        {icon}
      </IconWrapper>

      <StyledInput 
        type={type}
        placeholder={placeholder}
      />
    </InputWrapper>
  )
}
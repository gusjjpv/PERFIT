import type { ReactNode } from 'react'
import styled from 'styled-components'

interface InputProps {
  id?: string,
  type: string,
  placeholder?: string,
  width?: number,
  icon?: ReactNode,
  disabled?: boolean,
  padding?: string,
  isTextarea?: string,
  variant?: string,
  variantPlaceholder?: string,
  value?: string | number,
  minLength?: number | undefined,
  maxLength?: number | undefined,
  onChange?:(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, 
  required?: boolean
}

interface InputStyles {
  $width?: number,
  $disabled?: boolean,
  $padding?: string,
  $variant?: string,
  $variantPlaceholder?: string
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

const StyledInput = styled.input<InputStyles>`
  background-color: ${({ theme, $disabled }) => $disabled ? theme.colors.primary.orange : theme.colors.primary.white};
  &::placeholder {
    color: ${({ theme, $variantPlaceholder }) => {
      if ($variantPlaceholder) {
        switch ($variantPlaceholder) {
          case "primary":
            return theme.colors.primary.white;
          case "secondary":
            return theme.colors.primary.orange;
          case "tertiary":
            return theme.colors.primary.black;
          default:
            return theme.colors.primary.gray;
        }
      }
      return theme.colors.primary.gray;
    }};
    opacity: 1;
  }
  width: 100%; 
  border: none; 
  outline: none;
  padding: ${({ $padding }) => $padding ? `${$padding}` : '.4rem .4rem .4rem 2rem'};
`

const IconWrapper = styled.span<InputStyles>`
  position: absolute;
  left: 0.5rem; 
  top: 55%; 
  transform: translateY(-50%);
  color: ${({ theme, $variant, $disabled }) => {
    if ($variant) {
      switch ($variant) {
        case "primary":
          return theme.colors.primary.white;
        case "secondary":
          return theme.colors.primary.orange;
        case "tertiary":
          return $disabled ? theme.colors.primary.gray : theme.colors.primary.orange;
        default:
          return theme.colors.primary.gray;
      }
    }

    return theme.colors.primary.gray;
  }};
  pointer-events: none; 
  font-size: 1rem;
`

export default function Input({ id, type, placeholder, width, icon, disabled, padding, isTextarea, variant, variantPlaceholder, value, maxLength, minLength, onChange, required } : InputProps) {
  return (
    <InputWrapper $width={width} $disabled={disabled} $padding={padding} >
      {icon && (
        <IconWrapper $disabled={disabled} $variant={variant}>
          {icon}
        </IconWrapper>
      )}

      <StyledInput 
        id={id}
        as={isTextarea}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        $padding={padding}
        $variantPlaceholder={variantPlaceholder}
        value={value}
        onChange={onChange}
        minLength={minLength ? minLength : undefined}
        maxLength={maxLength ? maxLength : undefined}
        required={required}
      />
    </InputWrapper>
  )
}
import { type ReactNode } from 'react'
import styled from 'styled-components'

interface ButtonProps {
  children: ReactNode,
  font?: string,
  width?: string,
  color?: 'primary' | 'secondary',
  padding?: number,
  gradient?: boolean,
  type?: 'submit' | 'button'
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

interface ButtonStyles {
  $font?: string,
  $width?: string,
  $color?: 'primary' | 'secondary',
  $gradient?: boolean,
  $padding?: number
}

const ButtonContainer = styled.button<ButtonStyles>`
  font-size: ${({ $font }) => $font ? `${$font}rem` : '1rem'};
  font-weight: bold;
  width: ${({ $width }) => $width || '5rem'};
  background-color: ${({ theme, $color,  $gradient }) =>
    $color === 'primary' && !$gradient
      ? theme.colors.primary.red
      : theme.colors.primary.black};
  color: ${({ theme, $color, $gradient }) =>
    $color === 'secondary' && !$gradient
      ? theme.colors.primary.black
      : theme.colors.primary.white};
  background-image: ${({ $gradient }) => $gradient ? 'linear-gradient(to right, #1E90FF, #32CD32)' : 'none'};
  border: 1px solid #00000047;
  border-radius: 4px;
  padding: ${({ $padding }) => $padding ? `${$padding}rem` : '.5rem'};
  cursor: pointer;
`

export default function Button({ children, font, width, color, padding, type, onClick, gradient }: ButtonProps) {
  return (
    <ButtonContainer type={type} onClick={onClick} $font={font} $width={width} $color={color} $gradient={gradient} $padding={padding}>
      {children}
    </ButtonContainer>
  )
}

import { type ReactNode } from 'react'
import styled from 'styled-components'

interface ButtonProps {
  children: ReactNode,
  font?: string,
  width?: string,
  color?: 'primary' | 'secondary'
}

interface ButtonStyles {
  $font?: string,
  $width?: string,
  $color?: 'primary' | 'secondary'
}

const ButtonContainer = styled.button<ButtonStyles>`
  font-size: ${({ $font }) => $font ? `${$font}rem` : '1rem'};
  font-weight: bold;
  width: ${({ $width }) => $width || '5rem'};
/*   background-color: ${({ theme, $color }) =>
    $color === 'primary'
      ? theme.colors.primary.orange
      : theme.colors.primary.black};
  color: ${({ theme, $color }) =>
    $color === 'secondary'
      ? theme.colors.primary.black
      : theme.colors.primary.white}; */
  background-image: linear-gradient(to right, #1E90FF, #32CD32);
  border: 1px solid #00000047;
  border-radius: 4px;
  padding: .5rem;
  cursor: pointer;
`

export default function Button({ children, font, width, color }: ButtonProps) {
  return (
    <ButtonContainer $font={font} $width={width} $color={color}>
      {children}
    </ButtonContainer>
  )
}

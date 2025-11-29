import type { ReactNode } from "react";
import styled from "styled-components";

/* ------------------------------------------------------
   INTERFACE PÚBLICA — Props aceitas pelo componente
------------------------------------------------------ */
interface InputProps {
  id?: string;
  width?: number;
  icon?: ReactNode;
  disabled?: boolean;
  padding?: string;
  isTextarea?: "textarea";
  variant?: "primary" | "secondary" | "tertiary";
  variantPlaceholder?: "primary" | "secondary" | "tertiary";

  type?: string;
  placeholder?: string;
  value?: string | number;
  minLength: number | undefined;
  maxLength: number | undefined;
  required: boolean;

  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

/* ------------------------------------------------------
   INTERFACE INTERNA — Apenas props pra estilização
   NÃO vão para o DOM (por começar com $)
------------------------------------------------------ */
interface InputStyles {
  $width?: number;
  $disabled?: boolean;
  $padding?: string;
  $variant?: "primary" | "secondary" | "tertiary";
  $variantPlaceholder?: "primary" | "secondary" | "tertiary";
}

/* ------------------------------------------------------
   WRAPPER
------------------------------------------------------ */
const InputWrapper = styled.div<InputStyles>`
  position: relative;
  width: ${({ $width }) => ($width ? `${$width}%` : "100%")};
  border: 1px solid #00000038;
  border-radius: 3px;
  box-shadow: 0px 0px 1px 0px #00000038;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary.white};
`;

/* ------------------------------------------------------
   INPUT
------------------------------------------------------ */
const StyledInput = styled.input<InputStyles>`
  background-color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.primary.orange : theme.colors.primary.white};

  width: 100%;
  border: none;
  outline: none;
  padding: ${({ $padding }) => ($padding ? $padding : ".4rem .4rem .4rem 2rem")};

  &::placeholder {
    color: ${({ theme, $variantPlaceholder }) => {
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
    }};
    opacity: 1;
  }
`;

/* ------------------------------------------------------
   ÍCONE
------------------------------------------------------ */
const IconWrapper = styled.span<InputStyles>`
  position: absolute;
  left: 0.5rem;
  top: 55%;
  transform: translateY(-50%);
  font-size: 1rem;
  pointer-events: none;

  color: ${({ theme, $variant, $disabled }) => {
    if ($variant) {
      switch ($variant) {
        case "primary":
          return theme.colors.primary.white;
        case "secondary":
          return theme.colors.primary.orange;
        case "tertiary":
          return $disabled ? theme.colors.primary.gray : theme.colors.primary.orange;
      }
    }
    return theme.colors.primary.gray;
  }};
`;

/* ------------------------------------------------------
   COMPONENTE FINAL
------------------------------------------------------ */
export default function Input({
  id,
  width,
  icon,
  padding,
  isTextarea,
  variant,
  variantPlaceholder,
  disabled,
  ...props
}: InputProps) {
  return (
    <InputWrapper
      $width={width}
      $disabled={disabled}
      $padding={padding}
    >
      {icon && (
        <IconWrapper
          $disabled={disabled}
          $variant={variant}
        >
          {icon}
        </IconWrapper>
      )}

      <StyledInput
        id={id}
        as={isTextarea} // textarea opcional
        disabled={disabled}
        $padding={padding}
        $variantPlaceholder={variantPlaceholder}
        $variant={variant}
        {...props} // type, placeholder, onChange, value, etc
      />
    </InputWrapper>
  );
}

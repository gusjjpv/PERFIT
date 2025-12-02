import type { ReactNode } from "react";
import styled from "styled-components";

interface InputProps {
  id?: string;
  width?: number;
  icon?: ReactNode; 
  disabled?: boolean;
  padding?: string;
  isTextarea?: "textarea";
  variant?: "primary" | "secondary" | "tertiary";
  variantPlaceholder?: "primary" | "secondary" | "tertiary";
  marginBottom?: number;

  type?: string;
  placeholder?: string;
  value?: string | number;
  minLength?: number;
  maxLength?: number;
  required?: boolean;

  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

interface InputStyles {
  $width?: number;
  $disabled?: boolean;
  $padding?: string;
  $marginBottom?: number;
  $variant?: "primary" | "secondary" | "tertiary";
  $variantPlaceholder?: "primary" | "secondary" | "tertiary";
}

const InputWrapper = styled.div<InputStyles>`
  position: relative;
  width: ${({ $width }) => ($width ? `${$width}%` : "100%")};
  border-radius: 10px;
  padding: 2px;
  background-color: ${({ theme }) => theme.colors.primary.white};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  margin-bottom: ${({ $marginBottom }) => $marginBottom ? `${$marginBottom}rem` : '0'};
  transition: box-shadow .2s ease;

  &:focus-within {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.green}40;
  }
`;

const StyledInput = styled.input<InputStyles>`
  background-color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.primary.gray + "20" : theme.colors.primary.white};

  width: 100%;
  height: 48px;
  border: none;
  outline: none;
  padding: ${({ $padding }) => ($padding ? $padding : "0.75rem 0.75rem 0.75rem 2.6rem")};

  border-radius: 10px;

  font-size: 1rem;

  transition: background-color .3s ease;

  &::placeholder {
    color: ${({ theme, $variantPlaceholder }) => {
      switch ($variantPlaceholder) {
        case "primary":
          return theme.colors.primary.black + "90";
        case "secondary":
          return theme.colors.primary.orange;
        case "tertiary":
          return theme.colors.primary.gray;
        default:
          return theme.colors.primary.gray + "80";
      }
    }};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const IconWrapper = styled.span<InputStyles>`
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;

  color: ${({ theme, $variant, $disabled }) => {
    if ($disabled) return theme.colors.primary.gray + "80";

    switch ($variant) {
      case "primary":
        return theme.colors.primary.orange;
      case "secondary":
        return theme.colors.primary.blue;
      case "tertiary":
        return theme.colors.primary.black;
      default:
        return theme.colors.primary.gray;
    }
  }};
`;

export default function Input({
  id,
  width,
  icon,
  padding,
  marginBottom,
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
      $marginBottom={marginBottom}
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
        as={isTextarea}
        disabled={disabled}
        $padding={padding}
        $variantPlaceholder={variantPlaceholder}
        $variant={variant}
        {...props}
      />
    </InputWrapper>
  );
}

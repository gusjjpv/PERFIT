import React from 'react'
import styled from 'styled-components';
import Button from "../../atoms/Button"; // IMPORTAR AQUI

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  animation: fadeIn .2s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const ModalTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.4rem;
  font-weight: bold;
`;

const ModalText = styled.p`
  color: #444;
  margin-bottom: 2rem;
  font-size: 1rem;

  strong {
    font-weight: 700;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

interface ConfirmModalConfig {
  title: string,
  text: string,
  strongText?: string,
  endText?: string,
  setState: React.Dispatch<React.SetStateAction<boolean>>,
  func: () => void
}

export default function ConfirmModal({ title, text, strongText, endText, setState, func }: ConfirmModalConfig) {
  return (
    <Overlay>
      <ModalContainer>

        <ModalTitle>{title}</ModalTitle>

        <ModalText>
          {text}
          {strongText && <> <strong>{strongText}</strong> </>}
          {endText && <> {endText}</>}
        </ModalText>

        <ModalButtons>
          <Button width="8rem" onClick={() => setState(false)}>
            Cancelar
          </Button>

          <Button width="8rem" onClick={func}>
            Confirmar
          </Button>
        </ModalButtons>

      </ModalContainer>
    </Overlay>
  )
}

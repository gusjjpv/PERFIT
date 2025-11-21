import { useContext, useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components'
import { ModalContext } from '../../../context/ModalContext';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';

const slideUp = keyframes`
  from {
    transform: translate(-50%, 100vh); 
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0%); 
    opacity: 1;
  }
`;

const slideDown = keyframes`
  from {
    transform: translate(-50%, 0%); 
    opacity: 1;
  }
  to {
    transform: translate(-50%, 100vh); 
    opacity: 0;
  }
`;

interface CreateStudentStyleProps {
  $isModal: boolean,
  $offAnimation: boolean
}

const Container = styled.div<CreateStudentStyleProps>`
  position: fixed; 
  height: 70%;   
  overflow-y: auto; 
  will-change: transform;
  top: 20%; 
  left: 50%;    
  transform: translate(-50%, -50%); 
  width: 95%;
  background-image: linear-gradient(139deg, #ffffff, #d7e2ef);
  border: 1px solid #0000003d;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  z-index: 10;
${({ $isModal, $offAnimation }) => {
  if ($offAnimation) {
    return css`
      animation: ${slideDown} 0.3s ease-in forwards;
      opacity: 1;
      pointer-events: auto;
    `;
  } 
  else if ($isModal) { 
    return css`
      animation: ${slideUp} 0.3s ease-out forwards;
      opacity: 1;
      pointer-events: auto;
    `;
  }
  return '';
}}

  h2 {
    font-weight: 700;
    padding: 1rem 0 0 0.5rem;
  }

  @media (min-width: 768px) {
    max-width: 50%;
  }
`

const ContainerCloseModalBtn = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`

const ContainerForm = styled.form` 
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-top: 3rem;

  div {
    margin-bottom: 1rem;
  }
`

const StyledLabel = styled.label`
  background-image: linear-gradient(to bottom, #1E90FF, #32CD32);
  -webkit-background-clip: text; 
  background-clip: text;
  font-weight: 700;
  color: transparent;
  width: 90%;
  text-align: left;
  margin: 0 auto .3rem auto;
`


export default function CreateStudent() {
  const { isModal, setIsModal } = useContext(ModalContext)
  const [ offAnimation, setOffAnimation ] = useState<boolean>(false)
  const [ username, setUsername ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  const [ email, setEmail ] = useState<string>('')
  const [ firstName, setFirstname ] = useState<string>('')

  const closeModal = () => {
    setOffAnimation(true)
  }

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log(username)
      console.log(password)
      console.log(email)
      console.log(firstName)
    } catch(error) {
      console.log("Internal Error:", error) 
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if(offAnimation) {
        setIsModal(false)
        setOffAnimation(false)
      }
    }, 900)

    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offAnimation])


  return (
    <Container $isModal={isModal} $offAnimation={offAnimation}>
      <h2>Cadastrar novo aluno(a)</h2>
      <ContainerCloseModalBtn>
        <Button onClick={closeModal}>X</Button>
      </ContainerCloseModalBtn>

      <ContainerForm onSubmit={handleCreateStudent}>
        <StyledLabel>Usuário</StyledLabel>
        <Input id='1' type='text' placeholder='Digite o nome de usuário' width={90} variantPlaceholder='tertiary' padding="0.5rem 0.5rem .6rem .5rem" onChange={(e) => setUsername(e.target.value)} />

        <StyledLabel>Senha</StyledLabel>
        <Input id='2' type='text' placeholder='Digite a senha' width={90} padding="0.5rem 0.5rem .6rem .5rem" variantPlaceholder='secondary' onChange={(e) => setPassword(e.target.value)} />

        <StyledLabel>Email</StyledLabel>
        <Input id='3' type='email' placeholder='Digite o email' width={90} padding="0.5rem 0.5rem .6rem .5rem" variantPlaceholder='primary' onChange={(e) =>  setEmail(e.target.value)} />

        <StyledLabel>Primeiro nome</StyledLabel>
        <Input id='4' type='text' placeholder='Digite o primeiro nome' width={90} padding="0.5rem 0.5rem .6rem .5rem" variantPlaceholder='primary' onChange={(e) => setFirstname(e.target.value)} />

        <Button width='100'>Cadastrar</Button>
      </ContainerForm>

    </Container>
  )
}
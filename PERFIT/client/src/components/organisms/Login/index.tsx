import styled from 'styled-components'
import LoginForm from '../../molecules/LoginForm'
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

const ContainerLogin = styled.div`
  position: absolute;
  width: 95%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border: 1px solid black;
  border-radius: 10px;
  padding: 2.5rem 0;

  @media (min-width: 768px) {
    max-width: 50%;
  }
`

export default function Login() {
  const inputs = [
    { id: 'name', label: 'Nome', type: 'text', placeholder: 'Digite seu nome', icon: <FaUser /> },
    { id: 'password', label: 'Senha', type: 'password', placeholder: 'Digite sua senha', icon: <RiLockPasswordFill /> },
  ]

  return (
    <ContainerLogin>
      <LoginForm input={inputs} />
    </ContainerLogin>
)
}

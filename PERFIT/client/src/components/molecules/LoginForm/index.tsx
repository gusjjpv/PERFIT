import styled from 'styled-components'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import { useContext, useEffect, useState, type ReactNode } from 'react'
import React from 'react' 
import { handleLogin } from '../../../auth/auth'
import { useNavigate } from 'react-router-dom'
import { error } from '../../../utils/toastfy'
import { UserContext } from '../../../context/UserContext'
import { setItemInLocalStorage } from '../../../storage/LocalStorage'

interface InputProps {
  id: string
  label: string
  type: string
  placeholder: string
  icon: ReactNode
}

interface LoginFormProps {
  input: InputProps[]
}

const Container = styled.form` 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  h3 {
    font-size: 1.2rem;
    white-space: nowrap;
    margin-bottom: 2rem;
  }
`

const LogoContainer = styled.div`
  width: 50%;
  
  img {
    width: 100%;
    margin: -1rem auto 1rem auto;
  }
`

const ContainerForm = styled.div` 
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
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

const ContainerInput = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  margin-bottom: 1.5rem;
`

export default function LoginForm({ input } : LoginFormProps) {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate() 
  
  const login = async (e: React.FormEvent) => {
    e.preventDefault() 

    const response = await handleLogin(username, password)
    setUser(response)

    setItemInLocalStorage(response.access, response.refresh, response)
  }

  useEffect(() => {
    if (user) {
      if (user.role === "professor") {
        navigate('/personal');
      }

      if (user.role === "aluno") {
        navigate('/aluno');
      }

      if (user?.detail) {
        const detail = user.detail?.toString().trim();
        if (detail) error(detail);
      }
    }
  }, [user, navigate]);

  return (
    <Container onSubmit={login}> 
      <LogoContainer>
        <img loading='lazy' src="/logo.png" alt="Logo" />
      </LogoContainer>
        
      <h3>Faça login e comece a usar! </h3> 

      <ContainerForm>
        {input.map((item) => (
          <React.Fragment key={item.id}> 
            <StyledLabel htmlFor={item.id}>{item.label}</StyledLabel>
            
            <ContainerInput>
              {item.id === 'name' ? (
                <Input 
                  id={item.id} 
                  type={item.type} 
                  placeholder={item.placeholder} 
                  icon={item.icon} 
                  onChange={(e) => setUsername(e.target.value)} 
                  minLength={3}
                  maxLength={20}
                  required
                />
              ) : (
                <Input 
                  id={item.id} 
                  type={item.type} 
                  placeholder={item.placeholder} 
                  icon={item.icon} 
                  onChange={(e) => setPassword(e.target.value)} 
                  minLength={8}
                  maxLength={16}
                  required
                />
              )}
            </ContainerInput>
          </React.Fragment>
        ))}
        
        <Button padding={.7} width='10rem' gradient={true}>
          Entrar
        </Button>
      </ContainerForm>
    </Container>
  )
}
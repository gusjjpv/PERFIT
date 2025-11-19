import styled from 'styled-components'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import type { ReactNode } from 'react'

interface LoginFormProps {
  input: {
    id: string
    label: string
    type: string
    placeholder: string,
    icon: ReactNode
  }[]
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
  -webkit-background-clip: text; /* Suporte para navegadores que usam prefixo */
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
  return (
    <Container>
      <LogoContainer>
        <img loading='lazy' src="/logo.png" alt="Logo" />
      </LogoContainer>
        
      <h3>Faça login e comece a usar! </h3> 

      <ContainerForm>
        {input.map((item) => (
          <>            
            <StyledLabel htmlFor={item.id}>{item.label}</StyledLabel>
            <ContainerInput>
              <Input type={item.type} placeholder={item.placeholder} icon={item.icon} />
            </ContainerInput>
          </>
        ))}
      </ContainerForm>

      <Button width='15rem' gradient={true}>Entrar</Button>

    </Container>
  )
}

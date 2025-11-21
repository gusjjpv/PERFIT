import styled from "styled-components";
import Input from "../../atoms/Input";
import { FaUser } from "react-icons/fa";
import { GiAges } from "react-icons/gi";
import { MdHealthAndSafety } from "react-icons/md";
import { GiBodyHeight } from "react-icons/gi";
import { FaWeightHanging } from "react-icons/fa";
import { BsFillUsbMicroFill } from "react-icons/bs";
import { useState, type Dispatch, type SetStateAction } from "react";
import Button from "../../atoms/Button";
import { error, success } from "../../../utils/toastfy";

interface StudentInfoProps {
  goal?: string,
  setGoal?: Dispatch<SetStateAction<string>>,
  isEdit?: boolean,
  setIsEdit?: Dispatch<SetStateAction<boolean>>,
  disabled?: boolean
}

const WrapperScroll = styled.div<StudentInfoProps>`
  max-height: calc(100vh - 300px); 
  overflow-y: auto;
  padding-bottom: 100px;
`

const ContainerForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-top: 2rem;
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

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;
`

const Divider = styled.hr`
  width: 70%; 
  border: none;
  border-top: 1px solid #ff450070; 
  margin: 1rem auto 0 auto; 
`;

const MeajuresContainer = styled.div`
  display: flex;
  justify-content: space-between; 
  align-items: center;
  width: 60%; 
  margin: 2rem auto 0 auto; 
  padding: 0.5rem 0;
`;

const MeajureText = styled.div`
  display: flex;
  align-items: center;
  gap: .5rem;
  
  h3 {
    margin: 0; 
    font-size: 1rem;
    color: #333;
  }
  
  svg {
    color: #888; 
    font-size: 1.2rem;
  }
`;

const ValueText = styled.p`
  font-size: 1rem;
  font-weight: bold;
  color: #444;
  text-align: center; 
  flex-shrink: 0; 
  width: 30%; 
`;

const ContainerBtns = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  position: relative;
  top: 50px;
`

export default function StudentInfo({ goal, setGoal, isEdit, setIsEdit, disabled } : StudentInfoProps) {
  const [ name, setName ] = useState<string>('')
  const [ age, setAge ] = useState<number>(0)
  const [ healthProblem, setHealthProblem ] = useState<string>('')
  const [ height, setHeight ] = useState<string>('')
  const [ weight, setWeight ] = useState<string>('')
  const [ imc, setImc ] = useState<string>('')
  

  const handleEdit = () => {
    if(!name?.trim() || !healthProblem?.trim() || !height?.trim() || !weight?.trim() || !imc?.trim() || age <= 0) {
      console.log("Error getting name, age or health problem", name, healthProblem)
      error("Erro")
      return
    } 

    console.log("Objetivo:", goal)
    console.log("Nome:", name)
    console.log("Idade:", age)
    console.log("Problema:", healthProblem)
    console.log("Altura:", height)
    console.log("Peso:", weight)
    console.log("IMC:", imc)

    success("Funcionado!")

    if(setIsEdit) {
      setIsEdit(false)
    }
  }

  const closeEdition = () => {
    if(setIsEdit) {
      setIsEdit(false)
    }

    if(setGoal) {
      setGoal('')
    }
    setName('')
    setAge(0)
    setHealthProblem('')
  }

  return (
    <>
        <WrapperScroll disabled={disabled}>
            <ContainerForm>
            <StyledLabel>Nome</StyledLabel>
            <InputWrapper>
                <Input id="1" type="text" placeholder="Fulano" width={90} icon={<FaUser />} disabled={disabled} variant="tertiary" onChange={(e) => setName(e.target.value)} />
            </InputWrapper>

            <StyledLabel>Idade</StyledLabel>
            <InputWrapper>
                <Input id="2" type="number" placeholder="60" width={90} icon={<GiAges />} disabled={disabled} variant="tertiary" onChange={(e) => setAge ? setAge(Number(e.target.value)) : ''}/>
            </InputWrapper>

            <StyledLabel>Problemas de saúde</StyledLabel>
            <InputWrapper>
                <Input id="3" type="text" placeholder="Preguiça" width={90} icon={<MdHealthAndSafety />} disabled={disabled} variant="tertiary" onChange={(e) => setHealthProblem(e.target.value)} />
            </InputWrapper>
            </ContainerForm>

          <Divider />
          <MeajuresContainer>
              <MeajureText>
              <GiBodyHeight />
              <h3>Altura</h3>
              </MeajureText>
              {isEdit ? (
                <Input id="4" type="text" placeholder="1.70cm" width={25} padding=".5rem 0rem 0.3rem .2rem" onChange={(e) => setHeight(e.target.value)} />
              ) : (
                <ValueText>1.70cm</ValueText>
              )}
          </MeajuresContainer>

          <MeajuresContainer>
              <MeajureText>
              <FaWeightHanging />
              <h3>Peso</h3>
              </MeajureText>
              {isEdit ? (
                <Input id="5" type="text" placeholder="65kg" width={25} padding=".5rem 0rem 0.3rem .2rem" onChange={(e) => setWeight(e.target.value)} />
              ) : (
                <ValueText>65kg</ValueText>
              )}
          </MeajuresContainer>

          <MeajuresContainer>
              <MeajureText>
              <BsFillUsbMicroFill />
              <h3>IMC</h3>
              </MeajureText>
              {isEdit ? (
                <Input id="6" type="text" placeholder="22.2" width={25} padding=".5rem 0rem 0.3rem .2rem" onChange={(e) => setImc(e.target.value)} />
              ) : (
                <ValueText>22.2</ValueText>
              )}
          </MeajuresContainer>

          {isEdit && (
            <ContainerBtns>
              <Button onClick={handleEdit} gradient={true}>Salvar</Button>
              <Button onClick={closeEdition} color="primary">Cancelar</Button>
            </ContainerBtns>
          )}
        </WrapperScroll>
        
    </>
  )
}


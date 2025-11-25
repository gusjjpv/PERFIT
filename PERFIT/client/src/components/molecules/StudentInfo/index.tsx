import styled from "styled-components";
import Input from "../../atoms/Input";
import { FaUser } from "react-icons/fa";
import { GiAges } from "react-icons/gi";
import { MdHealthAndSafety, MdWork } from "react-icons/md";
import { GiBodyHeight } from "react-icons/gi";
import { FaWeightHanging } from "react-icons/fa";
import { BsFillUsbMicroFill } from "react-icons/bs";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import Button from "../../atoms/Button";

interface StudentProps {
  weight: number, 
  height: number, 
  bmi: string, 
  goal: string, 
  idade: number,
  data_nascimento: string,
  profession: string, 
  healthProblem: string
}

interface StudentInfoProps {
  goal?: string,
  setGoal?: Dispatch<SetStateAction<string>>,
  isEdit?: boolean,
  setIsEdit?: Dispatch<SetStateAction<boolean>>,
  disabled?: boolean,
  patchUser?: (data: StudentProps) => Promise<void>,
  getInfo?: () => Promise<{
    peso: number;
    altura: number;
    objetivo: string;
    imc: string;
    idade: number;
    data_nascimento: string;
    profissao: string;
    problema_saude: string;
  }>
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

export default function StudentInfo({ goal, setGoal, isEdit, setIsEdit, disabled, patchUser, getInfo } : StudentInfoProps) {
  const [ name, setName ] = useState<string>('')
  const [ age, setAge ] = useState<number>(0)
  const [ date, setDate ] = useState<string>('')
  const [ profession, setProfession ] = useState<string>('')
  const [ healthProblem, setHealthProblem ] = useState<string>('')
  const [ height, setHeight ] = useState<number>(0)
  const [ weight, setWeight ] = useState<number>(0)
  const [ bmi, setBmi ] = useState<string>('0')
  

  const handleEdit = async () => {

    const studentData: StudentProps = {
      weight, 
      height, 
      bmi, 
      goal, 
      data_nascimento: date,
      idade: age,
      profession, 
      healthProblem
    }
    
    try {
      if(patchUser) await patchUser(studentData)
      if(setIsEdit) setIsEdit(false) 
    } catch (error) {
        // Tratar erro
        console.error("Erro ao salvar dados", error);
    }

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

  useEffect(() => {
    const catchInfo = async () => {
      if(getInfo) {
        const data = await getInfo()

        if(data) {
          setWeight(data.peso)
          setHeight(data.altura)
          if(setGoal) setGoal(data.objetivo)
          setBmi(data.imc)
          setAge(data.idade)
          setDate(data.data_nascimento)
          setProfession(data.profissao)
          setHealthProblem(data.problema_saude)
        }
      }
    }

    catchInfo()
  }, [])

  return (
    <>
      <WrapperScroll disabled={disabled}>
        <ContainerForm>
          <StyledLabel>Nome</StyledLabel>
          <InputWrapper>
              <Input id="1" type="text" placeholder="Fulano" width={90} icon={<FaUser />} disabled={disabled} variant="tertiary" value={name} onChange={(e) => setName(e.target.value)} />
          </InputWrapper>

          <StyledLabel>Idade</StyledLabel>
          <InputWrapper>
              <Input id="2" type="number" placeholder="60" width={90} icon={<GiAges />} disabled={true} variant="tertiary" value={age} onChange={(e) => setAge(Number(e.target.value))}/>
          </InputWrapper>

          <StyledLabel>Data de nascimento</StyledLabel>
          <InputWrapper>
              <Input id="3" type="date" placeholder="" width={90} icon={<GiAges />} disabled={disabled} variant="tertiary" value={date} onChange={(e) => setDate(e.target.value)}/>
          </InputWrapper>

          <StyledLabel>Profissão</StyledLabel>
          <InputWrapper>
              <Input id="4" type="text" placeholder="Ex.: Professor(a)" width={90} icon={<MdWork />} disabled={disabled} variant="tertiary" value={profession} onChange={(e) => setProfession(e.target.value)}/>
          </InputWrapper>

          <StyledLabel>Problemas de saúde</StyledLabel>
          <InputWrapper>
              <Input id="5" type="text" placeholder="Preguiça" width={90} icon={<MdHealthAndSafety />} disabled={disabled} variant="tertiary" value={healthProblem} onChange={(e) => setHealthProblem(e.target.value)} />
          </InputWrapper>
        </ContainerForm>

        <Divider />
        <MeajuresContainer>
            <MeajureText>
            <GiBodyHeight />
            <h3>Altura</h3>
            </MeajureText>
            {isEdit ? (
              <Input id="6" type="number" placeholder="1.70cm" width={25} padding=".5rem 0rem 0.3rem .2rem" onChange={(e) => setHeight(Number(e.target.value))} />
            ) : (
              <ValueText>{height} cm</ValueText>
            )}
        </MeajuresContainer>

        <MeajuresContainer>
            <MeajureText>
            <FaWeightHanging />
            <h3>Peso</h3>
            </MeajureText>
            {isEdit ? (
              <Input id="7" type="number" placeholder="65kg" width={25} padding=".5rem 0rem 0.3rem .2rem" onChange={(e) => setWeight(Number(e.target.value))} />
            ) : (
              <ValueText>{weight} kg</ValueText>
            )}
        </MeajuresContainer>

        <MeajuresContainer>
            <MeajureText>
            <BsFillUsbMicroFill />
            <h3>IMC</h3>
            </MeajureText>
            {isEdit ? (
              <Input id="8" type="text" placeholder="22.2" width={25} padding=".5rem 0rem 0.3rem .2rem" onChange={(e) => setBmi(e.target.value)} />
            ) : (
              <ValueText>{bmi ?? '0'}</ValueText>
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


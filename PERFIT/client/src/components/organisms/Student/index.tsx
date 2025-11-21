import styled from "styled-components";
import { FaEdit, FaInfoCircle, FaClipboardList, FaCog } from "react-icons/fa"; 
import { useContext, useEffect, useState } from "react";
import Footer from "../Footer";
import StudentInfo from "../../molecules/StudentInfo";
import { LoadingContext } from "../../../context/LoadingContext";
import Loading from "../../../animation/loading";
import Input from "../../atoms/Input";

interface StudentInfoStyle {
  $chosenSection: boolean
}

const Container = styled.div`
  position: absolute;
  //height: 650px;
  height: 95%;
  width: 95%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border: 1px solid black;
  border-radius: 10px;
  padding: 2.5rem 0;
  overflow-y: auto;

  @media (min-width: 768px) {
    max-width: 50%;
  }
`

const ContainerSecond = styled.div`
  display: flex;
  flex-direction: column; 
  width: 95%;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
  padding: 1rem; 
  margin: auto;
`;

const TopSection = styled.div`
  display: flex;
  align-items: flex-start; 
  gap: 1rem; 
  margin-bottom: 1rem; 
  position: relative; 
`;

const Avatar = styled.div`
  width: 80px; 
  height: 80px; 
  border-radius: 50%; 
  background-color: #ff0000; 
  flex-shrink: 0; 

  /*
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  */
`;



// No componente Student.jsx
const TextContent = styled.div`
  display: flex;
  flex-direction: column; 
  flex-grow: 1;
  min-width: 0; /* <--- CORREÇÃO CRÍTICA: Permite que o flex item (TextContent) seja menor que o conteúdo */
      /* <--- NOVO: Limita a altura do parágrafo a cerca de 3-4 linhas */

  
  h2 {
    font-size: 1.5rem;
    margin: 0 0 0.2rem 0;
    font-weight: bold;
    color: #333;
  }

  p {
    overflow-y: auto;
    max-height: 5rem;
    font-size: 0.95rem;
    margin: 0;
    color: #666;
    line-height: 1.3;
  }
`;

const EditIcon = styled.div`
  position: absolute; 
  top: 0; 
  right: 0; 
  font-size: 1.2rem;
  color: #888;
  cursor: pointer;
`;

const BottomIcons = styled.div`
  display: flex;
  justify-content: flex-start; 
  align-items: center;
  gap: 1.5rem;
  padding-top: 1rem; 
  border-top: 1px solid #eee; 
`;

const IconWrapper = styled.div<StudentInfoStyle>`
  font-size: 1.5rem; 
  color: ${({ theme, $chosenSection }) => $chosenSection ? `${theme.colors.primary.orange}` : '#888'};
  cursor: pointer;
`

const ConfigContainer = styled.div`
  margin-left: auto;
`

/* const ContainerBtns = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  position: relative;
  top: 50px;
` */

export default function Student() {
  const [ chosenSection, setChosenSection ] = useState<string>('info')
  const [ isEdit, setIsEdit ] = useState<boolean>(false)
  const [ goal, setGoal ] = useState<string>('')
  const { loading, setLoading } = useContext(LoadingContext)

  const handleSection = (newSection: string) => {
    setChosenSection(newSection)
  }

  const toogleEdition = () => {
    setIsEdit((prev) => !prev)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)
    
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Container>
        {loading ? (
          <Loading />
        ) : (
          <>
            <ContainerSecond>
              <TopSection>
                <Avatar>
                  {/* <img src="/caminho/para/avatar.png" alt="Avatar do Aluno" /> */}
                </Avatar>
    
                <TextContent>
                  <h2>Fulano</h2>
                  {isEdit ? (
                    <Input id="0" type="textarea" placeholder="Tenho como objetivo emagrecer Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque nobis amet modi quasi accusantium perferendis blanditiis quod. Tempore odit, fuga sed nisi laudantium nulla, quae, labore expedita in nesciunt blanditiis!" disabled={!isEdit} padding="0.5rem 0.5rem 3rem .5rem" isTextarea="textarea" onChange={(e) => setGoal(e.target.value)} />
                  ) : (
                    <p>Tenho como objetivo emagrecer Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque nobis amet modi quasi accusantium perferendis blanditiis quod. Tempore odit, fuga sed nisi laudantium nulla, quae, labore expedita in nesciunt blanditiis!</p>
                  )}
                </TextContent>
                
                <EditIcon>
                  <FaEdit onClick={toogleEdition}/> 
                </EditIcon>
              </TopSection>
    
              <BottomIcons>
                <IconWrapper $chosenSection={chosenSection === 'info'} onClick={() => handleSection('info')}>
                  <FaInfoCircle onClick={() => handleSection('info')} />
                </IconWrapper>
    
                <IconWrapper $chosenSection={chosenSection === 'a.v.'} onClick={() => handleSection('a.v.')}>
                  <FaClipboardList onClick={() => handleSection('a.v.')} /> 
                </IconWrapper>
    
                <ConfigContainer>
                  <IconWrapper $chosenSection={chosenSection === 'config'} onClick={() => handleSection('config')}>
                    <FaCog onClick={() => handleSection('config')} /> 
                  </IconWrapper>
                </ConfigContainer>
              </BottomIcons>
    
            </ContainerSecond>
            
            {chosenSection === 'info' && (
              <StudentInfo goal={goal} setGoal={setGoal} isEdit={isEdit} setIsEdit={setIsEdit} disabled={!isEdit} />
            )}

{/*             {isEdit && (
              <ContainerBtns>
                <Button onClick={closeEdition} gradient={true}>Salvar</Button>
                <Button onClick={closeEdition} color="primary">Cancelar</Button>
              </ContainerBtns>
            )} */}
          </>
        )}

      </Container>


      <Footer />
    </>
  );
}